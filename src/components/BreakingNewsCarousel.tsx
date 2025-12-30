import { useRef, useState } from "react";
import { Animated, Dimensions, FlatList, View } from "react-native";
import { BreakingNewsCard } from "./BreakingNewsCard";
import { PaginationDots } from "./PaginationDots";
const { width: SCREEN_WIDTH } = Dimensions.get("window");

const CARD_WIDTH = SCREEN_WIDTH * 0.8;
const CARD_SPACING = 2;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;
const ITEM_SIZE = CARD_WIDTH + CARD_SPACING;

interface Props {
  data: any[];
}

export function BreakingNewsCarousel({ data }: Props) {
  const listRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);
  const loopedData = [data[data.length - 1], ...data, data[0]];

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
        initialScrollIndex={1}
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
            <BreakingNewsCard item={item} scale={scale} width={CARD_WIDTH} />
          );
        }}
      />

      <PaginationDots length={data.length} activeIndex={activeIndex} />
    </View>
  );
}
