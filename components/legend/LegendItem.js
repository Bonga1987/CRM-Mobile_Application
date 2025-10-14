import { View, Text } from "react-native";

export default function LegendItem({ color, label }) {
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <View
      style={{
        width: 15,
        height: 15,
        backgroundColor: color,
        marginRight: 5,
        borderRadius: 3,
      }}
    />
    <Text>{label}</Text>
  </View>;
}
