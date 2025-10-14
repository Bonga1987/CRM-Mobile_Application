import { useState, useMemo, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useCallback } from "react";

export default function FilterScreen({ navigation }) {
  const { BASE_URL } = useContext(AuthContext);
  const url = `${BASE_URL}/vehicles`;
  const [selected, setSelected] = useState({
    category: "",
    make: "",
    model: "",
    year: "",
    features: [],
  });
  const [filters, setFilters] = useState([]);
  const [activeAvailableVehicles, setActiveAvailableVehicles] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const filterActiveVehicles = (vehicles) => {
    return vehicles.filter((vehicle) => vehicle.isactive === true);
  };

  const getFilters = async () => {
    try {
      const response = await axios.get(`${url}/filters`);

      if (response.status === 200) {
        if (response.data !== false) {
          setFilters(response.data);
        }
      }
    } catch (error) {
      console.error("Error fetching active and available vehicles:", error);
    }
  };

  const getAllVehicles = async () => {
    try {
      const response = await axios.get(url);

      if (response.status === 200) {
        if (response.data !== false) {
          setActiveAvailableVehicles(filterActiveVehicles(response.data)); // store the vehicles in state
        }
      }
    } catch (error) {
      console.error("Error fetching active and available vehicles:", error);
    }
  };

  useEffect(() => {
    getFilters();
    getAllVehicles();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      getFilters();
      getAllVehicles();
      setSelected({
        category: "",
        make: "",
        model: "",
        year: "",
        features: [],
      });
      setRefreshing(false);
    }, 2000);
  }, []);

  const toggleSelect = (field, value) => {
    setSelected((prev) => ({
      ...prev,
      [field]: prev[field] === value ? null : value,
    }));
  };

  const toggleFeature = (value) => {
    setSelected((prev) => ({
      ...prev,
      features: prev.features.includes(value)
        ? prev.features.filter((f) => f !== value)
        : [...prev.features, value],
    }));
  };

  const getFeaturesArray = (features) => {
    if (!features) return [];
    return features.split(",").map((feature) => feature.trim());
  };

  // Filter cars whenever selection changes
  const filteredCars = useMemo(() => {
    return activeAvailableVehicles.filter((car) => {
      if (selected.category && car.category !== selected.category) return false;
      if (selected.make && car.make !== selected.make) return false;
      if (selected.model && car.model !== selected.model) return false;
      if (selected.year && car.year !== selected.year) return false;

      // Features check (all selected features must be present)
      const featuresArray = getFeaturesArray(car.features);
      if (selected.features.length > 0) {
        for (let f of selected.features) {
          if (!featuresArray.includes(f)) return false;
        }
      }

      return true;
    });
  }, [selected]);

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <Text style={styles.header}>Filter</Text>

        {/* Category */}
        <Text style={styles.label}>Category</Text>
        <View style={styles.optionsRow}>
          {filters[0]?.categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected.category === item && styles.selectedOption,
              ]}
              onPress={() => toggleSelect("category", item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected.category === item && styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Make */}
        <Text style={styles.label}>Make</Text>
        <View style={styles.optionsRow}>
          {filters[0]?.makes.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected.make === item && styles.selectedOption,
              ]}
              onPress={() => toggleSelect("make", item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected.make === item && styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Model */}
        <Text style={styles.label}>Model</Text>
        <View style={styles.optionsRow}>
          {filters[0]?.models.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected.model === item && styles.selectedOption,
              ]}
              onPress={() => toggleSelect("model", item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected.model === item && styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Year */}
        <Text style={styles.label}>Year</Text>
        <View style={styles.optionsRow}>
          {filters[0]?.years.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected.year === item && styles.selectedOption,
              ]}
              onPress={() => toggleSelect("year", item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected.year === item && styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <Text style={styles.label}>Features</Text>
        <View style={styles.optionsRow}>
          {filters[0]?.features.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                selected.features.includes(item) && styles.selectedOption,
              ]}
              onPress={() => toggleFeature(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  selected.features.includes(item) && styles.selectedOptionText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      {/* Show Results Button */}
      <TouchableOpacity
        style={styles.resultButton}
        onPress={() =>
          navigation.navigate("Results", { vehicles: filteredCars })
        } // wire navigation
      >
        <Text style={styles.resultButtonText}>
          show {filteredCars.length} results
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 60,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  optionsRow: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    margin: 5,
    backgroundColor: "#f2f2f2",
  },
  optionText: { fontSize: 14, color: "#333" },
  selectedOption: { backgroundColor: "#ADEBB3", borderColor: "#4CAF50" },
  selectedOptionText: { color: "#000", fontWeight: "bold" },
  resultButton: {
    backgroundColor: "#ADEBB3",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  resultButtonText: { fontSize: 16, fontWeight: "bold", color: "#000" },
});
