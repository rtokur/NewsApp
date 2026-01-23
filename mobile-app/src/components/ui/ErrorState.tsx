import { View, Text, StyleSheet, Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  type?: "network" | "server" | "notFound" | "general";
}

export default function ErrorState({ 
  message, 
  onRetry,
  type = "general" 
}: ErrorStateProps) {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: "wifi-off" as const,
          title: "No Connection",
          description: message || "Please check your internet connection and try again.",
          iconColor: "#FF9500",
        };
      case "server":
        return {
          icon: "alert-circle" as const,
          title: "Server Error",
          description: message || "Something went wrong on our end. Please try again later.",
          iconColor: "#FF3B30",
        };
      case "notFound":
        return {
          icon: "search" as const,
          title: "Not Found",
          description: message || "We couldn't find what you're looking for.",
          iconColor: "#8E8E93",
        };
      default:
        return {
          icon: "alert-triangle" as const,
          title: "Oops!",
          description: message || "Something went wrong. Please try again.",
          iconColor: "#FF9500",
        };
    }
  };

  const config = getErrorConfig();

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: `${config.iconColor}15` }]}>
        <Feather name={config.icon} size={40} color={config.iconColor} />
      </View>
      
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>
      
      {onRetry && (
        <Pressable 
          style={({ pressed }) => [
            styles.retryButton,
            pressed && styles.retryButtonPressed
          ]}
          onPress={onRetry}
        >
          <Feather name="refresh-cw" size={18} color="#FFFFFF" style={styles.retryIcon} />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  retryButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  retryIcon: {
    marginRight: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});