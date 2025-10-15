import { useEffect, useState, useContext, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function BookingDetailsScreen({ navigation }) {
  // get booking data
  const route = useRoute();
  const [booking, setBooking] = useState({});
  const { bookingid } = route.params;
  const { formatedDateNoHours, BASE_URL } = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(false);
  const url = `${BASE_URL}/bookings`;

  const getBookingDetails = async () => {
    try {
      const response = await axios.get(`${url}/booking/${bookingid}`);

      if (response.status === 200) {
        if (response.data !== false) {
          setBooking(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  const handleCancelClick = async (bookingid) => {
    try {
      const response = await axios.post(`${url}/cancel`, { bookingid });

      if (response.status === 200) {
        if (response.data !== false) {
          Alert.alert("Success", "Booking cancelled");
        }
      } else {
        Alert.alert("Error", "Cancelling booking failed, please try again");
      }
    } catch (error) {
      console.error("Error fetching cancelling booking:", error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getBookingDetails();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Booking Details */}
        <View style={styles.header}>
          <Text style={styles.headerText}>Booking</Text>
        </View>
        <Text style={styles.sectionTitle}>Booking Details</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Booking ID:</Text>
            <Text style={styles.value}>{booking.bookingid}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pickup date:</Text>
            <Text style={styles.value}>
              {formatedDateNoHours(booking.pickupdate)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dropoff Date:</Text>
            <Text style={styles.value}>
              {formatedDateNoHours(booking.dropoffdate)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Pickup location:</Text>
            <Text style={styles.value}>{booking.pickuplocation}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Dropoff location:</Text>
            <Text style={styles.value}>{booking.dropofflocation}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, styles.status]}>{booking.status}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Actual return Date:</Text>
            <Text style={styles.value}>
              {formatedDateNoHours(booking.actualreturndate)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price:</Text>
            <Text style={styles.value}>
              R
              {booking.priceperday *
                Math.max(
                  1,
                  Math.ceil(
                    (new Date(booking.dropoffdate) -
                      new Date(booking.pickupdate)) /
                      (1000 * 60 * 60 * 24)
                  ) + 1
                )}{" "}
              (x
              {Math.max(
                1,
                Math.ceil(
                  (new Date(booking.dropoffdate) -
                    new Date(booking.pickupdate)) /
                    (1000 * 60 * 60 * 24)
                ) + 1
              )}
              days )
            </Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Make:</Text>
            <Text style={styles.value}>{booking.make}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>{booking.model}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Year:</Text>
            <Text style={styles.value}>{booking.year}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Plate Number:</Text>
            <Text style={styles.value}>{booking.platenumber}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Color:</Text>
            <Text style={styles.value}>{booking.color}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price/Day:</Text>
            <Text style={styles.value}>R{booking.priceperday}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Mileage:</Text>
            <Text style={styles.value}>{booking.mileage} km</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Features:</Text>
            <Text style={styles.value}>{booking.features}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Available:</Text>
            <Text style={styles.value}>
              {booking.availability ? "True" : "False"}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Maintenance:</Text>
            <Text style={styles.value}>
              {booking.isinmaintenance ? "True" : "Flase"}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {booking.status === "Pending" ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton}>
              <Text
                style={styles.rescheduleText}
                onPress={() => handleCancelClick(booking.bookingid)}
              >
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rescheduleButton}
              onPress={() =>
                navigation.navigate("LocationSelection", {
                  priceperday: booking.priceperday,
                  vehicleid: booking.vehicleid,
                  isReschedule: true,
                  bookingid: booking.bookingid,
                  pickup: booking.pickuplocation,
                  dropoff: booking.dropofflocation,
                  startDate: booking.pickupdate,
                  endDate: booking.dropoffdate,
                })
              }
            >
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#f8f9fa",
    paddingTop: 60,
    paddingBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    marginTop: 16,
    color: "#333",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginBottom: 30,
    elevation: 3, // shadow for Android
    shadowColor: "#000", // shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 5,
  },
  buttonRow: {
    flexDirection: "row",
    marginBottom: 8,
    gap: 5,
  },
  value: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
  },
  status: {
    textTransform: "capitalize",
    color: "#007bff",
  },

  footer: { paddingVertical: 20, alignItems: "flex-end" },
  rescheduleButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "grey",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  rescheduleText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
