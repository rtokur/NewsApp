import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, StyleSheet, ActivityIndicator, View, Pressable, Keyboard } from "react-native";
import NewsListItem from "@/src/components/news/NewsListItem";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/src/components/ui/SearchBar";
import { NewsData } from "@/src/types/news";
import { useCategories } from "@/src/hooks/useCategories";
import { Category } from "@/src/types/category";
import { useDebounce } from "@/src/hooks/useDebounce";
import NewsListItemSkeleton from "@/src/components/news/NewsListItemSkeleton";
import CategoryList from "@/src/components/news/CategoryList";
import Feather from "@expo/vector-icons/Feather";
import { useNews } from "@/src/hooks/useNews";

type SkeletonItem = { _skeleton: true };
type ListItem = NewsData | SkeletonItem;

const SKELETON_DATA: SkeletonItem[] = Array.from({ length: 6 }, () => ({
  _skeleton: true,
}));

const MIN_SEARCH_LENGTH = 3;

export default function NewsListScreen() {
  const { type, title } = useLocalSearchParams<{
    type?: "breaking" | "recommendations";
    title?: string;
  }>();
  const { categories, loadingCategories, errorCategories } = useCategories();
  const allCategory = useMemo(
    () => ({
      id: 0,
      name: "All",
      newsCount: categories.length,
    }),
    [categories.length]
  );
  const [selectedCategory, setSelectedCategory] =
  useState<Category>(allCategory);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const categoryList = useMemo(
    () => [allCategory, ...categories],
    [categories]
  );

  const debouncedSearch = useDebounce(searchText, 400);

  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : undefined;

  const { data, loading, initialLoading, error, hasMore } = useNews({
    type: type === "recommendations" ? "recommendations" : "breaking",
    page,
    categoryId: selectedCategory.id === 0 ? undefined : selectedCategory.id,
    search: effectiveSearch,
    sortOrder,
});

  const [showSkeleton, setShowSkeleton] = useState(true);
  const canShowEmpty =
    !showSkeleton && !initialLoading && !loading && (data?.length ?? 0) === 0;

  useEffect(() => {
    setPage(1);
  }, [sortOrder, selectedCategory.id, debouncedSearch]);

  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(true);
    }
  }, [initialLoading]);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setSearchText("");
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
  };

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) =>
      "_skeleton" in item ? (
        <NewsListItemSkeleton />
      ) : (
        <NewsListItem
          item={item}
          onPress={() =>
            router.push({
              pathname: "/news/[id]",
              params: { id: item.id },
            })
          }
        />
      ),
    []
  );

  const ListHeader = useMemo(() => {
    return (
      <>
        <Text style={styles.title}>{title}</Text>

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
      </>
    );
  }, [searchText, sortOrder, selectedCategory, categoryList]);

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
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
    <FlatList<ListItem>
          data={showSkeleton ? SKELETON_DATA : data}
          keyExtractor={(item, index) =>
            "_skeleton" in item ? `skeleton-${index}` : item.id.toString()
          }
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={canShowEmpty ? ListEmpty : null}
          ListFooterComponent={
            loading && page > 1 ? (
              <View style={styles.inlineLoader}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          onEndReached={() => {
            if (!loading && hasMore) {
              setPage((prev) => prev + 1);
            }
          }}
          onEndReachedThreshold={0.6}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
    </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    marginTop: 10,
    marginHorizontal: 20,
    color: "#111111",
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
  },
});
