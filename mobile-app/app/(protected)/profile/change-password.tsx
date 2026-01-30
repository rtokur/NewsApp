import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import { AuthContext } from "@/src/context/AuthContext";
import { useContext, useState } from "react";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Touchable,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CircleButton } from "@/src/components/ui/CircleButton";
import { useForm, Controller } from "react-hook-form";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/src/validators/change-password.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChangePasswordScreen() {
  const { changePassword, loading } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const currentPassword = watch("currentPassword");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  const onSubmit = async (data: ChangePasswordFormData) => {
    setError(null);

    try {
      await changePassword(data.currentPassword, data.newPassword);

      Alert.alert(
        "Success",
        "Your password has been changed successfully. Please login again with your new password.",
        [
          {
            text: "OK",
          },
        ]
      );
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Current password is incorrect");
      } else if (err?.response?.status === 400) {
        setError(
          err?.response?.data?.message ||
            "New password cannot be the same as current password"
        );
      } else {
        setError(
          err?.response?.data?.message || "An error occurred, please try again."
        );
      }
    }
  };

    

  return (
    <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <CircleButton
              icon="arrow-back-ios-new"
              iconType="material"
              onPress={() => router.back()}
              style={{ marginBottom: 10 }}
            />

            <View style={styles.header}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={64}
                  color="#2563EB"
                />
              </View>
              <Text style={styles.title}>Change Password</Text>
              <Text style={styles.subtitle}>
                Update your password to keep your account secure
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Current Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter current password"
                    secure
                    editable={!loading && !isSubmitting}
                  />
                )}
              />
              {errors.currentPassword && (
                <ErrorMessage message={errors.currentPassword.message || ""} />
              )}

              <View style={styles.divider} />

              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="New Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter new password"
                    secure
                    editable={!loading && !isSubmitting}
                  />
                )}
              />
              {errors.newPassword && (
                <ErrorMessage message={errors.newPassword.message || ""} />
              )}

              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Confirm New Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm new password"
                    secure
                    editable={!loading && !isSubmitting}
                  />
                )}
              />
              {errors.confirmPassword && (
                <ErrorMessage message={errors.confirmPassword.message || ""} />
              )}

              <View style={styles.requirements}>
                <Text style={styles.requirementsTitle}>
                  Password Requirements:
                </Text>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword && newPassword.length >= 8
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={newPassword && newPassword.length >= 8 ? "#22C55E" : "#999"}
                  />
                  <Text style={styles.requirementText}>
                    At least 8 characters
                  </Text>
                </View>
                <View style={styles.requirementItem}>
                  <Ionicons
                    name={
                      newPassword && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)
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
                      currentPassword &&
                      newPassword !== currentPassword
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={16}
                    color={
                      newPassword &&
                      currentPassword &&
                      newPassword !== currentPassword
                        ? "#22C55E"
                        : "#999"
                    }
                  />
                  <Text style={styles.requirementText}>
                    Different from current password
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

              {error && <ErrorMessage message={error} />}

              <Pressable
                style={[
                  styles.button,
                  (loading || isSubmitting) && { opacity: 0.6 },
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {loading || isSubmitting ? "Changing..." : "Change Password"}
                </Text>
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={loading || isSubmitting}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
            </View>

            <View style={styles.infoBox}>
              <Ionicons
                name="information-circle-outline"
                size={20}
                color="#2563EB"
              />
              <Text style={styles.infoText}>
                After changing your password, you'll be logged out and need to
                login again with your new password.
              </Text>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
          </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
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
    marginHorizontal: 20,
  },
  form: {
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  requirements: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 10,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
    marginBottom: 12,
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
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    alignItems: "flex-start",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1E40AF",
    marginLeft: 12,
    lineHeight: 20,
  },
});