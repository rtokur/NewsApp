import {
  Text,
  View,
  StyleSheet,
  Pressable,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useState } from "react";
import { AuthContext } from "@/src/context/AuthContext";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import AuthInput from "@/src/components/auth/AuthInput";

export default function LoginScreen() {
  const { logIn, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);

    if (!email || !password) {
      setError("Email and password are required");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }
    
    if (password.length < 6) {
      setError("The password must be at least 6 characters long");
      return;
    }

    try {
      await logIn(email, password, rememberMe);
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
    <SafeAreaView edges={["top", "left", "right"]} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Log in</Text>
        <Text style={styles.subtitle}>
        Enter your email and password to securely access your account and
        manage your services.
        </Text>
      </View>

      <View style={styles.form}>
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
          secure={!secure}
        />

        <ErrorMessage message={error} />

        <View style={styles.optionsRow}>
          <Pressable
            style={styles.rememberMe}
            onPress={() => setRememberMe(!rememberMe)}
          >
            <View
              style={[styles.checkbox, rememberMe && styles.checkboxActive]}
            >
              {rememberMe && <Feather name="check" size={14} color="#fff" />}
            </View>
            <Text style={styles.optionText}>Remember Me</Text>
          </Pressable>

          <Pressable onPress={() => router.push("/forgot-password")}>
            <Text style={styles.forgotText}>Forgot Password</Text>
          </Pressable>
        </View>

        <Pressable
          style={[styles.button, loading && { opacity: 0.6 }]}
          onPress={handleLogin}
          disabled={loading}
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
  },
  footerText: {
    color: "#666",
  },
  register: {
    color: "#2563EB",
    fontWeight: "600",
  },
});
