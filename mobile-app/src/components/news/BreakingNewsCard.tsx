import { LinearGradient } from "expo-linear-gradient";
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { timeAgo } from "../../utils/timeAgo";
import { News } from "../../types/news";

interface Props {
  item: News;
  scale: Animated.AnimatedInterpolation<number>;
  width: number;
  onPress?: () => void;
}

export function BreakingNewsCard({ item, scale, width, onPress }: Props) {
  return (
    <Animated.View style={{ width, transform: [{ scale }] }}>
      <Pressable style={styles.card} onPress={onPress}>
        <View style={styles.cardInner}>
          <ImageBackground
            source={{
              uri:
                item.imageUrl ??
                "https://via.placeholder.com/400x200.png?text=No+Image",
            }}
            style={styles.image}
            imageStyle={styles.imageRadius}
          >
            <LinearGradient
              colors={[
                "rgba(0,0,0,0.55)",
                "rgba(0,0,0,0.20)",
                "rgba(0,0,0,0.75)",
              ]}
              locations={[0, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />
            {item.category && (
              <Text style={styles.category}>{item.category.name}</Text>
            )}
            <View style={styles.cardSourceContainer}>
              <Text style={styles.cardSourceName}>
                {item.source ?? "Unknown"}
              </Text>
              <Text style={styles.dot}>•</Text>
              <Text style={styles.date}>
                {item.publishedAt ? timeAgo(item.publishedAt) : "Just now"}
              </Text>
            </View>

            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.title}
            </Text>
          </ImageBackground>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 200,
    marginTop: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 15,
  },
  imageRadius: {
    borderRadius: 20,
  },
  category: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#007AFF",
    color: "#FFF",
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 12,
    fontWeight: "500",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
    marginTop: 2,
  },
  cardSourceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardSourceName: {
    fontSize: 13,
    fontWeight: "300",
    color: "#FFF",
  },
  dot: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFF",
    marginHorizontal: 8,
  },
  date: {
    fontSize: 13,
    fontWeight: "300",
    color: "#FFF",
  },
});
