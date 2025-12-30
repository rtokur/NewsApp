import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BreakingNewsCarousel } from "../components/BreakingNewsCarousel";
import NewsListItem from "../components/NewsListItem";
import SectionHeader from "../components/SectionHeader";
import { breakingNews } from "../data/breakingNews";
import { newsList } from "../data/newsList";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <FlatList
        data={newsList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NewsListItem item={item} />}
        ListHeaderComponent={
          <>
            <SectionHeader
              title="Breaking News"
              onPress={() => console.log("Viewall")}
            />
            <BreakingNewsCarousel data={breakingNews} />
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
  },
});
