import { FlatList, Pressable, StyleSheet, Text } from "react-native";

type Category = {
  id: string;
  name: string;
};

interface Props {
  categories: Category[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export default function CategoryList({
  categories,
  selectedCategory,
  onSelect,
}: Props) {
  const renderItem = ({ item }: { item: Category }) => {
    const isActive = selectedCategory === item.name;

    return (
      <Pressable
        onPress={() => onSelect(item.name)}
        style={[styles.item, isActive && styles.itemActive]}
      >
        <Text style={[styles.text, isActive && styles.textActive]}>
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      renderItem={renderItem}
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
