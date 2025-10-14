import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

export default function RenderCar({ item, navigation, isBooking }) {
  return (
    <View key={item.vehicleid} style={styles.carCard}>
      <Image
        source={{ uri: item.vehicleimagemobile }}
        style={styles.carImage}
        resizeMode="contain"
      />
      <View style={{ flex: 1 }}>
        <Text style={styles.carTitle}>
          {item.make} {item.model}
        </Text>
        <Text>
          {item.category} · {item.seats} seats · {item.year}
        </Text>
        {isBooking ? (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate("BookingDetails", {
                  bookingid: item.bookingid,
                })
              }
            >
              <Text>Detail</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            {/* <TouchableOpacity style={styles.rentBtn}>
              <Text style={{ color: "white" }}>Rent Now</Text>
            </TouchableOpacity> */}
            <TouchableOpacity
              style={styles.detailBtn}
              onPress={() =>
                navigation.navigate("CarDetail", { vehicleid: item.vehicleid })
              }
            >
              <Text>Detail</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
