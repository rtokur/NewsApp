import { useLocalSearchParams } from "expo-router";
import { FlatList, Text, StyleSheet, ActivityIndicator, View, Pressable, Keyboard } from "react-native";
import NewsListItem from "@/src/components/news/NewsListItem";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import PaginationBar from "@/src/components/ui/PaginationBar";

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
  const listRef = useRef<FlatList<ListItem>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : undefined;

  const { data, loading, initialLoading, error, totalPages } = useNews({
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
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    setShowSkeleton(true);
  }, [page]);

  useEffect(() => {
    if (!loading && !initialLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 500);

      return () => clearTimeout(timer);
    } 
  }, [loading, initialLoading]);

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
          ref={listRef}
          data={showSkeleton ? SKELETON_DATA : data}
          keyExtractor={(item, index) =>
            "_skeleton" in item ? `skeleton-${index}` : item.id.toString()
          }
          renderItem={renderItem}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={canShowEmpty ? ListEmpty : null}
          ListFooterComponent={
            !loading && totalPages > 1 ? (
              <PaginationBar
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => {
                  if (newPage !== page) {
                    setPage(newPage);
                  }
                }}
              />
            ) : null
          }
          onScroll={(event) => {
            const offsetY = event.nativeEvent.contentOffset.y;
            setShowScrollTop(offsetY > 300);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
        />
    </SafeAreaView>
    {showScrollTop && (
        <Pressable
          style={styles.scrollTopButton}
          onPress={() => {
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            });
          }}
        >
          <Feather name="arrow-up" size={22} color="#FFFFFF" />
        </Pressable>
      )}
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
  scrollTopButton: {
    position: "absolute",
    alignSelf: "center",
    bottom: 80,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
