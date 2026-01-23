import { useFocusEffect, useLocalSearchParams } from "expo-router";
import {
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Pressable,
  Keyboard,
} from "react-native";
import NewsListItem from "@/src/components/news/NewsListItem";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/src/components/ui/SearchBar";
import { useCategories } from "@/src/hooks/useCategories";
import { Category } from "@/src/types/category";
import { useDebounce } from "@/src/hooks/useDebounce";
import NewsListItemSkeleton from "@/src/components/news/NewsListItemSkeleton";
import CategoryList from "@/src/components/news/CategoryList";
import Feather from "@expo/vector-icons/Feather";
import { FavoriteItem, useFavorites } from "@/src/hooks/useFavorites";
import ErrorState from "@/src/components/ui/ErrorState";
import { getErrorType } from "@/src/utils/errorUtils";

type SkeletonItem = { _skeleton: true };
type ListItem = FavoriteItem | SkeletonItem;

const SKELETON_DATA: SkeletonItem[] = Array.from({ length: 6 }, () => ({
  _skeleton: true,
}));

const MIN_SEARCH_LENGTH = 3;

export default function FavoritesScreen() {
  const { categories, loadingCategories, errorCategories, refetchCategories } = useCategories();
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
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const categoryList = useMemo(
    () => [allCategory, ...categories],
    [allCategory, categories]
  );
  const listRef = useRef<FlatList<ListItem>>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const isFirstFocus = useRef(true);
  const isMounted = useRef(false);

  const debouncedSearch = useDebounce(searchText, 400);

  const effectiveSearch =
    debouncedSearch.length >= MIN_SEARCH_LENGTH ? debouncedSearch : undefined;

  const { data, loading, initialLoading, error, hasMore, loadMore, refetch } = useFavorites(
    10, {
      categoryId: selectedCategory.id === 0 ? undefined : selectedCategory.id,
      search: effectiveSearch,
      sortOrder
    }
  );

  const [showSkeleton, setShowSkeleton] = useState(true);
  const canShowEmpty =
    !showSkeleton && !initialLoading && !loading && (data?.length ?? 0) === 0;

  // Only refetch when returning to screen (not on first mount or filter changes)
  useFocusEffect(
    useCallback(() => {
      // Skip on first mount
      if (!isMounted.current) {
        isMounted.current = true;
        return;
      }
      
      // Skip if filters just changed
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      
      // Refetch without showing skeleton for background updates
      refetch();
    }, [])
  );

  // Reset first focus flag when filters change
  useEffect(() => {
    isFirstFocus.current = true;
  }, [sortOrder, selectedCategory.id, effectiveSearch]);

  // Scroll to top and show skeleton when filters change
  useEffect(() => {
    listRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
    setShowSkeleton(true);
  }, [sortOrder, selectedCategory.id, effectiveSearch]);

  // Hide skeleton after initial load
  useEffect(() => {
    if (!initialLoading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [initialLoading]);

  const handleCategorySelect = useCallback((category: Category) => {
    setSelectedCategory(category);
    setSearchText("");
  }, []);

  const toggleSortOrder = useCallback(() => {
    setSortOrder((prev) => (prev === "DESC" ? "ASC" : "DESC"));
  }, []);

  const handleEndReached = useCallback(() => {
    if (!showSkeleton && !loading && hasMore) {
      loadMore();
    }
  }, [showSkeleton, loading, hasMore, loadMore]);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) =>
      "_skeleton" in item ? (
        <NewsListItemSkeleton />
      ) : (
        <NewsListItem
          item={item.news}
          onPress={() =>
            router.push({
              pathname: "/news/[id]",
              params: { id: item.news.id },
            })
          }
        />
      ),
    []
  );

  const FavoritesHeader = useMemo(() => {
    return (
      <>
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.subtitle}>Your saved news in one place</Text>

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
  }, [searchText, sortOrder, selectedCategory, categoryList, toggleSortOrder, handleCategorySelect]);

  const ListFooter = useMemo(() => {
    if (loading && !initialLoading && hasMore) {
      return (
        <View style={styles.inlineLoader}>
          <ActivityIndicator size="small" color="#2563EB" />
        </View>
      );
    }
    return null;
  }, [loading, initialLoading, hasMore]);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 300;
    
    setShowScrollTop((prev) =>
      prev !== shouldShow ? shouldShow : prev
    );
  }, []);

  const handleRetry = () => {
    if (errorCategories) {
      refetchCategories?.();
    } else if (error) {
      refetch?.();
    }
  };

  if (loadingCategories) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </SafeAreaView>
    );
  }

  if (error || errorCategories) {
    const errorMessage = (error || errorCategories) || undefined;
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
      <Text style={styles.emptyText}>No favorites yet</Text>
      <Text style={styles.emptySubtext}>
        Add news to favorites to see them here
      </Text>
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
            "_skeleton" in item ? `skeleton-${index}` : `favorite-${item.favoriteId}`
          }
          renderItem={renderItem}
          ListHeaderComponent={FavoritesHeader}
          ListEmptyComponent={canShowEmpty ? ListEmpty : null}
          ListFooterComponent={ListFooter}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.2}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={styles.listContent}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="handled"
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          windowSize={10}
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
    paddingHorizontal: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#C7C7CC",
    textAlign: "center",
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