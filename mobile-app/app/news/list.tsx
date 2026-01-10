import { useLocalSearchParams } from "expo-router";
import { FlatList, Text } from "react-native";
import NewsListItem from "@/src/components/news/NewsListItem";
import { router } from "expo-router";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePaginatedNews } from "@/src/hooks/usePaginatedNews";

export default function NewsListScreen() {
  const { type, title } = useLocalSearchParams<{
    type?: "breaking" | "recommendations";
    title?: string;
  }>();

  const [page, setPage] = useState(1);

  const { data, loading, hasMore } = usePaginatedNews(
    type === "recommendations" ? "recommendations" : "breaking",
  );

  return (
    <SafeAreaView>
      <Text> title</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <NewsListItem
            item={item}
            onPress={() =>
              router.push({ pathname: "/news/[id]", params: { id: item.id } })
            }
          />
        )}
        onEndReached={() => {
          if (hasMore && !loading) setPage((prev) => prev + 1);
        }}
      />
    </SafeAreaView>
  );
}
