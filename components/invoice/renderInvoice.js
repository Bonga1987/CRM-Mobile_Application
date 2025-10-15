import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../../context/AuthContext";
import { useContext, useState, useEffect } from "react";

export default function RenderInvoice({ item, navigation }) {
  const { formatedDate } = useContext(AuthContext);
  const [VAT, setVAT] = useState(0);

  useEffect(() => {
    const rentalVAT = item.amount * 0.15;
    const damageVAT = item.damages * 0.15;
    const latefeesVAT = item.latefees * 0.15;

    setVAT(rentalVAT + damageVAT + latefeesVAT);
  }, []);

  return (
    <View style={styles.invoiceContainer}>
      <View style={styles.invoiceCard}>
        <View>
          <Text style={styles.invoiceLabel}>INVOICE FOR</Text>
          <Text style={styles.invoiceName}>{item.fullname}</Text>
          <Text style={styles.invoiceAddress}>{item.address}</Text>
        </View>
        <View style={styles.amountBox}>
          <Text style={styles.amountLabel}>AMOUNT DUE</Text>
          <Text style={styles.amount}>
            R
            {parseInt(item.amount) +
              parseInt(item.latefees) +
              parseInt(item.damages) +
              Number(parseFloat(VAT).toFixed(2))}
          </Text>
          <Text style={styles.date}>● {formatedDate(item.generateddate)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() =>
            navigation.navigate("Invoice", { invoiceid: item.invoiceid })
          }
        >
          <Text style={styles.payText}>Detail</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { paddingVertical: 20, alignItems: "flex-end" },
  invoiceContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  detailBtn: {
    borderWidth: 1,
    borderColor: "black",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  invoiceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  invoiceLabel: { fontSize: 12, color: "#494949ff" },
  invoiceName: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  invoiceAddress: { fontSize: 12, color: "#494949ff", marginTop: 3 },
  amountBox: { alignItems: "flex-end" },
  amountLabel: { fontSize: 12, color: "#494949ff" },
  amount: { fontSize: 22, fontWeight: "bold", marginVertical: 5 },
  date: { fontSize: 12, color: "#494949ff" },
});
