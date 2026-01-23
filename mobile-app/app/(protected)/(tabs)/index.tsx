import { router, useNavigation } from "expo-router";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreakingNewsCarousel } from "@/src/components/news/BreakingNewsCarousel";
import NewsListItem from "@/src/components/news/NewsListItem";
import SectionHeader from "@/src/components/ui/SectionHeader";
import ErrorState from "@/src/components/ui/ErrorState";
import { getErrorType } from "@/src/utils/errorUtils";
import { useHighlightNews } from "@/src/hooks/useHighlightNews";
import BreakingNewsSkeleton from "@/src/components/news/BreakingNewsSkeleton";
import NewsCarouselCardSkeletonItem from "@/src/components/news/NewsSkeletonItem";
import NewsListItemSkeleton from "@/src/components/news/NewsListItemSkeleton";
import { useEffect } from "react";

export default function HomeScreen() {
  const navigation = useNavigation();
  
  const {
    data: breakingNewsHighlight,
    loading: breakingLoading,
    error: breakingError,
    refetch: refetchBreaking,
  } = useHighlightNews("breaking-highlight");
  
  const {
    data: recommendedNewsHighlight,
    loading: recommendedLoading,
    error: recommendedError,
    refetch: refetchRecommended,
  } = useHighlightNews("recommendations-highlight");

  const isLoading = recommendedLoading || breakingLoading;
  const hasError = recommendedError || breakingError;

  useEffect(() => {
    navigation.setOptions({
      headerShown: !hasError,
    });
  }, [hasError, navigation]);

  const handleRetry = () => {
    if (breakingError) refetchBreaking?.();
    if (recommendedError) refetchRecommended?.();
  };

  if (hasError) {
    const errorMessage = (recommendedError || breakingError) || undefined;
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

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {isLoading ? (
        <>
          <SectionHeader
            title="Breaking News"
            onPress={() =>
              router.push({
                pathname: "/news/list",
                params: {
                  type: "breaking",
                  title: "Breaking News",
                },
              })
            }
          />
          <BreakingNewsSkeleton />
          {Array.from({ length: 1 }).map((_, i) => (
            <NewsCarouselCardSkeletonItem key={i} />
          ))}
          <SectionHeader
            title="Recommendation"
            onPress={() =>
              router.push({
                pathname: "/news/list",
                params: {
                  type: "recommendations",
                  title: "Recommendation News",
                },
              })
            }
          />
          {Array.from({ length: 5 }).map((_, i) => (
            <NewsListItemSkeleton key={i} />
          ))}
        </>
      ) : (
        <FlatList
          data={recommendedNewsHighlight}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <NewsListItem
              item={item}
              onPress={() =>
                router.push({
                  pathname: "/news/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <>
              <SectionHeader
                title="Breaking News"
                onPress={() =>
                  router.push({
                    pathname: "/news/list",
                    params: {
                      type: "breaking",
                      title: "Breaking News",
                    },
                  })
                }
              />
              <BreakingNewsCarousel
                data={breakingNewsHighlight ? breakingNewsHighlight : []}
              />
              <SectionHeader
                title="Recommendation"
                onPress={() =>
                  router.push({
                    pathname: "/news/list",
                    params: {
                      type: "recommendations",
                      title: "Recommendation News",
                    },
                  })
                }
              />
            </>
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>No news available.</Text>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555555",
  },
});