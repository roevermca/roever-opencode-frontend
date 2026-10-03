import { API_BASE_URL } from "../config/api";
import { auth, isFirebaseConfigured } from "../config/firebase";

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Retrieves the Firebase ID token for the current authenticated user,
 * or fallback token in local mock environment.
 */
export async function getAuthToken() {
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }

  const savedUser = localStorage.getItem("ams_mock_auth_user");
  if (savedUser) {
    try {
      const parsed = JSON.parse(savedUser);
      return parsed.email || parsed.token || parsed.uid || "admin@amsportal.edu";
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Performs an HTTP request with centralized baseURL, JSON headers,
 * automatic Bearer token injection, and structured error handling.
 */
async function request(endpoint, options = {}) {
  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const token = await getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError) {
    throw new ApiError(
      0,
      `Cannot connect to backend server at ${API_BASE_URL}. Ensure Spring Boot is running.`,
      networkError
    );
  }

  // 204 No Content
  if (response.status === 204) {
    return null;
  }

  let data = null;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    try {
      data = await response.json();
    } catch {
      data = null;
    }
  } else {
    try {
      const text = await response.text();
      data = text ? { message: text } : null;
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    let errorMessage = data?.message || data?.error;

    if (!errorMessage) {
      if (response.status === 401) {
        errorMessage = "Authentication required. Please sign in again.";
      } else if (response.status === 403) {
        errorMessage = "Access denied: You do not have permission for this resource.";
      } else if (response.status === 404) {
        errorMessage = "Requested resource was not found.";
      } else if (response.status === 409) {
        errorMessage = "Conflict: Resource already exists or attendance is locked.";
      } else {
        errorMessage = `Request failed with status ${response.status}`;
      }
    }

    throw new ApiError(response.status, errorMessage, data);
  }

  return data;
}

function buildQueryString(params = {}) {
  const entries = Object.entries(params).filter(
    ([_, val]) => val !== undefined && val !== null && val !== ""
  );
  if (entries.length === 0) return "";
  const query = new URLSearchParams();
  for (const [k, v] of entries) {
    query.append(k, v);
  }
  return `?${query.toString()}`;
}

export const apiClient = {
  get(endpoint, params) {
    const qs = buildQueryString(params);
    return request(`${endpoint}${qs}`, { method: "GET" });
  },

  post(endpoint, body) {
    return request(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put(endpoint, body) {
    return request(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(endpoint) {
    return request(endpoint, { method: "DELETE" });
  },
};

export default apiClient;
