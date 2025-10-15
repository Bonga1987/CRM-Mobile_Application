import {
  View,
  Text,
  RefreshControl,
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
import { useState, useContext, useCallback } from "react";
import styles from "../../style/styles.";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function MyProfileScreen() {
  const {
    userData,
    setUserData,
    profileImage,
    setProfileImage,
    BASE_URL,
    BASE_URL_UPLOAD,
    formatedDateNoHours,
  } = useContext(AuthContext);
  const url = `${BASE_URL}/users`;
  const [customerid] = useState(userData.customerid);
  const [fullname, setFullName] = useState(userData.fullname);
  const [address, setAddress] = useState(userData.address);
  const [phonenumber, setPhoneNumber] = useState(userData.phonenumber);
  const [email, setEmail] = useState(userData.email);
  const [driverslicense, setDriversLicense] = useState(userData.driverslicense);
  const [licensecode, setLicenseCode] = useState(userData.licensecode);
  const [licenseissuedate, setIssueDate] = useState(
    new Date(userData.licenseissuedate) || new Date()
  );
  const [licenseexpirydate, setExpiryDate] = useState(
    new Date(userData.licenseexpirydate) || new Date()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [pickerField, setPickerField] = useState(null); // 'issue' or 'expiry'

  const licenseCodes = [
    { label: "Select Code", value: "" },
    { label: "A1", value: "A1" },
    { label: "A", value: "A" },
    { label: "B", value: "B" },
    { label: "EB", value: "EB" },
    { label: "C1", value: "C1" },
    { label: "C", value: "C" },
    { label: "EC1", value: "EC1" },
    { label: "EC", value: "EC" },
  ];

  const validateForm = (fullname, driverslicense, phoneNumber, email) => {
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
    }

    return true;
  };

  const handleButtonPress = async () => {
    if (isEditing) {
      try {
        if (
          !fullname ||
          !address ||
          !phonenumber ||
          !email ||
          !driverslicense ||
          !licensecode
        ) {
          Alert.alert("Validation", `All fields are required`);
          return;
        }

        if (
          validateForm(fullname, driverslicense, phonenumber, email) === false
        ) {
          return;
        }

        const customer = {
          customerid,
          fullname,
          address,
          phonenumber,
          email,
          driverslicense,
          licensecode,
          licenseissuedate,
          licenseexpirydate,
        };

        //api call to update profile
        const response = await axios.post(`${url}/update`, customer);

        if (response.status === 200) {
          if (response.data === true) {
            await AsyncStorage.setItem("@customer", JSON.stringify(customer));
            setUserData(customer);

            Alert.alert("Success", "Profile updated successfully!");
          } else {
            Alert.alert("Error updating profile");
          }
        }
      } catch (error) {
        Alert.alert("Error", error);
        console.error("Error updating profile:", error);
      }
    }
    setIsEditing(!isEditing);
  };

  const chooseProfileImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission required to access gallery");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "Images",
        quality: 0.7,
      });

      if (!result.canceled) {
        const localUri = result.assets[0].uri;
        const filename = localUri.split("/").pop();

        const formData = new FormData();
        formData.append("profileImage", {
          uri: localUri,
          name: filename,
          type: "image/jpeg",
        });

        const response = await axios.post(
          `${BASE_URL_UPLOAD}/upload/${customerid}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        await AsyncStorage.setItem(
          "@profileImage",
          JSON.stringify({ profileImage: response.data.url })
        );
        setProfileImage(response.data.url); // store URL for display

        //setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Could not upload image");
      console.error(error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const showPicker = (field) => {
    setPickerField(field);
    setPickerVisible(true);
  };

  const handleConfirm = (selectedDate) => {
    if (pickerField === "issue") setIssueDate(selectedDate);
    if (pickerField === "expiry") setExpiryDate(selectedDate);
    setPickerVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.Signupcontainer}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>My Profile</Text>
          </View>

          {/* Profile Picture and Name */}
          <View style={styles.profileContainer}>
            <View style={styles.imageWrapper}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              <TouchableOpacity
                style={styles.editIcon}
                onPress={chooseProfileImage}
              >
                <Icon name="pencil" size={20} color="#000000ff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.Formcontainer}>
            {/* Details */}
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={fullname}
              editable={isEditing}
              onChangeText={setFullName}
              maxLength={100}
            />

            <TextInput
              style={styles.input}
              placeholder="Address"
              value={address}
              editable={isEditing}
              onChangeText={setAddress}
              maxLength={64}
            />

            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phonenumber}
              editable={isEditing}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
            />

            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              editable={isEditing}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              maxLength={64}
            />

            <TextInput
              style={[styles.input, { borderRadius: 10 }]}
              placeholder="Driver’s License Number"
              value={driverslicense}
              editable={isEditing}
              onChangeText={setDriversLicense}
              maxLength={12}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 95,
                gap: 5,
              }}
            >
              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker("issue")}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#555",
                    textAlign: "center",
                    fontWeight: "208",
                  }}
                >
                  {licenseissuedate.toDateString()}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.input}
                onPress={() => showPicker("expiry")}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: "#555",
                    textAlign: "center",
                    fontWeight: "208",
                  }}
                >
                  {licenseexpirydate.toDateString()}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
              />
            </View>

            <View style={(styles.pickerWrapper, styles.input)}>
              <Picker
                style={styles.input}
                selectedValue={licensecode}
                onValueChange={setLicenseCode}
              >
                {licenseCodes.map((item, indx) => (
                  <Picker.Item
                    key={indx}
                    label={item.label}
                    value={item.value}
                  />
                ))}
              </Picker>
            </View>

            {/* Edit/Save Button */}
            <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
              <Text style={styles.buttonText}>
                {isEditing ? "Save" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
