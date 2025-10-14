import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { useContext, useState } from "react";
import styles from "../../style/styles.";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen({ navigation }) {
  const [fullname, setFullname] = useState("");
  const [address, setAddress] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [driverslicense, setDriverslicense] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/users`;

  const passwordsMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  const validateForm = (
    password,
    fullname,
    driverslicense,
    phoneNumber,
    email
  ) => {
    // --- Password check (min 8 chars, 1 number, 1 symbol) ---
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(password)) {
      Alert.alert(
        "Weak password",
        "Password must be at least 8 characters, include a number and a symbol"
      );
      return false;
    }

    // --- Fullname length check (2-100 chars) ---
    if (fullname.length < 2 || fullname.length > 100) {
      Alert.alert(
        "Name too long",
        "Fullname must be between 2 and 100 characters"
      );
      return false;
    }

    //---email check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email Invalid", "Email is not valid");
      return false;
    }

    // --- Driver's license check (alphanumeric only) ---
    const alphanumericRegex = /^[a-zA-Z0-9]{12}$/;
    if (!alphanumericRegex.test(driverslicense)) {
      Alert.alert(
        "Invalid license",
        "License number must be alphanumeric and 12 characters"
      );
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert(
        "Invalid phone number",
        "Phone number must be exactly 10 digits and contain only numbers"
      );
      return false;
    }

    return true;
  };

  const handleSignUp = async () => {
    try {
      if (
        !fullname ||
        !address ||
        !phonenumber ||
        !email ||
        !driverslicense ||
        !password ||
        !confirmPassword
      ) {
        Alert.alert("Validation", `All fields are required`);
        return;
      }

      if (
        validateForm(password, fullname, driverslicense, phonenumber, email) ===
        false
      ) {
        return;
      }

      // Passwords match check
      if (password !== confirmPassword) {
        Alert.alert(
          "Password mismatch",
          "Passwords do not match, please make sure the passwords match"
        );
        return;
      }

      const response = await axios.post(`${url}/signup`, {
        fullname,
        address,
        phonenumber,
        email,
        driverslicense,
        password,
        confirmPassword,
      });

      if (response.status === 200) {
        if (response.data.length !== 0) {
          setPassword("");
          setAddress("");
          setEmail("");
          setConfirmPassword("");
          setDriverslicense("");
          setFullname("");
          setPhonenumber("");
          Alert.alert("Register Success", "Proceed to login");
          navigation.navigate("Login");
        } else {
          Alert.alert("Signup Failed");
        }
      }
    } catch (error) {
      console.error("Signup error:", error.message);
      Alert.alert(
        "Error",
        "Something went wrong while creating an account:",
        error.message
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.Signupcontainer}>
          {/* Image Section */}

          {/* Form Section */}
          <View style={styles.Formcontainer}>
            <Text style={styles.title}>SignUp</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullname}
              onChangeText={setFullname}
              maxLength={100}
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              onChangeText={setAddress}
              maxLength={64}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phonenumber}
              onChangeText={setPhonenumber}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={64}
            />

            <TextInput
              style={styles.input}
              placeholder="Driver’s License Number"
              value={driverslicense}
              onChangeText={setDriverslicense}
              maxLength={12}
            />

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
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
              placeholder="Confirm Password"
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

            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
              <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
