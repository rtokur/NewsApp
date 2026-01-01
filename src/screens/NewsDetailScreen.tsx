import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { router, useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { Dimensions, Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import { newsList } from "../data/newsList";
import { useCardScroll } from "../hooks/useCardScroll";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_BASE_HEIGHT = 60;
const CARD_START_RATIO = 0.52;
const BACKGROUND_HEIGHT_RATIO = 0.7;
const SNAP_OFFSET = 25;
const SCROLL_AREA_OFFSET = 20;

export default function NewsDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();

  const news = useMemo(
    () => newsList.find((item) => item.id === id),
    [id]
  );

  const dimensions = useMemo(() => {
    const headerHeight = HEADER_BASE_HEIGHT + insets.top;
    const cardStartTop = SCREEN_HEIGHT * CARD_START_RATIO;
    const snapPoint = cardStartTop - headerHeight - SNAP_OFFSET;
    const innerScrollHeight = SCREEN_HEIGHT - headerHeight - SCROLL_AREA_OFFSET;
    const imageContentBottom = SCREEN_HEIGHT - cardStartTop + 60;

    return {
      headerHeight,
      cardStartTop,
      snapPoint,
      innerScrollHeight,
      imageContentBottom,
    };
  }, [insets.top]);

  const {
    outerScrollRef,
    innerScrollRef,
    isCardLocked,
    handleOuterScroll,
    handleInnerScroll,
    handleOuterScrollEndDrag,
    collapseCard,
  } = useCardScroll(dimensions.snapPoint);

  if (!news) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: news.image }}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <View style={[styles.imageContent, { bottom: dimensions.imageContentBottom }]}>
        <Text style={styles.imageCategory}>{news.category}</Text>
        <Text style={styles.imageTitle}>{news.title}</Text>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Trending</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.dateText}>{news.date}</Text>
        </View>
      </View>

      <ScrollView
        ref={outerScrollRef}
        style={styles.outerScroll}
        showsVerticalScrollIndicator={false}
        onScroll={handleOuterScroll}
        onScrollEndDrag={handleOuterScrollEndDrag}
        scrollEventThrottle={16}
        bounces={false}
        scrollEnabled={!isCardLocked}
        nestedScrollEnabled={true}
      >
        <View style={{ height: dimensions.cardStartTop }} />

        <View style={styles.card}>
          <Pressable onPress={collapseCard} style={styles.handleContainer}>
            <View style={styles.handleBar} />
          </Pressable>

          <ScrollView
            ref={innerScrollRef}
            style={[styles.innerScroll, { height: dimensions.innerScrollHeight }]}
            showsVerticalScrollIndicator={true}
            onScroll={handleInnerScroll}
            scrollEventThrottle={16}
            bounces={true}
            scrollEnabled={isCardLocked}
            nestedScrollEnabled={true}
            contentContainerStyle={styles.innerScrollContent}
          >
            <View style={styles.sourceRow}>
              <Image
                source={{ uri: news.sourceLogo }}
                style={styles.sourceLogo}
              />
              <View>
                <Text style={styles.sourceName}>{news.sourceName}</Text>
                <Text style={styles.sourceDate}>{news.date}</Text>
              </View>
            </View>

            <Text style={styles.description}>{news.description}</Text>

            <View style={{ height: insets.bottom + 20 }} />
          </ScrollView>
        </View>
      </ScrollView>

      <SafeAreaView edges={["top"]} style={styles.headerContainer}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <BlurView intensity={25} tint="dark" style={styles.iconButton}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </BlurView>
          </Pressable>

          <View style={styles.rightIcons}>
            <Pressable>
              <BlurView intensity={25} tint="dark" style={styles.iconButton}>
                <Feather name="bookmark" size={24} color="#fff" />
              </BlurView>
            </Pressable>
            <Pressable>
              <BlurView intensity={25} tint="dark" style={styles.iconButton}>
                <Feather name="share-2" size={24} color="#fff" />
              </BlurView>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  backgroundImage: {
    position: "absolute",
    height: SCREEN_HEIGHT * BACKGROUND_HEIGHT_RATIO,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  imageContent: {
    position: "absolute",
    left: 20,
    right: 20,
    zIndex: 1,
  },
  imageCategory: {
    alignSelf: "flex-start",
    backgroundColor: "#007AFF",
    color: "#FFF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
    marginBottom: 12,
  },
  imageTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFF",
    lineHeight: 32,
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
  dot: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginHorizontal: 8,
  },
  outerScroll: {
    flex: 1,
    zIndex: 10,
  },
  card: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    minHeight: SCREEN_HEIGHT,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 15,
    paddingBottom: 10,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
  },
  innerScroll: {},
  innerScrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 90,
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sourceLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  sourceName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111",
  },
  sourceDate: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    fontWeight: "400",
    color: "#333",
    lineHeight: 26,
    marginBottom: 20,
  },
  headerContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  rightIcons: {
    flexDirection: "row",
    gap: 12,
  },
  iconButton: {
    padding: 11,
    borderRadius: 24,
    overflow: "hidden",
  },
});