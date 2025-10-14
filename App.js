import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./context/AuthContext";
import RootNavigator from "./RootNavigator";
import { StripeProvider } from "@stripe/stripe-react-native";
import { navigationRef } from "./root_navigation/Navigation";

export default function App() {
  return (
    <StripeProvider publishableKey="pk_test_51Q3yhXFQOBQnWDpWsF1wk9OhYaZeIXxvhOsyYHura5rHaZ0PvSk15vKkiVyPM3CLQ7rmlkpLCnA50cn9clwFKJX200f0ozoVW4">
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </StripeProvider>
  );
}
