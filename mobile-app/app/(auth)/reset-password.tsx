import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import { useEffect, useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  resetPasswordRequest,
  verifyResetTokenRequest,
} from "@/src/services/authService";
import { useForm, Controller } from "react-hook-form";
import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "@/src/validators/reset-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();

  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch("newPassword") || "";
  const confirmPassword = watch("confirmPassword") || "";

  useEffect(() => {
    verifyToken();
  }, []);

  const verifyToken = async () => {
    if (!token) {
      Alert.alert("Invalid Link", "This password reset link is invalid.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
      return;
    }

    try {
      await verifyResetTokenRequest(token);
      setTokenValid(true);
    } catch {
      Alert.alert(
        "Link Expired",
        "This password reset link is invalid or has expired.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } finally {
      setVerifying(false);
    }
  };

  const onSubmit = async (data: ResetPasswordFormData) => {
    setError(null);

    try {
      await resetPasswordRequest({
        token: data.token,
        newPassword: data.newPassword,
      });

      Alert.alert(
        "Success",
        "Your password has been successfully reset. You can now login with your new password.",
        [{ text: "Login", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      setError(
        error?.response?.data?.message || "An error occurred, please try again."
      );
    }
  };

  if (verifying) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={styles.loadingText}>Verifying link...</Text>
      </View>
    );
  }

  if (!tokenValid) {
    return null;
  }

  return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons name="key-outline" size={60} color="#2563EB" />
              </View>
              <Text style={styles.title}>Create New Password</Text>
              <Text style={styles.subtitle}>
                Please enter your new password below
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="New Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="••••••"
                    secure
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.newPassword && (
                <ErrorMessage message={errors.newPassword.message || null} />
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Confirm Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="••••••"
                    secure
                    editable={!isSubmitting}
                  />
                )}
              />
              {errors.confirmPassword && (
                <ErrorMessage
                  message={errors.confirmPassword.message || null}
                />
              )}
              <View style={styles.requirements}>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword.length >= 8
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={newPassword.length >= 8 ? "#22C55E" : "#999"}
                  />
                  <Text style={styles.requirementText}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
                        ? "#22C55E"
                        : "#999"
                    }
                  />
                  <Text style={styles.requirementText}>
                    Contains uppercase, lowercase, and number
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword
                        ? "#22C55E"
                        : "#999"
                    }
                  />
                  <Text style={styles.requirementText}>Passwords match</Text>
                </View>
              </View>

              <ErrorMessage message={error} />

              <Pressable
                style={[styles.button, isSubmitting && { opacity: 0.6 }]}
                onPress={handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? "Resetting..." : "Reset Password"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => router.replace("/login")}
                disabled={isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>
          </ScrollView>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#555",
  },
  header: {
    marginTop: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    color: "#111111",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "300",
    marginTop: 5,
    color: "#555555",
    textAlign: "center",
  },
  form: {
    marginTop: 30,
  },
  showPasswordButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  showPasswordText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#555",
  },
  requirements: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#555",
    marginLeft: 8,
  },
  button: {
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 16,
  },
});
