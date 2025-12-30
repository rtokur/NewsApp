import Feather from "@expo/vector-icons/Feather";
import { useCallback, useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CategoryList from "../components/CategoryList";
import NewsListItem from "../components/NewsListItem";
import SearchBar from "../components/SearchBar";
import { categories } from "../data/categories";
import { newsList } from "../data/newsList";

type NewsItem = {
  id: string;
  image: string;
  category: string;
  title: string;
  sourceLogo: string;
  sourceName: string;
  date: string;
};

export default function DiscoverScreen() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");

  const filteredNews = useMemo(() => {
    let result = newsList;
    if (selectedCategory !== "All") {
      result = result.filter((news) => news.category === selectedCategory);
    }

    if (searchText.trim()) {
      const search = searchText.toLowerCase();
      result = result.filter(
        (news) =>
          news.title.toLowerCase().includes(search) ||
          news.sourceName.toLowerCase().includes(search)
      );
    }
    return result;
  }, [selectedCategory, searchText]);

  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => <NewsListItem item={item} />,
    []
  );

  const ListEmpty = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <Feather name="inbox" size={48} color="#C7C7CC" />
        <Text style={styles.emptyText}>No news found</Text>
      </View>
    ),
    []
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <View>
        <Text style={styles.title}>Discover</Text>
        <Text style={styles.subtitle}>News from all around the world</Text>

        <SearchBar
          value={searchText}
          onChangeText={setSearchText}
          onClear={() => setSearchText("")}
          placeholder="Search"
        />

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </View>

      <FlatList
        data={filteredNews}
        keyExtractor={(item) => item.id}
        renderItem={renderNewsItem}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    marginTop: 10,
    marginHorizontal: 20,
    color: "#111111",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "300",
    marginTop: 5,
    marginHorizontal: 20,
    color: "#555555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    color: "#C7C7CC",
  },
});
