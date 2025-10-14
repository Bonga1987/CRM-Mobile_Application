import {
  Text,
  TouchableOpacity,
} from "react-native";
import styles from "../../style/styles.";

export default function Chip({label, selected, onPress}){
  return (
    <TouchableOpacity
      style={[styles.chip, selected && styles.chipSelected]}
      onPress={onPress}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};