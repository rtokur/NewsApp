import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import AuthInput from "@/src/components/auth/AuthInput";
import { Controller, useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/src/validators/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";

export default function LoginScreen() {
  const { logIn, loading } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setError(null);

    try {
      await logIn(data.email, data.password, data.rememberMe || false);
    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.header}>
              <Text style={styles.title}>Log in</Text>
              <Text style={styles.subtitle}>
                Enter your email and password to securely access your account
                and manage your services.
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

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Password"
                    icon="lock"
                    value={value}
                    onChangeText={onChange}
                    placeholder="••••••"
                    secure
                  />
                )}
              />
              {errors.password && (
                <ErrorMessage message={errors.password.message || null} />
              )}
              <ErrorMessage message={error} />

              <View style={styles.optionsRow}>
                <Pressable
                  style={styles.rememberMe}
                  onPress={() => setValue("rememberMe", !rememberMe)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      rememberMe && styles.checkboxActive,
                    ]}
                  >
                    {rememberMe && (
                      <Feather name="check" size={14} color="#fff" />
                    )}
                  </View>
                  <Text style={styles.optionText}>Remember Me</Text>
                </Pressable>

                <Pressable onPress={() => router.push("/forgot-password")}>
                  <Text style={styles.forgotText}>Forgot Password</Text>
                </Pressable>
              </View>

              <Pressable
                style={[
                  styles.button,
                  (loading || isSubmitting) && { opacity: 0.6 },
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting}
              >
                <Text style={styles.buttonText}>Login</Text>
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Don’t have an account?</Text>
                <Pressable onPress={() => router.push("/register")}>
                  <Text style={styles.register}> Register</Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
  },
  header: {
    marginTop: 60,
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
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#C7C7CC",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: {
    backgroundColor: "#2563EB",
    borderColor: "#2563EB",
  },
  optionText: {
    fontSize: 14,
    color: "#444",
  },
  forgotText: {
    fontSize: 14,
    color: "#2563EB",
    fontWeight: "500",
  },
  button: {
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  footerText: {
    color: "#666",
  },
  register: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
