import Feather from "@expo/vector-icons/Feather";
import React, { useRef } from "react";
import Swipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import { View, Text, StyleSheet, Alert, Pressable } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

export default function SwipeToDelete({
  children,
  onDelete,
}: {
  children: React.ReactNode;
  onDelete: () => void;
}) {
  const swipeableRef = useRef<React.ElementRef<typeof Swipeable>>(null);

  const handleDelete = () => {
    Alert.alert(
      "Remove from History",
      "Are you sure you want to remove this article from your reading history?",
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            swipeableRef.current?.close();
          },
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            onDelete();
            swipeableRef.current?.close();
          },
        },
      ]
    );
  };
  const renderRightActions = (progress: any, dragX: any) => {
    const animatedStyle = useAnimatedStyle(() => {
      const opacity = interpolate(
        dragX.value,
        [-80, -40, -10, 0],
        [1, 0.8, 0.3, 0],
        Extrapolation.CLAMP
      );

      return {
        opacity,
      };
    });

    return (
      <Pressable style={styles.deleteActionContainer} onPress={handleDelete}>
        <Animated.View style={[styles.deleteAction, animatedStyle]}>
          <Feather name="trash-2" size={22} color="#FFFFFF" />
          <Text style={styles.deleteText}>Remove</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      overshootRight={false}
    >
      {children}
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  deleteActionContainer: {
    width: 80,
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteAction: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  deleteText: {
    color: "#FFFFFF",
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
  },
});