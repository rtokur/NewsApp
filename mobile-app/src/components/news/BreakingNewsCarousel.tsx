import { router } from "expo-router";
import { useRef, useState, useEffect } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
import { BreakingNewsCard } from "./BreakingNewsCard";
import { PaginationDots } from "../ui/PaginationDots";
import { News } from "../../types/news";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 2;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const ITEM_SIZE = CARD_WIDTH + CARD_SPACING;

interface Props {
  data: News[];
}

export function BreakingNewsCarousel({ data }: Props) {
  const listRef = useRef<FlatList>(null);

  const scrollX = useRef(new Animated.Value(ITEM_SIZE)).current;

  const [activeIndex, setActiveIndex] = useState(0);

  const loopedData = [data[data.length - 1], ...data, data[0]];

  useEffect(() => {
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: ITEM_SIZE, animated: false });
    });
  }, []);

  const handleLoop = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / ITEM_SIZE);

    if (index === 0) {
      listRef.current?.scrollToOffset({
        offset: ITEM_SIZE * data.length,
        animated: false,
      });
      setActiveIndex(data.length - 1);
      return;
    }

    if (index === data.length + 1) {
      listRef.current?.scrollToOffset({
        offset: ITEM_SIZE,
        animated: false,
      });
      setActiveIndex(0);
      return;
    }

    setActiveIndex(index - 1);
  };

  return (
    <View>
      <Animated.FlatList
        ref={listRef}
        data={loopedData}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_SIZE}
        decelerationRate="fast"
        bounces={false}
        contentContainerStyle={{ paddingHorizontal: SIDE_PADDING }}
        getItemLayout={(_, index) => ({
          length: ITEM_SIZE,
          offset: ITEM_SIZE * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleLoop}
        ItemSeparatorComponent={() => <View style={{ width: CARD_SPACING }} />}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * ITEM_SIZE,
            index * ITEM_SIZE,
            (index + 1) * ITEM_SIZE,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.85, 1, 0.85],
            extrapolate: "clamp",
          });

          return (
            <BreakingNewsCard
              item={item}
              scale={scale}
              width={CARD_WIDTH}
              onPress={() =>
                router.push({
                  pathname: "/news/[id]",
                  params: { id: item.id },
                })
              }
            />
          );
        }}
      />

      <PaginationDots length={data.length} activeIndex={activeIndex} />
    </View>
  );
}
