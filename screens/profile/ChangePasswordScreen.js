import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import styles from "../../style/styles.";

export default function ChangePasswordScreen() {
  const { userData, BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/users`;
  const [customerid] = useState(userData.customerid);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword; //return true if password match

  const handleButtonPress = async () => {
    try {
      if (!newPassword || !currentPassword || !confirmPassword) {
        Alert.alert("Validation", `All fields are required`);
        return;
      }

      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(newPassword)) {
        Alert.alert(
          "Weak password",
          "Password must be at least 8 characters, include a number and a symbol"
        );
        return;
      }

      // Passwords match check
      if (newPassword !== confirmPassword) {
        Alert.alert(
          "Password mismatch",
          "Passwords do not match, please make sure the passwords match"
        );
        return;
      }

      const customer = {
        customerid,
        currentPassword,
        newPassword,
      };

      //api call to update profile
      const response = await axios.post(`${url}/updatePassword`, customer);

      if (response.status === 200) {
        if (response.data.message === "Success") {
          Alert.alert("Success", "Password changed successfully!");
        } else if (response.data.message === "Incorrect") {
          Alert.alert("Incorrect", "Incorrect current password");
        } else {
          Alert.alert("Error, User not found");
        }
      }
    } catch (error) {
      Alert.alert("Error", error);
      console.error("Error changing password: ", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.Signupcontainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>Change Password</Text>
          </View>

          {/* Profile Picture and Name */}
          <View style={styles.profileContainer}>
            <Image
              source={require("../../assets/profile.jpg")}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{userData.fullname}</Text>
          </View>

          <View style={styles.Formcontainer}>
            {/* Details */}

            <View style={{ width: "100%" }}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showPassword}
                maxLength={60}
              />
              <Text style={styles.hint}>
                Password must be at least 8 characters, and include numbers, and
                special characters.
              </Text>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showPassword}
                maxLength={60}
              />
              <TouchableOpacity
                style={styles.icon}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={22}
                  color="#666"
                />
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              maxLength={60}
            />

            {confirmPassword.length > 0 && (
              <Text
                style={[
                  styles.hint,
                  { color: passwordsMatch ? "green" : "red" },
                ]}
              >
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </Text>
            )}

            {/* Edit/Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
              <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
