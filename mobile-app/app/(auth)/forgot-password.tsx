import AuthInput from "@/src/components/auth/AuthInput";
import ErrorMessage from "@/src/components/ui/ErrorMessage";
import { AuthContext } from "@/src/context/AuthContext";
import { useContext, useState } from "react";
import { Pressable, Text, View, StyleSheet, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPasswordScreeen() {
  const { forgotPassword, loading } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleForgotPassword = async () => {
    setError(null);

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      await forgotPassword(email);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        setError("Email is incorrect");
      } else {
        setError("An error occurred, please try again.");
      }
    }
  };

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
          <AuthInput
            label="Email"
            icon="mail"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
          />

          <ErrorMessage message={error} />

          <Pressable
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Continue</Text>
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
});
