import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { useContext, useEffect, useState, useCallback } from "react";
import RenderCar from "../../components/Car/RenderCar";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

// const RentalHistory = [
//   {
//     bookingid: "1",
//     name: "S 500 Sedan",
//     image:
//       "https://www.mercedes-benz.com/etc.clientlibs/mbcom/clientlibs/clientlib-site/resources/images/og-image-default.jpg",
//     seats: 5,
//     fuel: "Diesel",
//     transmission: "Automatic",
//   },
// ];

// const currentBookings = [
//   {
//     id: "2",
//     name: "GLA 250 SUV",
//     image:
//       "https://www.mercedes-benz.com/etc.clientlibs/mbcom/clientlibs/clientlib-site/resources/images/og-image-default.jpg",
//     seats: 7,
//     fuel: "Diesel",
//     transmission: "Automatic",
//   },
// ];

export default function MyBookingScreen({ navigation }) {
  const [bookingOption, setBookingOption] = useState(null);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [bookings, setBookings] = useState(null);
  const { userData, BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/bookings`;
  const [refreshing, setRefreshing] = useState(false);

  //retrieved all bookings and divide them by pending,overdue,actuve(current bookings) and rental history(completed,overdue,cancel)

  const getCurrentBookings = async () => {
    try {
      const response = await axios.get(
        `${url}/currentBookings/${userData.customerid}`
      );

      if (response.status === 200) {
        if (response.data !== false) {
          setCurrentBookings(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching current bookings:", error);
    }
  };

  const getRentalHistory = async () => {
    try {
      const response = await axios.get(
        `${url}/rentalHistory/${userData.customerid}`
      );

      if (response.status === 200) {
        if (response.data !== false) {
          setRentalHistory(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching rental history:", error);
    }
  };

  useEffect(() => {
    getCurrentBookings();
    getRentalHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //setBookings(null);
    setTimeout(() => {
      getCurrentBookings();
      getRentalHistory();
      setBookings(null);
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Bookings</Text>
      </View>

      {/* tab options */}
      <Text style={styles.sectionTitle}>My bookings</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            bookingOption === "Rental history" && styles.activeButton,
          ]}
          onPress={() => {
            setBookingOption("Rental history");
            setBookings(rentalHistory);
          }}
        >
          <Text style={styles.toggleText}>Rental history</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            bookingOption === "Current bookings" && styles.activeButton,
          ]}
          onPress={() => {
            setBookingOption("Current bookings");
            setBookings(currentBookings);
          }}
        >
          <Text style={styles.toggleText}>Current bookings</Text>
        </TouchableOpacity>
      </View>

      {/*  bookings */}
      <Text style={styles.sectionTitle}>{bookingOption}</Text>
      {bookings ? (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.bookingid}
          renderItem={({ item }) => (
            <RenderCar item={item} navigation={navigation} isBooking={true} />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        <Text>Select category</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  search: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  row: { flexDirection: "row", flexWrap: "wrap", marginTop: 10 },
  activeButton: { backgroundColor: "#e0f2f1", borderColor: "#4CAF50" },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  toggleText: { fontSize: 14 },
  toggleButton: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  sectionTitle: { fontSize: 24, fontWeight: "bold", marginVertical: 15 },
  brandItem: { alignItems: "center", marginRight: 20 },
  brandLogo: { width: 50, height: 50, marginBottom: 5 },
  carCard: {
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  carImage: { width: 100, height: 60, marginRight: 10, borderRadius: 8 },
  carTitle: { fontSize: 16, fontWeight: "bold" },
  buttonRow: { flexDirection: "row", marginTop: 10 },
  rentBtn: {
    backgroundColor: "green",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  detailBtn: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
});
