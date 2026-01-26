import { AuthContext } from "@/src/context/AuthContext";
import Feather from "@expo/vector-icons/Feather";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import { useContext } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const { logOut, user } = useContext(AuthContext);

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => logOut(),
        },
      ],
      { cancelable: true }
    );
  };


  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>
        <View style={styles.profileSection}>
          {user?.profileImageUrl ? (
            <Image
              source={{ uri: user.profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Feather name="user" size={48} color="#2563EB" />
            </View>
          )}

          <View style={styles.profileInfo}>
            <Text style={styles.username}>{user?.fullName}</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
          <Pressable
            style={styles.editButton}
            onPress={() => router.push({ pathname: "../profile/edit-profile" })}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
            <MaterialIcons name="chevron-right" size={18} color="#007AFF" />
          </Pressable>
        </View>
        <ProfileSection title="CONTENT" />
        <View style={styles.optionsContainer}>
          <ProfileOption
            title="Saved News"
            icon="bookmark-border"
            onPress={() =>
              router.push({
                pathname: "/favorites",
              })
            }
          />
          <ProfileOption title="Topics & Interests" icon="interests" />
          <ProfileOption
            title="Reading History"
            icon="history"
            onPress={() =>
              router.push({
                pathname: "../profile/reading-history",
              })
            }
          />
        </View>
        <ProfileSection title="PREFERENCES" />
        <View style={styles.optionsContainer}>
          <ProfileOption title="Notifications" icon="notifications-none" />
          <ProfileOption title="Reading Preferences" icon="menu-book" />
          <ProfileOption title="Language & Region" icon="language" />
        </View>
        <ProfileSection title="ACCOUNT" />
        <View style={styles.optionsContainer}>
          <ProfileOption title="Privacy & Security" icon="lock-outline" />
          <ProfileOption title="AI Features" icon="auto-awesome" />
        </View>
        <Pressable onPress={handleLogout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={20} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProfileOption({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable style={styles.optionItem} onPress={onPress}>
      <View style={styles.optionLeft}>
        <MaterialIcons name={icon} size={22} color="#007AFF" />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={22} color="#C7C7CC" />
    </Pressable>
  );
}

function ProfileSection({ title }: { title: string }) {
  return <Text style={styles.sectionTitle}>{title}</Text>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
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
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#EFF6FF",
    borderWidth: 2,
    borderColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E5E7EB",
  },
  editIcon: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    fontWeight: "300",
    color: "#555555",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    marginLeft: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 24,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 0.6,
    color: "#6B7280",
  },
  optionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    fontWeight: "400",
    color: "#111111",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: "auto",
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    gap: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#EF4444",
  },
});
