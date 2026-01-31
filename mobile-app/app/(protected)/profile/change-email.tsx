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
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { CircleButton } from "@/src/components/ui/CircleButton";
import { useForm, Controller } from "react-hook-form";
import {
  ChangeEmailFormData,
  changeEmailSchema,
} from "@/src/validators/change-email.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ChangeEmailScreen() {
  const { user, changeEmail } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      newEmail: "",
      confirmEmail: "",
      currentPassword: "",
    },
  });

  const newEmail = watch("newEmail") || "";
  const confirmEmail = watch("confirmEmail") || "";

  const onSubmit = async (data: ChangeEmailFormData) => {
    setError(null);
    setLoading(true);

    try {
      await changeEmail(data.newEmail, data.currentPassword);

      Alert.alert(
        "Verification Email Sent",
        `We've sent a verification link to ${data.newEmail}. Please check your inbox and click the link to complete the email change.\n\nThe link will expire in 24 hours.`,
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]
      );
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Current password is incorrect");
      } else if (err?.response?.status === 409) {
        setError("This email address is already in use");
      } else if (err?.response?.status === 400) {
        setError(err?.response?.data?.message || "Invalid email address");
      } else {
        setError(
          err?.response?.data?.message || "An error occurred, please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              <CircleButton
                icon="arrow-back-ios-new"
                iconType="material"
                onPress={handleCancel}
                style={{ marginBottom: 10 }}
              />

              <View style={styles.header}>
                <View style={styles.iconContainer}>
                  <Ionicons name="mail-outline" size={64} color="#2563EB" />
                </View>
                <Text style={styles.title}>Change Email</Text>
                <Text style={styles.subtitle}>Update your email address</Text>
              </View>

              <View style={styles.currentEmailBox}>
                <Text style={styles.currentEmailLabel}>Current Email</Text>
                <Text style={styles.currentEmailText}>{user?.email}</Text>
              </View>

              <View style={styles.form}>
                <Controller
                  control={control}
                  name="newEmail"
                  render={({ field: { onChange, value } }) => (
                    <AuthInput
                      label="New Email"
                      icon="mail"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter new email"
                      keyboardType="email-address"
                      editable={!loading && !isSubmitting}
                    />
                  )}
                />
                {errors.newEmail && (
                  <ErrorMessage message={errors.newEmail.message || ""} />
                )}

                <Controller
                  control={control}
                  name="confirmEmail"
                  render={({ field: { onChange, value } }) => (
                    <AuthInput
                      label="Confirm New Email"
                      icon="mail"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Confirm new email"
                      keyboardType="email-address"
                      editable={!loading && !isSubmitting}
                    />
                  )}
                />
                {errors.confirmEmail && (
                  <ErrorMessage message={errors.confirmEmail.message || ""} />
                )}

                <View style={styles.divider} />

                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onChange, value } }) => (
                    <AuthInput
                      label="Current Password"
                      icon="lock"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter current password for security"
                      secure
                      editable={!loading && !isSubmitting}
                    />
                  )}
                />
                {errors.currentPassword && (
                  <ErrorMessage
                    message={errors.currentPassword.message || ""}
                  />
                )}

                <View style={styles.requirements}>
                  <View style={styles.requirementItem}>
                    <Ionicons
                      name={
                        newEmail && confirmEmail && newEmail === confirmEmail
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={16}
                      color={
                        newEmail && confirmEmail && newEmail === confirmEmail
                          ? "#22C55E"
                          : "#999"
                      }
                    />
                    <Text style={styles.requirementText}>Emails match</Text>
                  </View>
                  <View style={styles.requirementItem}>
                    <Ionicons
                      name={
                        newEmail && user?.email && newEmail !== user.email
                          ? "checkmark-circle"
                          : "ellipse-outline"
                      }
                      size={16}
                      color={
                        newEmail && user?.email && newEmail !== user.email
                          ? "#22C55E"
                          : "#999"
                      }
                    />
                    <Text style={styles.requirementText}>
                      Different from current email
                    </Text>
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
                    {loading || isSubmitting
                      ? "Sending Verification..."
                      : "Change Email"}
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
                  For security, we'll send a verification link to your new email
                  address. You'll also receive a notification at your current
                  email. The change will be completed once you verify the new
                  email.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
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
  header: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
  currentEmailBox: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  currentEmailLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  currentEmailText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111111",
  },
  form: {
    marginVertical: 10,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },
  requirements: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginTop: 10,
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
