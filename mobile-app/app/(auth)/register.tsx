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
import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";

export default function RegisterScreen() {
  const { register, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async () => {
    setError(null);
    if (!email || !password || !fullName) {
      setError("Email and password are required");
      return;
    }

    if (confirmPassword !== password) {
      setError("The passwords must be the same");
      return;
    }

    try {
      await register(email, password, fullName);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Email or password is incorrect");
      } else {
        setError("An error occurred, please try again.");
      }
    }
  };

  return (
    <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
      >
        <SafeAreaView edges={["left", "right"]} style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Create a new account to get started and enjoy seamless access to
              our features.
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Full Name"
              icon="user"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Name"
            />

            <AuthInput
              label="Email"
              icon="mail"
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              keyboardType="email-address"
            />

            <AuthInput
              label="Password"
              icon="lock"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••"
              secure
            />

            <AuthInput
              label="Confirm Password"
              icon="lock"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="••••••"
              secure
            />

            <ErrorMessage message={error} />
            <Pressable
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={handleRegister}
              disabled={loading}
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
  },
  footerText: {
    color: "#666",
  },
  login: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
