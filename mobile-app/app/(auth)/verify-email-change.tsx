import { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { verifyEmailChangeRequest } from "@/src/services/authService";

export default function VerifyEmailChangeScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    verifyEmailChange();
  }, []);

  const verifyEmailChange = async () => {
    if (!token) {
      setError("Invalid verification link");
      setVerifying(false);
      return;
    }

    try {
      await verifyEmailChangeRequest(token);
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError("This verification link is invalid or has expired.");
      } else if (err?.response?.status === 409) {
        setError("This email address is already in use by another account.");
      } else {
        setError(
          err?.response?.data?.message ||
            "An error occurred while verifying your email change."
        );
      }
      setSuccess(false);
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Verifying your email change...</Text>
      </View>
    );
  }

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: "#DCFCE7" }]}>
            <Ionicons name="checkmark-circle" size={80} color="#22C55E" />
          </View>

          <Text style={styles.title}>Email Changed Successfully!</Text>
          <Text style={styles.message}>
            Your email address has been updated successfully. You can now use
            your new email to sign in.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() => router.replace("/login")}
          >
            <Text style={styles.buttonText}>Continue to Login</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: "#FEE2E2" }]}>
          <Ionicons name="close-circle" size={80} color="#EF4444" />
        </View>

        <Text style={styles.title}>Verification Failed</Text>
        <Text style={styles.message}>{error}</Text>

        <Pressable
          style={styles.button}
          onPress={() => router.replace("/(protected)/(tabs)")}
        >
          <Text style={styles.buttonText}>Go to Home</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.secondaryButtonText}>Back to Login</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  content: {
    alignItems: "center",
    maxWidth: 400,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontSize: 16,
    color: "#555555",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    paddingHorizontal: 20,
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#2563EB",
    fontSize: 16,
    fontWeight: "500",
  },
});
