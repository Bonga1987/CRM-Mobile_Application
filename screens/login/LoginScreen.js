import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { useState, useContext } from "react";
import styles from "../../style/styles.";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setIsLoggedIn, setUserData, BASE_URL, setProfileImage } =
    useContext(AuthContext);
  const url = `${BASE_URL}/users`;

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        Alert.alert("Validation", `All fields are required`);
        return;
      }

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(email)) {
        Alert.alert("Email Invalid", "Email is not valid");
        return false;
      }

      const response = await axios.post(`${url}/login`, {
        email,
        password,
      });

      if (response.status === 200) {
        if (response.data !== false) {
          setPassword("");
          setEmail("");
          await AsyncStorage.setItem("@isLoggedIn", "true");
          await AsyncStorage.setItem(
            "@customer",
            JSON.stringify(response.data.user)
          );
          //store profile image seperate
          await AsyncStorage.setItem(
            "@profileImage",
            JSON.stringify({ profileImage: response.data.user.profileimage })
          );
          //setUserData(response.data.user);
          // Alert.alert(
          //   "Login Success",
          //   `Welcome ${response.data.user.fullname}`
          // );
          // navigation.dispatch(
          //   CommonActions.reset({
          //     index: 0,
          //     routes: [{ name: "Main" }],
          //   })
          // );
          setIsLoggedIn(true);
          setUserData(response.data.user);
          if (response.data.user.profileimage !== null) {
            setProfileImage(response.data.user.profileimage);
          } else {
            setProfileImage("http://10.0.2.2:4000/uploads/profile.jpg");
          }
        } else {
          Alert.alert("Login Failed", "Wrong email or password");
        }
      }
    } catch (error) {
      console.error("Login error:", error.message);
      Alert.alert(
        "Error",
        `Something went wrong while logging in: ${error.message}`
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"} // adjust for iOS/Android
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Image Section */}
          <View style={styles.imageContainer}>
            <Image
              source={require("../../assets/car-sports-car-cartoon-caricature.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          {/* Form Section */}
          <View style={styles.Formcontainer}>
            <Text style={styles.title}>Login</Text>

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
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              maxLength={60}
            />

            <TouchableOpacity
              testID="login-button"
              style={styles.button}
              onPress={handleLogin}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={styles.linkText}>
                Don’t have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
