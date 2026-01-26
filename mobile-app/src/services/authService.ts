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

export async function forgotPasswordRequest(data: ForgotPasswordRequest) {
  const response = await api.post("/v1/auth/forgotPassword", data);

  return null;
}

