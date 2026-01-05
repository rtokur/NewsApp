import { FlatList, Pressable, StyleSheet, Text } from "react-native";
import { Category } from "@/src/types/category";
interface Props {
  categories: Category[];
  selectedCategory: Category;
  onSelect: (category: Category) => void;
}

export default function CategoryList({ categories ,selectedCategory, onSelect }: Props) {
  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => {
        const isActive = selectedCategory.id === item.id;
        return (
          <Pressable
            onPress={() => onSelect(item)}
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
