import { AuthContext } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { logOut, user} = useContext(AuthContext);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Image
            source={{
              uri: user?.avatar || "https://via.placeholder.com/150",
            }}
            style={styles.avatarImage}
          />
        </View>

        <Text style={styles.username}>{user?.fullName || "Rümeysa"}</Text>
        <Text style={styles.email}>{user?.email || "rumeysa@mail.com"}</Text>

        <Pressable style={styles.editButton} onPress={() => router.push({
                    pathname: "/profile",
                  })}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </Pressable>
      </View>

      <View style={styles.options}>
        <ProfileOption title="Saved News" />
        <ProfileOption title="Notifications" />
        <ProfileOption title="Privacy & Security" />
        <ProfileOption title="Help & Support" />
      </View>

      <Pressable onPress={logOut} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log Out</Text>
      </Pressable>

    </SafeAreaView>
  );
}

function ProfileOption({ title }: { title: string }) {
  return (
    <Pressable style={styles.optionItem}>
      <Text style={styles.optionText}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginTop: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  username: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
    marginTop: 4,
  },
  email: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  editButton: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#2563EB",
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "500",
  },
  options: {
    marginTop: 32,
  },
  optionItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
  logoutButton: {
    marginTop: "auto",
    marginBottom: 24,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: "#EF4444",
    alignItems: "center",
  },
  logoutText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
