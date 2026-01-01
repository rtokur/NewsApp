import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CategoryList from "../components/CategoryList";
import NewsListItem from "../components/NewsListItem";
import SearchBar from "../components/SearchBar";
import { CategoryName, useFilteredNews } from "../hooks/useFilteredNews";

import { router } from "expo-router";

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
  const [selectedCategory, setSelectedCategory] = useState<CategoryName>("All");
  const [searchText, setSearchText] = useState("");

  const filteredNews = useFilteredNews(selectedCategory, searchText);
  const renderNewsItem = useCallback(
    ({ item }: { item: NewsItem }) => (
      <NewsListItem
        item={item}
        onPress={() =>
          router.push({ pathname: "/news/[id]", params: { id: item.id } })
        }
      />
    ),
    [router]
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>No news found</Text>
    </View>
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
