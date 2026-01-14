import { View, Text, Pressable, StyleSheet } from "react-native";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationBar({
  currentPage,
  totalPages,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <View style={styles.container}>
      {pages.map((page) => (
        <Pressable
          key={page}
          onPress={() => onPageChange(page)}
          style={[
            styles.pageButton,
            page === currentPage && styles.activePage,
          ]}
        >
          <Text
            style={[
              styles.pageText,
              page === currentPage && styles.activeText,
            ]}
          >
            {page}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 16,
    gap: 8,
  },
  pageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  activePage: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  pageText: {
    color: "#374151",
    fontWeight: "500",
  },
  activeText: {
    color: "#FFFFFF",
  },
});
