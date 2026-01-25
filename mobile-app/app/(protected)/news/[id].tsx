import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useNewsDetail } from "@/src/hooks/useNewsDetail";
import { NewsDetailHeader } from "@/src/components/news/NewsDetailHeader";
import { NewsDetailCard } from "@/src/components/news/NewsDetailCard";
import { NewsDetailHeaderSkeleton } from "@/src/components/news/NewsDetailHeaderSkeleton";
import { NewsDetailCardSkeleton } from "@/src/components/news/NewsDetailCardSkeleton";
import ErrorState from "@/src/components/ui/ErrorState";
import { getErrorType } from "@/src/utils/errorUtils";
import { useEffect} from "react";
import { useMarkNewsAsRead } from "@/src/hooks/useMarkAsRead";

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const newsId = Number(id);
  const { news, loading, error, refetch } = useNewsDetail(newsId);
  const { markAsRead } = useMarkNewsAsRead();

  useEffect(() => {
    if (!newsId) return;
    markAsRead(newsId);
  }, [newsId, markAsRead]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <NewsDetailHeaderSkeleton />
        <NewsDetailCardSkeleton />
      </View>
    );
  } 

  if (error || !news) {
    const errorMessage = error || "News not found";
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        edges={["top", "left", "right"]}
      >
        <ErrorState
          message={errorMessage}
          type={!news ? "notFound" : getErrorType(errorMessage)}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <NewsDetailHeader news={news} />
      <NewsDetailCard news={news} />
    </View>
  );
}
