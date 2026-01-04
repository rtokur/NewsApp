import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreakingNewsCarousel } from "../components/BreakingNewsCarousel";
import NewsListItem from "../components/NewsListItem";
import SectionHeader from "../components/SectionHeader";
import { fetchNews } from "../services/newsService";

export default function HomeScreen() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const breakingNewsData = useMemo(() => {
    return data.map((item, index) => ({
      id: item.id.toString(),
      title: item.title,
      image: item.imageUrl,
      category: item.category?.name ?? "General",
      sourceName: item.source?? "Unknown",
      date: item.publishedAt,
    }));
  }, [data]);

  useEffect(() => {
    let isMounted = true;
    const loadNews = async () => {
      try {
        const fetchedNews = await fetchNews(1, 10);
        if (isMounted) {
          setData(fetchedNews);
        }
      } catch (error) {
        if (isMounted) {
          setError("Failed to load news. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    loadNews();
      return () => {
        isMounted = false;
      };
    
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right", "top"]}>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
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
            <BreakingNewsCarousel data={breakingNewsData} />
            <SectionHeader
              title="Recommendation"
              onPress={() => console.log("Viewall")}
            />
          </>
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
});
