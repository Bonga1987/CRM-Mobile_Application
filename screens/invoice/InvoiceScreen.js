import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import { useStripe } from "@stripe/stripe-react-native";
import { AuthContext } from "../../context/AuthContext";

export default function InvoiceScreen() {
  const route = useRoute();
  const { BASE_URL, formatedDate } = useContext(AuthContext);
  const url = `${BASE_URL}/bookings`;
  const [invoice, setInvoice] = useState({});
  const { invoiceid } = route.params;
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [clientSecret, setClientSecret] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [VAT, setVAT] = useState(0);

  const getPaymentIntent = async () => {
    try {
      const amount =
        parseInt(invoice.amount) +
        parseInt(invoice.latefees) +
        parseInt(invoice.damages) +
        Number(parseFloat(VAT).toFixed(2));

      const response = await axios.post(`${url}/invoices/pay`, { amount });

      const { clientSecret } = response.data;

      setClientSecret(clientSecret);
      return clientSecret;
    } catch (error) {
      console.error("Error retrieving clint secret ", error);
    }
  };

  const openPaymentSheet = async () => {
    const secret = await getPaymentIntent();

    const { error } = await initPaymentSheet({
      paymentIntentClientSecret: secret,
      merchantDisplayName: "Car Rental Management system",
    });

    if (!error) {
      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        Alert.alert(`Error: ${presentError.message}`);
      } else {
        Alert.alert("Success", "Your payment is confirmed!");
        //update the invoice status
        try {
          const amount =
            parseInt(invoice.amount) +
            parseInt(invoice.latefees) +
            parseInt(invoice.damages) +
            Number(parseFloat(VAT).toFixed(2));

          const response = await axios.post(`${url}/invoices/updateStatus`, {
            invoiceid: invoice.invoiceid,
            amount,
          });

          if (response.status === 200) {
            if (response.data !== false) {
              console.log("Invoice status updated successfully");
            }
          }
        } catch (error) {
          console.error("Error updating invoice status:", error);
        }
      }
    }
  };

  const getInvoiceById = async () => {
    try {
      const response = await axios.get(`${url}/invoices/${invoiceid}`);
      if (response.status === 200) {
        if (response.data !== false) {
          setInvoice(response.data[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    }
  };

  useEffect(() => {
    getInvoiceById();
  }, []);

  useEffect(() => {
    const rentalVAT = invoice.amount * 0.15;
    const damageVAT = invoice.damages * 0.15;
    const latefeesVAT = invoice.latefees * 0.15;

    setVAT(rentalVAT + damageVAT + latefeesVAT);
  }, [invoice]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getInvoiceById();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Invoice</Text>
        <Ionicons name="shield-checkmark-outline" size={22} color="green" />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Invoice Card */}
        <View style={styles.invoiceCard}>
          <View>
            <Text style={styles.invoiceLabel}>INVOICE FOR</Text>
            <Text style={styles.invoiceName}>{invoice.fullname}</Text>
            <Text style={styles.invoiceAddress}>{invoice.address}</Text>
          </View>
          <View style={styles.amountBox}>
            <Text style={styles.amountLabel}>AMOUNT DUE</Text>
            <Text style={styles.amount}>
              R
              {parseInt(invoice.amount) +
                parseInt(invoice.latefees) +
                parseInt(invoice.damages) +
                Number(parseFloat(VAT).toFixed(2))}
            </Text>
            <Text style={styles.date}>
              ● {formatedDate(invoice.generateddate)}
            </Text>
          </View>
        </View>

        {/* Task */}

        <View style={styles.taskContainer}>
          <Text style={styles.headerTitle}>Task</Text>

          <View style={styles.taskRow}>
            <Text style={styles.taskText}>
              {invoice.make} {invoice.model} (R{invoice.priceperday} x
              {invoice.amount / invoice.priceperday} days)
            </Text>
            <Text style={styles.taskTotal}>R{invoice.amount}</Text>
          </View>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>Damages</Text>
            <Text style={styles.taskTotal}>R{invoice.damages}</Text>
          </View>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>Late fees</Text>
            <Text style={styles.taskTotal}>R{invoice.latefees}</Text>
          </View>
          <View style={styles.taskRow}>
            <Text style={styles.taskText}>VAT(15%)</Text>
            <Text style={styles.taskTotal}>
              R{Number(parseFloat(VAT).toFixed(2))}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />
      </ScrollView>

      {/* Notes + Total */}
      <View style={styles.notesRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.notesLabel}>NOTES</Text>
          <Text style={styles.notesText}>
            Hi {invoice.fullname}, have a look at the invoice
          </Text>
        </View>
        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
          <Text style={styles.total}>
            R
            {parseInt(invoice.amount) +
              parseInt(invoice.latefees) +
              parseInt(invoice.damages) +
              Number(parseFloat(VAT).toFixed(2))}
          </Text>
        </View>
      </View>
      {/* Footer Button */}
      <View style={styles.footer}>
        {invoice.paymentstatus === "Unpaid" ? (
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payText} onPress={openPaymentSheet}>
              Pay now
            </Text>
          </TouchableOpacity>
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
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingTop: 80,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
  taskContainer: {},
  headerTitle: { fontSize: 18, fontWeight: "600" },

  scrollContent: { paddingVertical: 30 },

  invoiceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 80,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  invoiceLabel: { fontSize: 12, color: "#494949ff" },
  invoiceName: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  invoiceAddress: { fontSize: 12, color: "#494949ff", marginTop: 3 },
  amountBox: { alignItems: "flex-end" },
  amountLabel: { fontSize: 12, color: "#494949ff" },
  amount: { fontSize: 22, fontWeight: "bold", marginVertical: 5 },
  date: { fontSize: 12, color: "#494949ff" },

  taskRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  taskText: { fontSize: 15, fontWeight: "500" },
  taskTotal: { fontSize: 15, fontWeight: "500" },
  divider: { height: 1, backgroundColor: "#ddd", marginVertical: 15 },

  notesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  notesLabel: { fontSize: 12, color: "#494949ff", marginBottom: 5 },
  notesText: { fontSize: 13, color: "#494949ff" },
  totalBox: { alignItems: "flex-end" },
  totalLabel: { fontSize: 12, color: "#494949ff", marginBottom: 5 },
  total: { fontSize: 20, fontWeight: "bold", color: "#000" },

  footer: { paddingVertical: 20, alignItems: "flex-end" },
  payButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
