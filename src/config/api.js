const isLocalhost =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1");

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL &&
  !import.meta.env.VITE_API_BASE_URL.includes("localhost")
    ? import.meta.env.VITE_API_BASE_URL
    : isLocalhost
    ? "http://localhost:8080/api"
    : "https://roever-opencode-backend.onrender.com/api";

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
