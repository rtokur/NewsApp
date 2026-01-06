import { router } from "expo-router";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreakingNewsCarousel } from "@/src/components/news/BreakingNewsCarousel";
import NewsListItem from "@/src/components/news/NewsListItem";
import SectionHeader from "@/src/components/ui/SectionHeader";
import { useRecommendedNews } from "@/src/hooks/useRecommendedNews";
import { useBreakingHighlight } from "@/src/hooks/useBreakingHighlight";

export default function HomeScreen() {
  const { data: breakingNewsHighlight, loading: breakingLoading, error: breakingError } = useBreakingHighlight();
  const { data: recommendedNews, loading: recommendedLoading, error: recommendedError } = useRecommendedNews();

  if (recommendedLoading || breakingLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (recommendedError || breakingError) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <Text style={styles.errorText}>{recommendedError || breakingError}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={recommendedNews ?? []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsListItem
            item={item}
            onPress={() =>
              router.push({ pathname: "/news/[id]", params: { id: item.id } })
            }
          />
        )}
        ListHeaderComponent={
          <>
            <SectionHeader
              title="Breaking News"
              onPress={() => console.log("Viewall")}
            />
            <BreakingNewsCarousel data={breakingNewsHighlight} />
            <SectionHeader
              title="Recommendation"
              onPress={() => console.log("Viewall")}
            />
          </>
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No news available.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    color: "#555555",
  },
});
