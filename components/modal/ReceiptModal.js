import { useState, useEffect, useContext } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const ReceiptModal = ({ visible, onClose, receipt }) => {
  if (!receipt) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Payement Receipt</Text>

          {/* Header: Receipt Number + Customer Name */}
          <View style={styles.headerRow}>
            <Text style={styles.receiptNo}>
              Receipt No: #{receipt?.receipt_number}
            </Text>
            <Text style={styles.customerName}>{receipt?.customer_name}</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Grid of details */}
          <View style={styles.grid}>
            <View style={styles.gridRow}>
              <Text style={styles.label}>Payment Date:</Text>
              <Text style={styles.value}>{receipt?.payment_date}</Text>
            </View>

            <View style={styles.gridRow}>
              <Text style={styles.label}>Payment Method:</Text>
              <Text style={styles.value}>{receipt?.payment_method}</Text>
            </View>

            <View style={styles.gridRow}>
              <Text style={styles.label}>Amount Paid:</Text>
              <Text
                style={[styles.value, { color: "#4CAF50", fontWeight: "600" }]}
              >
                R{receipt?.amount_paid}
              </Text>
            </View>
          </View>

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReceiptModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  receiptNo: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
  },
  customerName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 10,
  },
  grid: {
    marginBottom: 20,
  },
  gridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  label: {
    fontSize: 15,
    color: "#555",
  },
  value: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
  },
  closeButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
