import { useEffect, useRef, useState } from "react";
import { Dimensions, FlatList, ImageBackground, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/* ---------- Layout constants ---------- */
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const CARD_WIDTH = SCREEN_WIDTH * 0.82;
const CARD_SPACING = 20;
const SIDE_PADDING = (SCREEN_WIDTH - CARD_WIDTH) / 2;

/* ---------- Data ---------- */
const breakingNews = [
  {
    id: '1',
    title: 'Apple releases new iOS update',
    image:
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
  },
  {
    id: '2',
    title: 'Global markets rally today',
    image:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d',
  },
  {
    id: '3',
    title: 'AI is changing software development',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995',
  },
];

export default function Index() {

  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const loopedData = [ breakingNews[breakingNews.length - 1], ...breakingNews, breakingNews[0] ];
  
  /* ---------- Start from first real item ---------- */
  useEffect(() => {
    setTimeout(() => {
      listRef.current?.scrollToIndex({ index: 1, animated: false });
    }, 0);
  }, []);

  const handleLoop = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (CARD_WIDTH + CARD_SPACING));
  
    if (index === 0) {
      listRef.current?.scrollToIndex({
        index: breakingNews.length,
        animated: false,
      });
    }
  
    if (index === breakingNews.length + 1) {
      listRef.current?.scrollToIndex({
        index: 1,
        animated: false,
      });
    }
  };  

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Breaking News</Text>
        <Pressable>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>

      {/* Breaking News Carousel */}
      <View style ={{marginBottom: 20}}>
        <FlatList
          ref={listRef}
          data={loopedData}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_SPACING}
          decelerationRate="fast"
          bounces={false}
          contentContainerStyle={{
            paddingHorizontal: SIDE_PADDING,
          }}
          onMomentumScrollEnd={handleLoop}
          getItemLayout={(_, index) => ({
            length: CARD_WIDTH + CARD_SPACING,
            offset: (CARD_WIDTH + CARD_SPACING) * index,
            index,
          })}
          renderItem={({ item }) => (
            <Pressable style={styles.card}>
              <View style={styles.cardInner}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.image}
                  imageStyle={styles.imageRadius}
                >
                  <View style={styles.overlay} />
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </ImageBackground>
              </View>
            </Pressable>
          )}
        />
      </View>
      

      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Recommendation</Text>
        <Pressable>
          <Text style={styles.viewAll}>View All</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF', 
  },
  card: {
    width: CARD_WIDTH,
    height: 200,
    marginTop: 25,
    marginRight: CARD_SPACING,
    borderRadius: 20,
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  
    // Android shadow
    elevation: 6,
  },
  cardInner: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 15,
  },
  imageRadius: {
    borderRadius: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
});