import { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRoute } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";

export default function CarDetailScreen({ navigation }) {
  const route = useRoute();
  const { BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/vehicles`;
  const [selectedPlan, setSelectedPlan] = useState("daily");
  const [vehicle, setVehicle] = useState({});
  const { vehicleid } = route.params;

  const getVehicle = async () => {
    try {
      const response = await axios.get(`${url}/${vehicleid}`);
      if (response.status === 200) {
        if (response.data !== false) {
          setVehicle(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    }
  };

  useEffect(() => {
    getVehicle();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View> */}

        {/* Car Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: vehicle.vehicleimagemobile }}
            style={styles.carImage}
            resizeMode="contain"
          />
        </View>

        {/* Car Info */}
        <Text style={styles.carName}>
          {vehicle.make} {vehicle.model}
        </Text>
        {/* <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color="gold" />
          <Text style={styles.rating}>4.9</Text>
          <Text style={styles.reviews}>(230 Reviews)</Text>
        </View> */}

        {/* Specs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specs</Text>
          <View style={styles.specRow}>
            <View style={styles.specBox}>
              <Text style={styles.specTitle}>Seats</Text>
              <Text style={styles.specValue}>{vehicle.seats}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specTitle}>Mileage</Text>
              <Text style={styles.specValue}>{vehicle.mileage + " km"}</Text>
            </View>
            <View style={styles.specBox}>
              <Text style={styles.specTitle}>Features</Text>
              <Text style={styles.specValue}>{vehicle.features}</Text>
            </View>
          </View>
        </View>

        {/* Plan */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Plan</Text>
          <View style={styles.planRow}>
            {/* <TouchableOpacity
              style={[
                styles.planBox,
                selectedPlan === "hourly" && styles.planSelected,
              ]}
              onPress={() => setSelectedPlan("hourly")}
            >
              <Text style={styles.planPrice}>R1 400</Text>
              <Text style={styles.planTitle}>Hourly Rent</Text>
              <Text style={styles.planDesc}>
                Best for business appointments
              </Text>
            </TouchableOpacity> */}

            <TouchableOpacity
              style={[
                styles.planBox,
                selectedPlan === "daily" && styles.planSelected,
              ]}
              onPress={() => setSelectedPlan("daily")}
            >
              <Text style={styles.planPrice}>R{vehicle.priceperday}</Text>
              <Text style={styles.planTitle}>Daily Rent</Text>
              <Text style={styles.planDesc}>Best for travel</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Location */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.locationRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate("LocationSelection")}
            >
              <Text style={styles.planDesc}>Go to select location</Text>
            </TouchableOpacity>
          </View>
        </View> */}
      </ScrollView>

      {/* Bottom Booking Bar */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>R{vehicle.priceperday} / day</Text>
        <TouchableOpacity
          style={styles.bookBtn}
          onPress={() =>
            navigation.navigate("LocationSelection", {
              priceperday: vehicle.priceperday,
              vehicleid: vehicle.vehicleid,
              isReschedule: false,
            })
          }
        >
          <Text style={styles.bookText}>Book</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingBottom: 40 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  imageContainer: {
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  carImage: { width: "100%", height: 277 },

  carName: { fontSize: 22, fontWeight: "bold", marginTop: 16, marginLeft: 16 },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
    marginTop: 4,
  },
  rating: { marginLeft: 4, fontSize: 16, fontWeight: "bold" },
  reviews: { marginLeft: 6, color: "gray" },

  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 12 },

  specRow: { flexDirection: "row", justifyContent: "space-between" },
  specBox: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
  },
  specTitle: { fontWeight: "bold", fontSize: 14, marginBottom: 4 },
  specValue: { color: "gray", fontSize: 13 },

  planRow: { flexDirection: "row", justifyContent: "space-between" },
  planBox: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 10,
    alignItems: "center",
  },
  planSelected: {
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "#e8ffe8",
  },
  planPrice: { fontSize: 16, fontWeight: "bold", color: "green" },
  planTitle: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
  planDesc: { fontSize: 12, textAlign: "center", color: "gray", marginTop: 4 },

  locationRow: { flexDirection: "row", alignItems: "center" },
  locationText: { marginLeft: 6, flex: 1, color: "gray" },

  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  price: { fontSize: 18, fontWeight: "bold" },
  bookBtn: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  bookText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
