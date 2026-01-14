import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY =  "refreshToken";

export async function setAccesssToken(token: string) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, token);
}

export async function getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}

export async function removeAccessToken() {
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function setRefreshToken(token: string) {
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, token);
}

export async function getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
}

export async function removeRefreshToken() {
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
}

export async function clearTokens() {
    await removeAccessToken();
    await removeRefreshToken();
}