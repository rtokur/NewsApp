import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  item: {
    image: string;
    category: string;
    title: string;
    sourceLogo: string;
    sourceName: string;
    date: string;
  };
  onPress: () => void;
};

export default function NewsListItem({ item, onPress }: Props) {
  return (
    <Pressable 
    style={styles.container}
    onPress={onPress}
    >
      <Image source={{ uri: item.image }} style={styles.thumbnail} />

      <View style={styles.content}>
        <Text style={styles.category}>{item.category}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.sourceRow}>
          <Image source={{ uri: item.sourceLogo }} style={styles.sourceLogo} />
          <Text style={styles.sourceName}>{item.sourceName}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  content: {
    flex: 1,
    marginLeft: 10,
  },
  category: {
    fontSize: 11,
    fontWeight: "light",
    color: "#777",
    marginBottom: 10,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#111",
    marginBottom: 10,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sourceLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  sourceName: {
    fontSize: 12,
    color: "#777",
  },
  dot: {
    fontSize: 15,
    fontWeight: "800",
    color: "#777",
    marginHorizontal: 5,
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
});
