export const RENDER_BACKEND_URL = "https://roever-opencode-backend-g3wy.onrender.com/api";

const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

const getCustomApiUrl = () => {
  if (typeof window !== "undefined") {
    const custom = localStorage.getItem("roever_api_url");
    if (custom && custom.trim()) {
      return custom.trim().replace(/\/+$/, "");
    }
  }
  return null;
};

export const API_BASE_URL =
  getCustomApiUrl() ||
  (import.meta.env.VITE_API_BASE_URL &&
  !import.meta.env.VITE_API_BASE_URL.includes("localhost")
    ? import.meta.env.VITE_API_BASE_URL
    : RENDER_BACKEND_URL);

export const API_ENDPOINTS = {
  HEALTH: `${API_BASE_URL}/health`,
  STUDENTS: `${API_BASE_URL}/students`,
  USERS: `${API_BASE_URL}/users`,
  USERS_ME: `${API_BASE_URL}/users/me`,
  DEPARTMENTS: `${API_BASE_URL}/departments`,
  COURSES: `${API_BASE_URL}/courses`,
  ATTENDANCE: `${API_BASE_URL}/attendance`,
  ATTENDANCE_BULK: `${API_BASE_URL}/attendance/bulk`,
  REPORTS: `${API_BASE_URL}/reports`,
};
