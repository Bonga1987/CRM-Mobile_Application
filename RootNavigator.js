import { StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";
import WelcomeScreen from "./screens/welcome/WelcomeScreen";
import LoginScreen from "./screens/login/LoginScreen";
import SignUpScreen from "./screens/signup/SignUpScreen";
import VerifyScreen from "./screens/signup/VerifyScreen";
import CongragulationScreen from "./screens/signup/CongragulationScreen";
import HomeScreen from "./screens/home/HomeScreen";
import SearchScreen from "./screens/search/SearchScreen";
import ProfileScreen from "./screens/profile/ProfileScreen";
import ResultsScreen from "./screens/search/ResultsScreen";
import CarDetailScreen from "./screens/car/CarDetailScreen";
import DateSelectionScreen from "./screens/booking/DateSelectionScreen";
import MyProfileScreen from "./screens/profile/MyProfileScreen";
import MyBookingScreen from "./screens/profile/MyBookingScreen";
import CheckoutScreen from "./screens/checkout/CheckOutScreen";
import InvoiceScreen from "./screens/invoice/InvoiceScreen";
import MyInvoiceScreen from "./screens/profile/MyInvoiceScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LocationSelection from "./components/location/LocationSelection";
import BookingDetailsScreen from "./screens/profile/BookingDetailsScreen";
import ChangePasswordScreen from "./screens/profile/ChangePasswordScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home-outline";
          else if (route.name === "Search") iconName = "search-outline";
          else if (route.name === "Profile") iconName = "person-outline";

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#22c55e", // green
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={SearchScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    // Load login state on app start
    const checkLogin = async () => {
      const loggedIn = await AsyncStorage.getItem("@isLoggedIn");
      setIsLoggedIn(loggedIn === "true");
    };
    checkLogin();
  }, []);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="Results" component={ResultsScreen} />
          <Stack.Screen name="CarDetail" component={CarDetailScreen} />
          <Stack.Screen name="DateSelection" component={DateSelectionScreen} />
          <Stack.Screen name="MyProfile" component={MyProfileScreen} />
          <Stack.Screen name="MyBooking" component={MyBookingScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Invoice" component={InvoiceScreen} />
          <Stack.Screen name="MyInvoice" component={MyInvoiceScreen} />
          <Stack.Screen
            name="ChangePassword"
            component={ChangePasswordScreen}
          />
          <Stack.Screen
            name="LocationSelection"
            component={LocationSelection}
          />
          <Stack.Screen
            name="BookingDetails"
            component={BookingDetailsScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen
            name="Congragulation"
            component={CongragulationScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
