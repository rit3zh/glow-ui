import { getAccessToken as generateNewToken } from "./token";

let cachedToken: string | null = null;
let tokenExpiry: number | null = null;

export async function getValidAccessToken(): Promise<string> {
  const now = Date.now();

  if (cachedToken && tokenExpiry && now < tokenExpiry - 5000) {
    return cachedToken;
  }

  const response = await generateNewToken();

  if (response?.accessToken && response?.expiresIn) {
    cachedToken = response.accessToken;
    tokenExpiry = response.expiresIn;
    return cachedToken!;
  }

  throw new Error("Failed to get a valid access token.");
}
