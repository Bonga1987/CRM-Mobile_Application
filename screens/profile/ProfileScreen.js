import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileScreen({ navigation }) {
  const { setIsLoggedIn, userData, setProfileImage } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@isLoggedIn");
      await AsyncStorage.removeItem("@key");
      await AsyncStorage.removeItem("@customer");
      await AsyncStorage.removeItem("@profileImage");

      setIsLoggedIn(false);
      // Reset navigation to Login screen
      // navigation.dispatch(
      //   CommonActions.reset({
      //     index: 0,
      //     routes: [{ name: "Welcome" }],
      //   })
      //);
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* Profile Picture and Name */}
      <View style={styles.profileContainer}>
        <Image
          source={require("../../assets/profile.jpg")}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{userData.fullname}</Text>
      </View>

      <View style={styles.options}>
        {/* Options */}
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("MyProfile")}
          >
            <View style={styles.optionLeft}>
              <Icon name="person-outline" size={24} color="#555" />
              <Text style={styles.optionText}>My Profile</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("MyBooking")}
          >
            <View style={styles.optionLeft}>
              <Icon name="calendar-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Bookings</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("MyInvoice")}
          >
            <View style={styles.optionLeft}>
              <Icon name="receipt-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Invoices</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            onPress={() => navigation.navigate("ChangePassword")}
          >
            <View style={styles.optionLeft}>
              <Icon name="key-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Change Password</Text>
            </View>
            <Icon name="chevron-forward" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout}>
            <View style={styles.optionLeft}>
              <Icon name="log-out-outline" size={24} color="#555" />
              <Text style={styles.optionText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingTop: 60,
  },
  options: {
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 10,
  },
  optionsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  logoutContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
});
