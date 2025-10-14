import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import RenderCar from "../../components/Car/RenderCar";
import styles from "../../style/styles.";
import { useRoute } from "@react-navigation/native";

export default function ResultsScreen({ navigation }) {
  const route = useRoute();
  const { vehicles } = route.params;

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterTitle}>Results ({vehicles.length})</Text>
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.vehicleid}
        renderItem={({ item }) => (
          <RenderCar item={item} navigation={navigation} isBooking={false} />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
