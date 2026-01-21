import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { formatDate } from "../../utils/formatDate";
import { NewsDetail } from "../../types/newsDetail";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import { Animated } from "react-native";
import { BlurView } from "expo-blur";

export const AnimatedBlurView =
  Animated.createAnimatedComponent(BlurView);

interface Props {
  news: NewsDetail;
}

export function NewsDetailCard({ news }: Props) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const blurOpacity = scrollY.interpolate({
    inputRange: [0, 30, 90],
    outputRange: [0, 0.6, 1],
    extrapolate: "clamp",
  });
  
  const blurIntensity = scrollY.interpolate({
    inputRange: [0, 40, 120],
    outputRange: [0, 12, 28],
    extrapolate: "clamp",
  });
  
  const gradientOpacity = scrollY.interpolate({
    inputRange: [0, 20, 100],
    outputRange: [0, 0.8, 1],
    extrapolate: "clamp",
  });  

  return (
    <View style={styles.card}>
<Animated.View
  style={[
    styles.topBlurContainer,
    { opacity: blurOpacity },
  ]}
  pointerEvents="none"
>
  {/* BLUR */}
  <AnimatedBlurView
    intensity={blurIntensity}
    tint="light"
    style={styles.blur}
  />

  {/* FADE MASK – BLUR'U YUMUŞAK BİTİRİR */}
  <LinearGradient
    colors={[
      "rgba(255,255,255,1)",
      "rgba(255,255,255,0.9)",
      "rgba(255,255,255,0.6)",
      "rgba(255,255,255,0.25)",
      "rgba(255,255,255,0.0)",
    ]}
    locations={[0, 0.25, 0.5, 0.75, 1]}
    style={styles.blurFadeMask}
  />
</Animated.View>


      <Animated.ScrollView
  contentContainerStyle={styles.content}
  showsVerticalScrollIndicator={false}
  scrollEventThrottle={16}
  onScroll={Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )}
>
        <View style={styles.sourceRow}>
          <Image source={{ uri: news.source.logoUrl }} style={styles.logo} />
          <View>
            <Text style={styles.source}>{news.source.name}</Text>
            <Text style={styles.date}>{formatDate(news.publishedAt)}</Text>
          </View>
        </View>

        <Text style={styles.text}>{news.content}</Text>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    overflow: "hidden",
  },
  content: {
    padding: 20,
    paddingTop: 20,
  },
  topBlurContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 110,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    zIndex: 10,
  },
  
  blur: {
    ...StyleSheet.absoluteFillObject,
  },
  
  blurFadeMask: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80, 
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  source: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    lineHeight: 28,
    color: "#333",
    paddingBottom: 15,
  },
});
