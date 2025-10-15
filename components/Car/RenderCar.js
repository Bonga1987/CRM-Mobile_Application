import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import ReceiptModal from "../modal/ReceiptModal";
import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function RenderCar({ item, navigation, isBooking }) {
  const [visible, setVisible] = useState(false);
  const [receiptData, setReceiptdata] = useState(null);
  const { userData, formatedDateNoHours, BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/bookings`;

  const handleViewReceipt = async (invoiceid) => {
    try {
      const response = await axios.post(`${url}/ReceiptByInvoiceId`, {
        invoiceid,
      });
      if (response.status === 200) {
        if (response.data !== false) {
          setReceiptdata({
            receipt_number: response.data[0]?.receiptid,
            customer_name: userData.fullname,
            payment_date: formatedDateNoHours(response.data[0]?.paymentdate),
            payment_method: "Card",
            amount_paid: response.data[0]?.amountpaid,
          });
        } else {
          Alert.alert("No receipt");
        }
      }

      setVisible(true);
    } catch (error) {
      console.error("Error fetching vehicle:", error);
    }
  };

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
            {item.invoiceid === null ? (
              <></>
            ) : item.paymentstatus === "Unpaid" ? (
              <TouchableOpacity
                style={[styles.detailBtn, { backgroundColor: "#4CAF50" }]}
                onPress={() =>
                  navigation.navigate("Invoice", {
                    invoiceid: item.invoiceid,
                  })
                }
              >
                <Text style={{ color: "#fff" }}>Pay</Text>
              </TouchableOpacity>
            ) : item.paymentstatus === "Paid" ? (
              <>
                {/* <TouchableOpacity
                  style={[styles.detailBtn, { backgroundColor: "#8b8b8bff" }]}
                  onPress={() =>
                    navigation.navigate("Invoice", {
                      invoiceid: item.invoiceid,
                    })
                  }
                >
                  <Text style={{ color: "#fff" }}>View</Text>
                </TouchableOpacity> */}
                <TouchableOpacity
                  style={[styles.detailBtn, { backgroundColor: "#8b8b8bff" }]}
                  onPress={() => handleViewReceipt(item.invoiceid)}
                >
                  <Text style={{ color: "#fff" }}>View Receipt</Text>
                </TouchableOpacity>
                <ReceiptModal
                  visible={visible}
                  onClose={() => setVisible(false)}
                  receipt={receiptData}
                />
              </>
            ) : (
              <></>
            )}
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
  buttonRow: { flexDirection: "row", marginTop: 10, gap: 5 },
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
