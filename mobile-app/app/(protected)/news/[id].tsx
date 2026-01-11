import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNewsDetail } from "@/src/hooks/useNewsDetail";
import { NewsDetailHeader } from "@/src/components/news/NewsDetailHeader";
import { NewsDetailCard } from "@/src/components/news/NewsDetailCard";
import { NewsDetailHeaderSkeleton } from "@/src/components/news/NewsDetailHeaderSkeleton";
import { NewsDetailCardSkeleton } from "@/src/components/news/NewsDetailCardSkeleton";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { news, loading, error } = useNewsDetail(Number(id));

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <NewsDetailHeaderSkeleton />
        <NewsDetailCardSkeleton />
      </View>
    );
  }
  if (error || !news) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <NewsDetailHeader news={news} />
      <NewsDetailCard news={news} />
    </View>
  );
}
