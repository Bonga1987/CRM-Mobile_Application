import { useRef, useState } from "react";
import { View, TextInput,Text,TouchableOpacity,Alert } from "react-native";
import styles from "../../style/styles.";
import { SafeAreaView } from "react-native-safe-area-context";


export default function VerifyScreen({navigation}) {
  const [code, setCode] = useState(["", "", "", ""]);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (text, index) => {
    if (/^\d$/.test(text)) { // only allow digits
      const newCode = [...code];
      newCode[index] = text;
      setCode(newCode);

      // Focus next input
      if (index < 3) {
        inputRefs[index + 1].current.focus();
      }
    } else if (text === "") {
      const newCode = [...code];
      newCode[index] = "";
      setCode(newCode);
    }
  };

  const handleVerify = () => {
    const verificationCode = code.join("");
    Alert.alert("Verification Code", verificationCode);
    // You can call your API here to verify the code
    navigation.navigate("Congragulation");
  };

  return (
  <SafeAreaView style={styles.safeArea}>
    <Text style={styles.title}>Verify phone number</Text>
    <Text style={styles.subtitle}>
          we sent on your phone a 4-digit verification code
    </Text>

    <TouchableOpacity >
              <Text style={styles.resendText}>Resend code</Text>
    </TouchableOpacity>

    <View style={styles.codeContainer}>
      {code.map((digit, index) => (
        <TextInput
          key={index}
          ref={inputRefs[index]}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={styles.codeinput}
        />
      ))}
    </View>

   <View style={styles.textContainer}>
     <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
   </View>
  </SafeAreaView>
  );
}
