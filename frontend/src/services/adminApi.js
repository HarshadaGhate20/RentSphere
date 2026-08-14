import { API_BASE_URLS } from "../config/api";
import { apiRequest } from "./apiClient";

export const getAllUsers = async () =>
  apiRequest(`${API_BASE_URLS.auth}/auth/admin/users`);

export const getCurrentUser = async () =>
  apiRequest(`${API_BASE_URLS.auth}/auth/me`);
