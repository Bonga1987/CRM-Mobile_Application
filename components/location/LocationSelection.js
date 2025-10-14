import { useState } from "react";
import { View, Text, Alert, TouchableOpacity, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRoute } from "@react-navigation/native";

export default function LocationSelection({ onConfirm, navigation }) {
  const route = useRoute();
  const [pickuplocation, setPickup] = useState(route.params?.pickup || "");
  const [dropofflocation, setDropoff] = useState(route.params?.dropoff || "");
  const {
    priceperday,
    vehicleid,
    isReschedule,
    bookingid,
    startDate,
    endDate,
  } = route.params;

  const locations = [
    { label: "Select Location", value: "" },
    {
      label: "O.R. Tambo International Airport",
      value: "Airport Rd, Kempton Park",
    },
    { label: "Sandton", value: "123 Rivonia Rd, Sandton" },
    { label: "Johannesburg CBD", value: "45 Main St, CBD" },
    { label: "Soweto", value: "Maponya Mall, Chris Hani Rd, Soweto" },
    { label: "Lanseria Airport", value: "Airport Rd, Lanseria" },
    { label: "Rosebank", value: "Oxford Rd, Rosebank" },
  ];

  const handleConfirm = () => {
    if (!pickuplocation || !dropofflocation) {
      Alert.alert("Please select both pickup and dropoff locations");
      return;
    }
    //onConfirm?.({ pickup, dropoff }); // send to parent
    Alert.alert(
      `Pickup location: ${pickuplocation}, Dropoff location: ${dropofflocation}`
    );
    navigation.navigate("DateSelection", {
      priceperday: priceperday,
      vehicleid: vehicleid,
      pickuplocation: pickuplocation,
      dropofflocation: dropofflocation,
      isReschedule: isReschedule,
      bookingid: bookingid,
      startDate: startDate,
      endDate: endDate,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select location</Text>

      <Text style={styles.label}>Pickup Location:</Text>
      <Picker selectedValue={pickuplocation} onValueChange={setPickup}>
        {locations.map((loc, idx) => (
          <Picker.Item key={idx} label={loc.label} value={loc.value} />
        ))}
      </Picker>

      <Text style={styles.label}>Dropoff Location:</Text>
      <Picker selectedValue={dropofflocation} onValueChange={setDropoff}>
        {locations.map((loc, idx) => (
          <Picker.Item key={idx} label={loc.label} value={loc.value} />
        ))}
      </Picker>

      {/* Footer */}
      <View style={styles.bottomBar}>
        <Text style={styles.price}>R{priceperday} / day</Text>
        <TouchableOpacity style={styles.continueButton} onPress={handleConfirm}>
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
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
  label: { marginVertical: 10, fontWeight: "bold" },
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
