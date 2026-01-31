import { User } from "../types/user";
import api from "./api";

type LoginRequest = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  refreshToken: string;
};

type RegisterRequest = {
  email: string;
  password: string;
  fullName: string;
};

type RegisterResponse = {
  message: string;
};

type ForgotPasswordRequest = {
  email: string;
};

type ResetPasswordRequest = {
  token: string;
  newPassword: string;
} ;

type ForgotPasswordResponse = {
  message: string;
};

type ResetPasswordResponse = {
  message: string;
};

type changePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

type ChangePasswordResponse = {
  message: string;
};

export async function loginRequest(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post("/v1/auth/login", data);
  return response.data;
}

export async function registerRequest(
  data: RegisterRequest
): Promise<RegisterResponse> {
  const response = await api.post("/v1/auth/register", data);
  return response.data;
}

export async function forgotPasswordRequest(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  const response = await api.post("/v1/auth/forgotPassword", data);
  return response.data;
}

export async function verifyResetTokenRequest(token: string): Promise<{ valid: boolean }> {
  const response = await api.post("/v1/auth/verifyResetToken", { token });
  return response.data;
}

export async function resetPasswordRequest(data: ResetPasswordRequest): Promise<ResetPasswordResponse> {
  const response = await api.post("/v1/auth/resetPassword", data);
  return response.data;
}

export async function changePasswordRequest(data: changePasswordRequest): Promise<ChangePasswordResponse> {
  const response = await api.post("/v1/auth/changePassword", data);
  return response.data;
}

export async function changeEmailRequest(newEmail: string, currentPassword: string): Promise<{ message: string }> {
  const response = await api.post("/v1/auth/changeEmail", { newEmail, currentPassword });
  return response.data;
}