import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState, useMemo } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Keyboard, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import CategoryList from "../components/news/CategoryList";
import NewsListItem from "../components/news/NewsListItem";
import SearchBar from "../components/ui/SearchBar";

import { useAllNews } from "../hooks/useAllNews";
import { useCategories } from "../hooks/useCategories";
import { useFilteredNews } from "../hooks/useFilteredNews";
import { Category } from "../types/category";

export default function DiscoverScreen() {
  const { data, loading, error } = useAllNews();
  const { categories, loadingCategories, errorCategories } = useCategories();
  const allCategory: Category = {
    id: 0,
    name: "All",
    newsCount: categories.length,
  };
  const categoryList = useMemo(
    () => [allCategory, ...categories],
    [categories]
  );

  const [selectedCategory, setSelectedCategory] =
    useState<Category>(allCategory);
  const [searchText, setSearchText] = useState("");

  const filteredNews = useFilteredNews(data, selectedCategory, searchText);

  const renderNewsItem = useCallback(
    ({ item }: any) => (
      <NewsListItem
        item={item}
        onPress={() =>
          router.push({ pathname: "/news/[id]", params: { id: item.id } })
        }
      />
    ),
    []
  );

  if (loading || loadingCategories) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (error || errorCategories) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
        <Text>{error || errorCategories}</Text>
      </SafeAreaView>
    );
  }

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Feather name="inbox" size={48} color="#C7C7CC" />
      <Text style={styles.emptyText}>No news found</Text>
    </View>
  );

  return (
    <Pressable
      style={{ flex: 1 }}
      onPress={Keyboard.dismiss}
      accessible={false}
    >
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
            categories={categoryList}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </View>

        <FlatList
          data={filteredNews}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </Pressable>
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
