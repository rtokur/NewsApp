import Feather from "@expo/vector-icons/Feather";
import { useCallback, useState, useMemo, useEffect, useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Keyboard,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import PaginationBar from "@/src/components/ui/PaginationBar";
import CategoryList from "@/src/components/news/CategoryList";
import NewsListItem from "@/src/components/news/NewsListItem";
import SearchBar from "@/src/components/ui/SearchBar";
import ErrorState from "@/src/components/ui/ErrorState";

import { useNews } from "@/src/hooks/useNews";
import { useCategories } from "@/src/hooks/useCategories";
import { Category } from "@/src/types/category";
import { useDebounce } from "@/src/hooks/useDebounce";
import NewsListItemSkeleton from "@/src/components/news/NewsListItemSkeleton";
import { NewsData } from "@/src/types/news";
import { getErrorType } from "@/src/utils/errorUtils";

type SkeletonItem = { _skeleton: true };
type ListItem = NewsData | SkeletonItem;

const SKELETON_DATA: SkeletonItem[] = Array.from({ length: 6 }, () => ({
  _skeleton: true,
}));

const MIN_SEARCH_LENGTH = 3;

export default function DiscoverScreen() {
  const { categories, loadingCategories, errorCategories, refetchCategories } = useCategories();
  const allCategory = useMemo(
    () => ({
      id: 0,
      name: "All",
      newsCount: categories.length,
    }),
    [categories.length]
  );

  const [selectedCategory, setSelectedCategory] = useState<Category>(allCategory);
  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [page, setPage] = useState(1);
  const categoryList = useMemo(() => [allCategory, ...categories], [categories]);
  const listRef = useRef<FlatList<ListItem>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const debouncedSearch = useDebounce(searchText, 400);

  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : undefined;

  const { data, loading, initialLoading, error, totalPages, refetch } = useNews({
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

  const handleRetry = () => {
    if (errorCategories) {
      refetchCategories?.();
    } else if (error) {
      refetch?.();
    }
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

  const DiscoverHeader = useMemo(() => {
    return (
      <>
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
      </>
    );
  }, [searchText, sortOrder, selectedCategory, categoryList]);

  if (loadingCategories) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error || errorCategories) {
    const errorMessage = error || errorCategories || undefined;
    return (
      <View style={styles.container}>
        <ErrorState
          message={errorMessage}
          type={getErrorType(errorMessage)}
          onRetry={handleRetry}
        />
      </View>
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
        <FlatList<ListItem>
          ref={listRef}
          data={showSkeleton ? SKELETON_DATA : data}
          keyExtractor={(item, index) =>
            "_skeleton" in item ? `skeleton-${index}` : item.id.toString()
          }
          renderItem={renderItem}
          ListHeaderComponent={DiscoverHeader}
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
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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