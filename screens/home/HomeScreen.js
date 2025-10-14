import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const { BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/vehicles`;
  const [popularVehicles, setPopularVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const getPopularVehicles = async () => {
    try {
      const response = await axios.get(`${url}/popularVehicles`);

      if (response.status === 200) {
        if (response.data !== false) {
          setPopularVehicles(response.data); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching popular vehicles:", error);
    }
  };

  const getAllCategories = async () => {
    try {
      const response = await axios.get(`${url}/countTotalVehicleByCategory`);

      if (response.status === 200) {
        if (response.data !== false) {
          setBrands(response.data); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getPopularVehicles();
    getAllCategories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getAllCategories();
      getPopularVehicles();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Search */}
      {/* <TextInput style={styles.search} placeholder="Search" /> */}

      {/* Brands */}
      <Text style={styles.sectionTitle}>Categories</Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={brands || []}
        keyExtractor={(item) => item.categoryid}
        renderItem={({ item }) => (
          <View style={styles.brandItem}>
            {/* <Image
              source={{ uri: "https://img.icons8.com/ios/100/renault.png" }}
              style={styles.brandLogo}
            /> */}
            <Ionicons
              name={"car-outline"}
              size={50}
              color="#666"
              style={styles.brandLogo}
            />
            <Text>{item.category}</Text>
            <Text style={{ color: "gray" }}>{`+${item.cat_total}`}</Text>
          </View>
        )}
      />

      {/* Popular Cars */}
      <Text style={styles.sectionTitle}>Popular Cars</Text>
      <View style={styles.footer}>
        {popularVehicles.slice(0, 5).map((car) => (
          <View key={car.vehicleid} style={styles.carCard}>
            <Image
              source={{ uri: car.vehicleimagemobile }}
              style={styles.carImage}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.carTitle}>
                {car.make} {car.model}
              </Text>
              <Text>
                {car.category} · {car.seats} seats · {car.year}
              </Text>
              <View style={styles.buttonRow}>
                {/* <TouchableOpacity
                style={styles.rentBtn}
                onPress={() => navigation.navigate("Checkout")}
              >
                <Text style={{ color: "white" }}>Rent Now</Text>
              </TouchableOpacity> */}
                <TouchableOpacity
                  style={styles.detailBtn}
                  onPress={() =>
                    navigation.navigate("CarDetail", {
                      vehicleid: car.vehicleid,
                    })
                  }
                >
                  <Text>Detail</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingBottom: 15,
    paddingRight: 15,
    paddingLeft: 15,
  },
  footer: {
    paddingBottom: 40,
  },
  search: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 24, fontWeight: "bold", marginVertical: 30 },
  brandItem: { alignItems: "center", marginRight: 20 },
  brandLogo: { width: 50, height: 50, marginBottom: 5 },
  carCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
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
