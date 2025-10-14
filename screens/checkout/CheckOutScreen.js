import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";

export default function CheckoutScreen() {
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");

  return (
    <View style={styles.container}>
    <ScrollView  contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <Text style={styles.header}>Secure Payment</Text>

      {/* Payment Section */}
      <Text style={styles.sectionTitle}>Payment</Text>

      <TextInput
        style={styles.input}
        placeholder="Card Holder's Name"
        value={cardName}
        onChangeText={setCardName}
      />
      <TextInput
        style={styles.input}
        placeholder="Card Number"
        keyboardType="numeric"
        value={cardNumber}
        onChangeText={setCardNumber}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Month"
          keyboardType="numeric"
          value={expiryMonth}
          onChangeText={setExpiryMonth}
        />
        <TextInput
          style={[styles.input, styles.smallInput]}
          placeholder="Year"
          keyboardType="numeric"
          value={expiryYear}
          onChangeText={setExpiryYear}
        />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Security Code"
        keyboardType="numeric"
        secureTextEntry
        value={cvv}
        onChangeText={setCvv}
      />

      {/* Divider */}
      <View style={styles.divider} />

      {/* Summary */}
      <Text style={styles.sectionTitle}>Summary</Text>
      <View style={styles.summaryCard}>
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/743/743131.png" }} // Replace with car image
          style={styles.carImage}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.carTitle}>S 500 Sedan</Text>
          <Text style={styles.carDetail}>7 seats • Automatic • Diesel</Text>
          <Text style={styles.price}>R7 200 /day</Text>
        </View>
      </View>


    </ScrollView>


    {/* Total + Pay Now */}
    <View style={styles.footer}>
        <View style={styles.payNow}>
        <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>R28 200</Text>
        </View>
        <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payText}>Pay now</Text>
        </TouchableOpacity>
        </View>

        <Text style={styles.note}>
        This is the final step, after you touch the Pay Now button, the payment will be transacted.
        </Text>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20,paddingHorizontal:15,paddingTop:80 },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center" },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  smallInput: { flex: 1, marginRight: 8 },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  carImage: { width: 70, height: 50, resizeMode: "contain", marginRight: 12 },
  carTitle: { fontSize: 16, fontWeight: "bold" },
  carDetail: { fontSize: 12, color: "#666", marginVertical: 3 },
  price: { fontSize: 14, fontWeight: "600", color: "#333" },
  payNow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center"},
  footer: {padding: 16, borderTopWidth: 1,borderColor: "#eee",},
  totalLabel: { fontSize: 14, color: "#666" },
  totalPrice: { fontSize: 18, fontWeight: "bold", marginTop: 2 },
  payButton: {
    backgroundColor: "green",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  payText: { color: "#fff", fontWeight: "bold" },
  note: { fontSize: 12, color: "#777", marginTop: 15, textAlign: "center" },
});
