import React, { useState, useEffect, useContext } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Calendar } from "react-native-calendars";
import { useRoute } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import LegendItem from "../../components/legend/LegendItem";

export default function DateTimePickerScreen({ navigation }) {
  const route = useRoute();
  const { userData, BASE_URL, formatedDateNoHours } = useContext(AuthContext);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [range, setRange] = useState({
    start: formatedDateNoHours(route.params?.startDate) || null,
    end: formatedDateNoHours(route.params?.endDate) || null,
  });
  const {
    priceperday,
    vehicleid,
    pickuplocation,
    dropofflocation,
    isReschedule,
    bookingid,
  } = route.params;
  const url = `${BASE_URL}/bookings`;
  const [disabledDates, setDisabledDates] = useState([]);

  // Timeslot
  const morningSlots = ["7:00", "9:00", "11:00"];
  const eveningSlots = ["5:00", "7:00", "9:00"];

  // Handle date press
  const handleDayPress = (day) => {
    const { dateString } = day;

    if (!range.start || (range.start && range.end)) {
      // Start a new range
      setRange({ start: dateString, end: null });
    } else if (range.start && !range.end) {
      // Ensure end is after start
      if (new Date(dateString) >= new Date(range.start)) {
        setRange({ ...range, end: dateString });
      } else {
        // If picked before start, reset start
        setRange({ start: dateString, end: null });
      }
    }
  };

  const getMarkedDates = () => {
    let marked = {};

    if (range.start) {
      marked[range.start] = {
        startingDay: true,
        color: "#4CAF50",
        textColor: "white",
      };
    }

    if (range.start && range.end) {
      let startDate = new Date(range.start);
      let endDate = new Date(range.end);

      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        const dateStr = d.toISOString().split("T")[0];
        if (dateStr === range.start || dateStr === range.end) {
          marked[dateStr] = {
            startingDay: dateStr === range.start,
            endingDay: dateStr === range.end,
            color: "#4CAF50",
            textColor: "white",
          };
        } else {
          marked[dateStr] = {
            color: "#d3d3d3", // grey highlight
            textColor: "black",
          };
        }
      }
    }

    return marked;
  };

  function parseYMD(ymd) {
    const [year, month, day] = ymd.split("-").map(Number);
    return new Date(year, month - 1, day); // month is 0-based
  }

  const getNumberOfDays = (start, end) => {
    if (!start || !end) return 0;

    const startDate = parseYMD(start);
    const endDate = parseYMD(end);

    // difference in ms
    const diffMs = endDate - startDate;
    // convert ms → days and include the end day (+1)
    return Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleConfirmation = async () => {
    if (!range.start || !range.end) {
      Alert.alert("Please select both start and end date");
      return;
    }

    const booking = {
      customerid: userData.customerid,
      vehicleid: vehicleid,
      pickuplocation: pickuplocation,
      dropofflocation: dropofflocation,
      pickupdate: range.start,
      dropoffdate: range.end,
      time: selectedTime,
      bookingid: bookingid,
    };

    try {
      let response;
      if (isReschedule) {
        //update an existing booking
        response = await axios.post(`${url}/update`, booking);
        console.log(response.data);
      } else {
        //create a new booking
        response = await axios.post(`${url}/reserve`, booking);
      }

      if (response.status === 200) {
        if (response.data.message === "Unavailable") {
          Alert.alert(
            "Reserve error",
            "An overlap has been detected. Vehicle is not available at the choosen dates, please pick different dates"
          );
        } else if (response.data.message === "BookingError") {
          Alert.alert("Error reserving the vehicle");
        } else if (response.data.message === "UpdateError") {
          Alert.alert("Error updating the booking");
        } else {
          {
            isReschedule ? onSuccessReschedule() : onSuccessBooking();
          }
        }
      }
    } catch (error) {
      {
        isReschedule
          ? Alert.alert("Reschedule booking error", error)
          : Alert.alert("Reservation error", error);
      }
      console.error("Error: ", error);
    }
  };

  const onSuccessReschedule = () => {
    Alert.alert(
      "Success",
      "Booking rescheduled successfully, navigate to booking to confirm"
    );
    navigation.pop(4);
    navigation.navigate("MyBooking", { bookingid: bookingid });
  };

  const onSuccessBooking = () => {
    Alert.alert(
      "Success",
      "Vehicle reserved successfully, navigate to booking to confirm"
    );
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
  };

  const toMarkedDates = (dates) => {
    return dates.reduce((acc, date) => {
      acc[date] = {
        disabled: true,
        disableTouchEvent: true,
        selected: true,
        selectedColor: "red",
      };
      return acc;
    }, {});
  };

  useEffect(() => {
    const getDatesBookedByVehicle = async () => {
      try {
        const response = await axios.post(`${url}/bookedDatesByVehicle`, {
          vehicleid,
        });

        if (response.status === 200) {
          if (response.data !== false) {
            setDisabledDates((prev) => [
              ...new Set([...prev, ...response.data]),
            ]);
          }
        }
      } catch (error) {
        console.error(
          `Error fetching booked dates for vehicle: ${vehicleid}`,
          error
        );
      }
    };

    getDatesBookedByVehicle();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select date</Text>

      {/* Selected Day */}
      {/* <Text style={styles.dayText}>
        {selectedDate ? new Date(selectedDate).toDateString() : "Pick a date"}
      </Text> */}

      <View>
        {/* Calendar */}
        <Calendar
          minDate={new Date().toISOString().split("T")[0]}
          markingType="period"
          onDayPress={handleDayPress}
          // markedDates={getMarkedDates()}
          markedDates={toMarkedDates(disabledDates)}
          theme={{
            todayTextColor: "#4CAF50",
            arrowColor: "#4CAF50",
          }}
        />

        {/* Legend */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          <LegendItem color="red" label="Booked" />
          <LegendItem color="gray" label="Unavailable" />
          <LegendItem color="green" label="Available" />
        </View>
      </View>

      {range.start && !range.end && (
        <Text style={styles.info}>Selected start: {range.start}</Text>
      )}
      {range.start && range.end && (
        <>
          <Text style={styles.info}>
            Selected range: {range.start} --- {range.end}
          </Text>
          <Text style={styles.info}>
            Total Days: {getNumberOfDays(range.start, range.end)}
          </Text>
        </>
      )}

      {/* Pick Time Section */}
      {/* <Text style={styles.sectionTitle}>Pick time</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            timeOfDay === "Morning" && styles.activeButton,
          ]}
          onPress={() => {
            setTimeOfDay("Morning");
            setSelectedTime(null);
          }}
        >
          <Text style={styles.toggleText}>Morning</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            timeOfDay === "Evening" && styles.activeButton,
          ]}
          onPress={() => {
            setTimeOfDay("Evening");
            setSelectedTime(null);
          }}
        >
          <Text style={styles.toggleText}>Evening</Text>
        </TouchableOpacity>
      </View> */}

      {/* Timeslot Buttons */}
      {/* <View style={styles.row}>
        {(timeOfDay === "Morning"
          ? morningSlots
          : timeOfDay === "Evening"
          ? eveningSlots
          : []
        ).map((time) => (
          <TouchableOpacity
            key={time}
            style={[
              styles.timeButton,
              selectedTime === time && styles.activeTimeButton,
            ]}
            onPress={() => setSelectedTime(time)}
          >
            <Text
              style={[
                styles.timeText,
                selectedTime === time && styles.activeTimeText,
              ]}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </View> */}

      {/* Footer */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>
          R
          {range
            ? priceperday * getNumberOfDays(range.start, range.end)
            : priceperday}
          / day
        </Text>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleConfirmation}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>

      {/* Debug/Preview */}
      {/* {selectedDate && selectedTime && (
        <Text style={styles.preview}>
          Selected: {selectedDate} at {selectedTime}
        </Text>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  info: { marginTop: 20, fontSize: 16, color: "#333", textAlign: "center" },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginTop: 20 },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
  },
  activeButton: { backgroundColor: "#e0f2f1", borderColor: "#4CAF50" },
  toggleText: { fontSize: 14 },
  timeButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    margin: 5,
  },
  activeTimeButton: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  timeText: { fontSize: 14 },
  activeTimeText: { color: "white" },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 20,
  },
  price: { fontSize: 16, fontWeight: "bold" },
  continueButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  continueText: { color: "#fff", fontWeight: "bold" },
  preview: { marginTop: 20, fontSize: 14, color: "#666" },
});
