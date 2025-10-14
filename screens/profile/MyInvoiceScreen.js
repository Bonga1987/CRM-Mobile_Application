import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from "react-native";
import { useEffect, useState, useContext, useCallback } from "react";
import RenderInvoice from "../../components/invoice/renderInvoice";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function MyInvoiceScreen({ navigation }) {
  const [invoiceStatus, setInvoiceStatus] = useState(null);
  const [invoices, setInvoices] = useState(null);
  const [unpaidInvoices, setUnpaidInvoices] = useState(null);
  const [paidInvoices, setPaidInvoices] = useState(null);
  const { userData, BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/bookings`;
  const [refreshing, setRefreshing] = useState(false);

  const getInvoiveByCustomerId = async () => {
    try {
      const response = await axios.get(
        `${url}/invoices/customer/${userData.customerid}`
      );

      if (response.status === 200) {
        if (response.data !== false) {
          const paid = response.data.filter(
            (inv) => inv.paymentstatus === "Paid"
          );
          const unpaid = response.data.filter(
            (inv) => inv.paymentstatus === "Unpaid"
          );
          setPaidInvoices(paid);
          setUnpaidInvoices(unpaid);
        }
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };
  useEffect(() => {
    getInvoiveByCustomerId();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //setBookings(null);
    setTimeout(() => {
      getInvoiveByCustomerId();
      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Invoices</Text>
      </View>

      {/* tab options */}
      <Text style={styles.sectionTitle}>My Invoices</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            invoiceStatus === "Paid" && styles.activeButton,
          ]}
          onPress={() => {
            setInvoiceStatus("Paid");
            setInvoices(paidInvoices);
          }}
        >
          <Text style={styles.toggleText}>Paid</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            invoiceStatus === "Unpaid" && styles.activeButton,
          ]}
          onPress={() => {
            setInvoiceStatus("Unpaid");
            setInvoices(unpaidInvoices);
          }}
        >
          <Text style={styles.toggleText}>Unpaid</Text>
        </TouchableOpacity>
      </View>

      {/* Popular Cars */}
      <Text style={styles.sectionTitle}>{invoiceStatus}</Text>
      {/* Invoice Card */}

      <FlatList
        data={invoices}
        keyExtractor={(item) => item.invoiceid}
        renderItem={({ item }) => (
          <RenderInvoice item={item} navigation={navigation} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 80,
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
