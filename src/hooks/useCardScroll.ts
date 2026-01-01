import { useCallback, useRef, useState } from "react";
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from "react-native";
export function useCardScroll(
    snapPoint: number,
) {
    const outerScrollRef = useRef<ScrollView>(null);
    const innerScrollRef = useRef<ScrollView>(null);
    const innerScrollOffset = useRef(0);
    const [isCardLocked, setIsCardLocked] = useState(false);
  
    const handleOuterScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        if (offsetY >= snapPoint && !isCardLocked) {
          setIsCardLocked(true);
        }
      },
      [snapPoint, isCardLocked]
    );
  
    const handleInnerScroll = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        innerScrollOffset.current = event.nativeEvent.contentOffset.y;
      },
      []
    );
  
    const handleOuterScrollEndDrag = useCallback(
      (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const velocityY = event.nativeEvent.velocity?.y ?? 0;
  
        if (!isCardLocked) {
          const shouldSnapUp = offsetY > snapPoint / 2 || velocityY < -0.5;
          const shouldSnapDown = velocityY > 0.3;
  
          if (shouldSnapUp) {
            outerScrollRef.current?.scrollTo({ y: snapPoint, animated: true });
          } else if (shouldSnapDown) {
            outerScrollRef.current?.scrollTo({ y: 0, animated: true });
          }
        }
      },
      [snapPoint, isCardLocked]
    );
  
    const collapseCard = useCallback(() => {
      if (!isCardLocked) return;
  
      // Reset inner scroll
      innerScrollRef.current?.scrollTo({ y: 0, animated: false });
      innerScrollOffset.current = 0;
  
      // Unlock card
      setIsCardLocked(false);
  
      // Animate outer scroll back
      setTimeout(() => {
        outerScrollRef.current?.scrollTo({ y: 0, animated: true });
      }, 50);
    }, [isCardLocked]);
  
    return {
      outerScrollRef,
      innerScrollRef,
      isCardLocked,
      handleOuterScroll,
      handleInnerScroll,
      handleOuterScrollEndDrag,
      collapseCard,
    };
}