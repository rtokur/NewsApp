import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { categories } from "../data/categories";
import { CategoryName } from "../hooks/useFilteredNews";

interface Props {
  selectedCategory: CategoryName;
  onSelect: (category: CategoryName) => void;
}

export default function CategoryList({ selectedCategory, onSelect }: Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = selectedCategory === item.name;
        return (
          <Pressable
            onPress={() => onSelect(item.name as CategoryName)}
            style={[styles.item, isActive && styles.itemActive]}
          >
            <Text style={[styles.text, isActive && styles.textActive]}>
              {item.name}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 10,
  },
  item: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
  },
  itemActive: {
    backgroundColor: "#007AFF",
  },
  text: {
    fontSize: 14,
    color: "#8E8E93",
  },
  textActive: {
    color: "#FFFFFF",
  },
});
