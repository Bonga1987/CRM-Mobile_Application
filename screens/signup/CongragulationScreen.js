import { View, Text, Image, TouchableOpacity } from "react-native";
import styles from "../../style/styles.";


export default function CongragulationScreen({navigation}) {
  return (
    <View style={styles.container}>
      {/* Image Section */}
      <View style={styles.verifyImageContainer}>
        <Image
          source={require('../../assets/verification.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* Text Section */}
      <View style={styles.verifyTextContainer}>
        <Text style={[styles.title,{color:"green"}]}>GREAT✅</Text>
        <Text style={[styles.buttonText,{fontSize: 20, marginBottom: 30}]}>
          your account has been verified
        </Text>

        {/* Buttons */}
        <View style={[styles.buttonContainer,{justifyContent:"center",marginVertical:180}]}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={styles.buttonText}>Continue to login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
