import {
  Text,
  View,
  StyleSheet,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  TouchableWithoutFeedback,
  Pressable,
  Platform,
  ActivityIndicator,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";
import { router } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import AuthInput from "@/src/components/auth/AuthInput";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { CircleButton } from "@/src/components/ui/CircleButton";
import { AuthContext } from "@/src/context/AuthContext";
import { updateProfile } from "@/src/services/userService";

interface SelectedImage {
  uri: string;
  name: string;
  type: string;
}

export default function EditProfileScreen() {
  const { user, refreshUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? "");
      setProfileImage(user.profileImageUrl ?? null);
    }
  }, [user]);

  useEffect(() => {
    const nameChanged = fullName.trim() !== (user?.fullName ?? "");
    const imageChanged = selectedImage !== null;
    setHasChanges(nameChanged || imageChanged);
  }, [fullName, selectedImage, user]);

  const pickImage = async () => {
    try {
      const { status: currentStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
      
      let finalStatus = currentStatus;

      if (currentStatus !== ImagePicker.PermissionStatus.GRANTED) {
        const { status: requestedStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        finalStatus = requestedStatus;
      }

      if (finalStatus !== ImagePicker.PermissionStatus.GRANTED) {
        Alert.alert(
          "Permission Required",
          "Photo library access is required to upload a profile picture. Please enable it in your device settings.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const filename = uri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : 'image/jpeg';

        setProfileImage(uri);
        
        setSelectedImage({
          uri,
          name: filename,
          type,
        });
      }
    } catch (error: any) {
      console.error("Image picker error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Validation Error", "Name is required");
      return;
    }

    if (!hasChanges) {
      Alert.alert("Info", "No changes to save");
      return;
    }

    try {
      setLoading(true);

      const payload: any = {};
      
      if (fullName.trim() !== user?.fullName) {
        payload.fullName = fullName.trim();
      }

      await updateProfile(payload, selectedImage || undefined);

      if (refreshUser) {
        await refreshUser();
      }

      Alert.alert(
        "Success", 
        "Profile updated successfully",
        [
          {
            text: "OK",
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error("Update profile error:", error);
      
      let errorMessage = 'An error occurred while updating profile';
      
      if (error?.response?.data?.message) {
        if (Array.isArray(error.response.data.message)) {
          errorMessage = error.response.data.message.join(', ');
        } else {
          errorMessage = error.response.data.message;
        }
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      Alert.alert("Update Failed", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        "Discard Changes",
        "You have unsaved changes. Are you sure you want to leave?",
        [
          {
            text: "Stay",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View style={styles.header}>
          <CircleButton
            icon="arrow-back-ios-new"
            iconType="material"
            onPress={handleCancel}
          />
          <Text style={styles.title}>Edit Profile</Text>
          {hasChanges && (
            <View style={styles.changeIndicator}>
              <View style={styles.changeDot} />
            </View>
          )}
          {!hasChanges && <View style={{ width: 24 }} />}
        </View>
        
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                {profileImage ? (
                  <Image
                    source={{ uri: profileImage }}
                    style={styles.profileImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.placeholderImage}>
                    <Feather name="user" size={48} color="#2563EB" />
                  </View>
                )}
              </View>
              
              <Pressable 
                style={styles.cameraButton} 
                onPress={pickImage}
                disabled={loading}
              >
                <Feather name="camera" size={20} color="#fff" />
              </Pressable>
              
              <Text style={styles.uploadText}>Tap to change photo</Text>
              
              {selectedImage && (
                <View style={styles.imageBadge}>
                  <Feather name="check-circle" size={16} color="#10B981" />
                  <Text style={styles.imageBadgeText}>New image selected</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="user" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <AuthInput
                label="Full Name"
                icon="user"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Feather name="settings" size={18} color="#2563EB" />
                <Text style={styles.sectionTitle}>Account Settings</Text>
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Feather name="mail" size={20} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>Email Address</Text>
                    <Text style={styles.settingSubtitle}>
                      Change your email address
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
              </View>

              <Pressable style={styles.settingItem} onPress={() => {router.push('/(protected)/profile/change-password')
              }}>
                <View style={styles.settingLeft}>
                  <View style={styles.settingIconContainer}>
                    <Feather name="lock" size={20} color="#2563EB" />
                  </View>
                  <View>
                    <Text style={styles.settingTitle}>Password</Text>
                    <Text style={styles.settingSubtitle}>
                      Change your password
                    </Text>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#999" />
              </Pressable>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconContainer}>
                <Feather name="info" size={16} color="#2563EB" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoTitle}>Account Security</Text>
                <Text style={styles.infoText}>
                  Changing your email or password will require additional
                  verification for your account security.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <Pressable
                style={[
                  styles.saveButton, 
                  (loading || !hasChanges) && styles.saveButtonDisabled
                ]}
                onPress={handleSave}
                disabled={loading || !hasChanges}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={styles.saveButtonText}>Saving...</Text>
                  </>
                ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                )}
              </Pressable>

              <Pressable
                style={styles.cancelButton}
                onPress={handleCancel}
                disabled={loading}
              >
                <Feather name="x" size={20} color="#666" />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111111",
  },
  changeIndicator: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  changeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2563EB",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    flexGrow: 1,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 32,
  },
  imageContainer: {
    position: "relative",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  cameraButton: {
    position: "absolute",
    right: 0,
    bottom: 0,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  uploadText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  imageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#D1FAE5",
    borderRadius: 12,
  },
  imageBadgeText: {
    fontSize: 12,
    color: "#059669",
    fontWeight: "600",
  },
  section: {
    marginTop: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111111",
  },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F9FAFB",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  settingIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  infoCard: {
    flexDirection: "row",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#DBEAFE",
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E40AF",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: "#1E40AF",
    lineHeight: 18,
  },
  buttonContainer: {
    marginTop: 32,
    gap: 12,
  },
  saveButton: {
    height: 50,
    backgroundColor: "#2563EB",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#2563EB",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
});