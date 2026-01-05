import { ActivityIndicator, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useNewsDetail } from "../hooks/useNewsDetail";
import { NewsDetailHeader } from "../components/news/NewsDetailHeader";
import { NewsDetailCard } from "../components/news/NewsDetailCard";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { news, loading, error } = useNewsDetail(Number(id));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error || !news) return <Text>{error}</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <NewsDetailHeader news={news} />
      <NewsDetailCard news={news} />
    </View>
  );
}
