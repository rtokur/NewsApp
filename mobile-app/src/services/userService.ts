import api from './api';
import { User } from '../types/user';

export interface UpdateProfilePayload {
  fullName?: string;
}

export interface UserProfile extends User {
  isActive?: boolean;
  createdAt?: string;
}

export interface ChangeEmailRequest {
  newEmail: string;
  currentPassword: string;
}

export interface ChangeEmailResponse {
  message: string;
  newEmail: string;
}

export interface VerifyEmailChangeResponse {
  message: string;
  newEmail: string;
}

export interface PendingEmailChangeResponse {
  newEmail: string;
  expiresAt: string;
  createdAt: string;
}

export async function getMyProfile(): Promise<UserProfile> {
  try {
    console.log("Fetching user profile...");
    const response = await api.get<UserProfile>("/v1/users/profile");
    console.log("User profile fetched:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get profile failed:", error?.response?.data || error?.message);
    throw error;
  }
}

export async function updateProfile(
  payload: UpdateProfilePayload,
  imageFile?: { uri: string; name: string; type: string }
): Promise<{ success: boolean }> {
  try {
    const formData = new FormData();

    if (payload.fullName) {
      formData.append('fullName', payload.fullName);
    }

    if (imageFile) {
      formData.append('image', {
        uri: imageFile.uri,
        name: imageFile.name,
        type: imageFile.type,
      } as any);
    }

    console.log('Updating profile...');
    
    const response = await api.patch<{ success: boolean }>(
      '/v1/users/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    console.log('Profile updated successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Profile update failed:', error?.response?.data || error?.message);
    throw error;
  }
}

export async function updateProfileImage(imageUri: string): Promise<{ success: boolean }> {
  try {
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    const formData = new FormData();
    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    console.log('Uploading profile image...');
    
    const response = await api.patch<{ success: boolean }>(
      '/v1/users/profile',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    console.log('Profile image updated successfully');
    return response.data;
  } catch (error: any) {
    console.error('Image upload failed:', error?.response?.data || error?.message);
    throw error;
  }
}

export async function requestEmailChange(
  data: ChangeEmailRequest
): Promise<ChangeEmailResponse> {
  try {
    console.log('Requesting email change...');
    const response = await api.post<ChangeEmailResponse>(
      '/v1/users/email/change-request',
      data
    );
    console.log('Email change requested successfully');
    return response.data;
  } catch (error: any) {
    console.error('Email change request failed:', error?.response?.data || error?.message);
    throw error;
  }
}

export async function verifyEmailChange(
  token: string
): Promise<VerifyEmailChangeResponse> {
  try {
    console.log('Verifying email change...');
    const response = await api.post<VerifyEmailChangeResponse>(
      '/v1/users/email/verify',
      { token }
    );
    console.log('Email change verified successfully');
    return response.data;
  } catch (error: any) {
    console.error('Email change verification failed:', error?.response?.data || error?.message);
    throw error;
  }
}

export async function getPendingEmailChange(): Promise<PendingEmailChangeResponse> {
  try {
    console.log('Fetching pending email change...');
    const response = await api.get<PendingEmailChangeResponse>(
      '/v1/users/email/pending'
    );
    console.log('Pending email change fetched');
    return response.data;
  } catch (error: any) {
    console.error('Get pending email change failed:', error?.response?.data || error?.message);
    throw error;
  }
}

export async function cancelEmailChange(): Promise<{ message: string }> {
  try {
    console.log('Cancelling email change...');
    const response = await api.delete<{ message: string }>(
      '/v1/users/email/cancel'
    );
    console.log('Email change cancelled successfully');
    return response.data;
  } catch (error: any) {
    console.error('Cancel email change failed:', error?.response?.data || error?.message);
    throw error;
  }
}