import { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import PushNotification from "react-native-push-notification";
import axios from "axios";
import { Alert } from "react-native";
import * as Notifications from "expo-notifications";
import { navigate } from "../root_navigation/Navigation";

export const AuthContext = createContext();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // null = still loading
  // const BASE_URL = "https://663e97245b4e.ngrok-free.app/api";
  // const BASE_URL = "https://bongacrmrental.loca.lt/api";
  const BASE_URL = "http://10.0.2.2:4000/api";
  // const BASE_URL_UPLOAD = " https://663e97245b4e.ngrok-free.app";
  // const BASE_URL_UPLOAD = "https://bongacrmrental.loca.lt";
  const BASE_URL_UPLOAD = "http://10.0.2.2:4000";
  const [userData, setUserData] = useState({
    customerid: null,
    fullname: "",
    address: "",
    phonenumber: "",
    email: "",
    driverslicense: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [lastStatus, setLastStatus] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  const getCustomer = async () => {
    try {
      const value = await AsyncStorage.getItem("@customer");
      if (value !== null) {
        return JSON.parse(value); // convert back to object
      }
      return null; // nothing saved
    } catch (error) {
      console.error("Error retrieving customer:", error);
      return null;
    }
  };

  const formatedDate = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatedDateNoHours = (date) => {
    if (!date) return "";

    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const getProfileImage = async () => {
    try {
      const value = await AsyncStorage.getItem("@profileImage");
      if (value !== null) {
        return JSON.parse(value); // convert back to object
      }
      return null; // nothing saved
    } catch (error) {
      console.error("Error retrieving profile image:", error);
      return null;
    }
  };

  const scheduleOverdueReminder = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Booking Overdue 🚨",
        body: "Please open the app and settle your booking.",
      },
      trigger: {
        hour: 9, // 9 AM every day
        minute: 0,
        repeats: true, // repeats daily
      },
    });
  };

  const cancelAllReminders = async () => {
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  // check login state from AsyncStorage on app start
  useEffect(() => {
    const loadLoginState = async () => {
      try {
        const stored = await AsyncStorage.getItem("@isLoggedIn");
        const customer = await getCustomer();
        const image = await getProfileImage();

        setIsLoggedIn(stored === "true");
        setUserData(customer);
        if (image !== null) {
          if (image.profileImage !== null) {
            setProfileImage(image.profileImage);
          } else {
            setProfileImage("http://10.0.2.2:4000/uploads/profile.jpg");
          }
        }
      } catch (error) {
        console.error("Error loading login state:", error);
        setIsLoggedIn(false);
      }
    };

    loadLoginState();

    // Request permissions
    const register = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        alert("Permission for notifications not granted!");
      }
    };
    register();

    // Foreground listener
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    // When user taps a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
        const screen = response.notification.request.content.data?.screen;

        if (screen) {
          navigate(screen);
        } else {
          console.warn("No screen provided in notification data");
        }
      });
  }, []);

  const scheduleBookingReminders = async (bookingid, dropoffdate) => {
    const dropoff = new Date(dropoffdate);
    const today = new Date();

    // 1 day before
    const dayBefore = new Date(dropoff);
    dayBefore.setDate(dropoff.getDate() - 1);

    // Same day (morning, e.g., 9AM)
    const sameDay = new Date(dropoff);
    sameDay.setHours(9, 0, 0, 0);

    // Normalize times for comparison
    dayBefore.setHours(20, 25, 0, 0);
    today.setHours(20, 25, 0, 0);

    // Schedule only if times are in the future
    if (today >= dayBefore && today <= dropoff) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Reminder",
          body: "Your car drop-off is tomorrow. Please prepare!",
          //data: { bookingid },
        },
        trigger: { type: "date", date: dayBefore },
      });

      await AsyncStorage.setItem(key, "true"); // mark as scheduled
      console.log("Notification scheduled for:", dayBefore);
    }

    if (today >= sameDay && today <= dropoff) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Drop-Off Reminder",
          body: "Your car is due for drop-off today. Don’t forget!",
          //data: { bookingId },
        },
        trigger: { type: "date", date: sameDay },
      });

      await AsyncStorage.setItem(key, "true"); // mark as scheduled
      console.log("Notification scheduled for:", sameDay);
    }
  };

  const checkBookingAndSchedule = async () => {
    try {
      const responseBooking = await axios.post(
        `${BASE_URL}/bookings/checkNotification/`,
        { customerid: userData?.customerid }
      );

      if (responseBooking.data[0]?.status === "Active") {
        const key = `dropoffNotif_${responseBooking.data[0]?.bookingid}`;
        const alreadyScheduled = await AsyncStorage.getItem(key);
        if (!alreadyScheduled) {
          scheduleBookingReminders(
            responseBooking.data[0]?.bookingid,
            responseBooking.data[0]?.dropoffdate
          );
        } else {
          console.log("Notification already scheduled: ");
          return;
        }
      }
    } catch (err) {
      console.error("Error checking booking status:", err);
    }
  };

  const checkBookingCompleted = async () => {
    try {
      const responseBooking = await axios.post(
        `${BASE_URL}/bookings/checkNotification/`,
        { customerid: userData?.customerid }
      );

      if (responseBooking.data[0]?.status !== lastStatus) {
        setLastStatus(responseBooking.data[0]?.status);
        if (
          responseBooking.data[0]?.status === "Overdue" ||
          responseBooking.data[0]?.status === "Completed"
        ) {
          if (!responseBooking.data[0]?.hasbeennotified) {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: "Car checked-in Complete",
                body: "Please open the app and proceed with payment.",
                data: { screen: "MyInvoice" },
              },
              trigger: null, // null = fire immediately
            });

            //seperate this as a seperate functon
            const responseNotified = await axios.post(
              `${BASE_URL}/bookings/updateHasBeenNotifiedBooking`,
              { bookingid: responseBooking.data[0]?.bookingid }
            );

            if (responseNotified.status === 200) {
              if (responseNotified.data !== false) {
                console.log(
                  "Updated hasbeennotified of booking: ",
                  responseNotified.data[0]?.bookingid
                );
              } else {
                console.error(
                  "Failed to update hasbeennotified of booking: ",
                  responseBooking.data[0]?.bookingid
                );
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Error checking booking status:", err);
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      checkBookingAndSchedule();
      checkBookingCompleted();
    }, 30000);

    return () => clearInterval(interval);
  }, [lastStatus]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        profileImage,
        setProfileImage,
        formatedDate,
        BASE_URL,
        BASE_URL_UPLOAD,
        formatedDateNoHours,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
