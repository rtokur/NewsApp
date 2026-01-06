import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState, useMemo, useEffect } from "react";
import { FlatList, StyleSheet, Text, View, ActivityIndicator, Keyboard, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import CategoryList from "@/src/components/news/CategoryList";
import NewsListItem from "@/src/components/news/NewsListItem";
import SearchBar from "@/src/components/ui/SearchBar";

import { useNews } from "@/src/hooks/useNews";
import { useCategories } from "@/src/hooks/useCategories";
import { Category } from "@/src/types/category";
import { useDebounce } from "@/src/hooks/useDebounce";

export default function DiscoverScreen() {
  const { categories, loadingCategories, errorCategories } = useCategories();
  const allCategory: Category = {
    id: 0,
    name: "All",
    newsCount: categories.length,
  };

  const [selectedCategory, setSelectedCategory] = useState<Category>(allCategory);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const categoryList = useMemo(
    () => [allCategory, ...categories],
    [categories]
  );

  const debouncedSearch = useDebounce(searchText, 400);

  const { data, loading, initialLoading, error, hasMore } = useNews({
    page,
    categoryId: selectedCategory.id === 0 ? undefined : selectedCategory.id,
    search: debouncedSearch,
    sortOrder,
  });

  useEffect(() => {
    setPage(1);
  }, [sortOrder, selectedCategory.id, debouncedSearch])

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSearchText("");
  }

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
  }

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

  if (loadingCategories) {
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
            sortOrder={sortOrder}
            onToggleSort={toggleSortOrder}
          />

          <CategoryList
            categories={categoryList}
            selectedCategory={selectedCategory}
            onSelect={handleCategorySelect}
          />

{loading && page === 1 && (
    <View style={styles.inlineLoader}>
      <ActivityIndicator size="small" color="black" />
    </View>
  )}
        </View>

        <FlatList
          data={data ?? []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (!loading && hasMore) {
              setPage(prev => prev + 1);
            }
          }}
          onEndReachedThreshold={0.6}
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
  inlineLoader: {
    paddingVertical: 12,
    alignItems: "center",
  }
});
