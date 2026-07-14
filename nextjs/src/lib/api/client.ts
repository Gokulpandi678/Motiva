import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/lib/auth/tokenStorage';

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

// Frontend and API are now one Next.js app on one origin, so this is always
// a relative path — no separate VITE_API_BASE_URL/port to configure anymore.
const API_BASE_URL = '/api/v1';

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

httpClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

/** Concurrent 401s share one in-flight refresh instead of each firing their own. */
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await axios.post<{ data: { accessToken: string; refreshToken: string } }>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken },
  );
  const tokens = response.data.data;
  tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  return tokens.accessToken;
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string; details?: unknown }>) => {
    const statusCode = error.response?.status ?? 0;
    const originalRequest = error.config as RetryableConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (statusCode === 401 && originalRequest && !originalRequest._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return httpClient.request(originalRequest);
      } catch {
        tokenStorage.clear();
        window.location.href = '/login';
        return Promise.reject(new ApiError('Session expired', 401));
      }
    }

    const message =
      error.response?.data?.message ??
      (statusCode === 0 ? 'Could not reach the server' : `Request failed (${statusCode})`);
    return Promise.reject(new ApiError(message, statusCode, error.response?.data?.details));
  },
);
