import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import { AuthContext } from "@/src/context/AuthContext";
import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/src/validators/forgot-password.schema";
import Ionicons from "@expo/vector-icons/Ionicons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, View, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreeen() {
  const { forgotPassword, loading } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const email = watch("email");
  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);

    try {
      await forgotPassword(data.email);
      setEmailSent(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "An error occurred, please try again."
      );
    }
  };

  if (emailSent) {
    return (
      <SafeAreaView edges={["left", "right"]} style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={64} color="#2563EB" />
          </View>

          <Text style={styles.successTitle}>Check Your Email</Text>

          <Text style={styles.successMessage}>
            We've sent a password reset link to{"\n"}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <Text style={styles.infoText}>
            Please check your email and click on the link to reset your
            password.
          </Text>

          <Pressable style={styles.button} onPress={() => router.back()}>
            <Text style={styles.buttonText}>Back to Login</Text>
          </Pressable>

          <Pressable
            style={styles.resendButton}
            onPress={() => setEmailSent(false)}
          >
            <Text style={styles.resendButtonText}>Resend Email</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <SafeAreaView edges={["left", "right"]} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.subtitle}>
            Enter your email address to receive a reset link and regain access
            to your account.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AuthInput
                label="Email"
                icon="mail"
                value={value}
                onChangeText={onChange}
                placeholder="example@email.com"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <ErrorMessage message={errors.email.message || null} />
          )}

          <ErrorMessage message={error} />

          <Pressable
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Sending..." : "Continue"}
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 10,
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  header: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 35,
    fontWeight: "700",
    marginHorizontal: 20,
    color: "#111111",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "300",
    marginTop: 5,
    marginHorizontal: 20,
    color: "#555555",
    textAlign: "center",
  },
  form: {
    marginTop: 30,
  },
  button: {
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
  successTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 8,
  },
  emailText: {
    fontWeight: "600",
    color: "#2563EB",
  },
  infoText: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 20,
  },
  resendButton: {
    marginTop: 16,
    paddingVertical: 12,
  },
  resendButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
});
