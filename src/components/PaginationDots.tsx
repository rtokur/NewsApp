import { View } from "react-native";

interface Props {
    length: number;
    activeIndex: number;
}
  
export function PaginationDots({ length, activeIndex }: Props) {
    return (
      <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 10,marginBottom: 20 }}>
        {Array.from({ length }).map((_, index) => {
            const isActive = index === activeIndex;
            return(
          <View
            key={index}
            style={{
              width: isActive ? 20 : 6,
              height: 6,
              borderRadius: 4,
              marginHorizontal: 2,
              backgroundColor: index === activeIndex ? "#007AFF" : "#ccc",
            }}
          />)
        })}
      </View>
    );
}