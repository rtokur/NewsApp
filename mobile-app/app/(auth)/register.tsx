import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Touchable,
  TouchableWithoutFeedback,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { router } from "expo-router";
import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import {
  RegisterFormData,
  registerSchema,
} from "@/src/validators/register.schema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView } from "react-native";
import { CircleButton } from "@/src/components/ui/CircleButton";

export default function RegisterScreen() {
  const { register, loading } = useContext(AuthContext);

  const [error, setError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);

    try {
      await register(data.email, data.password, data.fullName);

      Alert.alert(
        "Registration Successful",
        "Your account has been created successfully.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setError("This email is already registered");
      } else if (err?.response?.status === 400) {
        setError(err?.response?.data?.message || "Invalid registration data");
      } else {
        setError("An unexpected error occurred, please try again");
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView edges={["left", "right", "top"]} style={styles.container}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="always"
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="none"
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <View style={{ flex: 1 }}>
            <CircleButton
              icon="arrow-back-ios-new"
              iconType="material"
              onPress={() => router.back()}
              style={{ marginBottom: 10 }}
            />
            <View style={styles.header}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>
                Create a new account to get started and enjoy seamless access to
                our features.
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="fullName"
                render={({ field: { onChange, value } }) => (
                  <AuthInput
                    label="Full Name"
                    icon="user"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Name"
                  />
                )}
              />
              {errors.fullName && (
                <ErrorMessage message={errors.fullName.message || null} />
              )}

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
                  />
                )}
              />
              {errors.confirmPassword && (
                <ErrorMessage
                  message={errors.confirmPassword.message || null}
                />
              )}

              <ErrorMessage message={error} />
              <Pressable
                style={[
                  styles.button,
                  (loading || isSubmitting) && { opacity: 0.6 },
                ]}
                onPress={handleSubmit(onSubmit)}
                disabled={loading || isSubmitting}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </Pressable>

              <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <Pressable onPress={() => router.back()}>
                  <Text style={styles.login}> Login</Text>
                </Pressable>
              </View>
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
    marginTop: 30,
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
    justifyContent: "center",
    marginTop: 10,
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
  login: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
