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
  const savedUserStr =
    localStorage.getItem("ams_auth_user") ||
    localStorage.getItem("ams_mock_auth_user");
  if (savedUserStr) {
    try {
      const parsed = JSON.parse(savedUserStr);
      if (parsed.email && parsed.email.includes("@")) {
        return parsed.email.toLowerCase().trim();
      }
      if (parsed.token) return parsed.token;
    } catch {
      // ignore
    }
  }

  if (isFirebaseConfigured && auth?.currentUser?.email) {
    return auth.currentUser.email.toLowerCase().trim();
  }

  return "roevermca09@gmail.com";
}

/**
 * Performs an HTTP request with centralized baseURL, JSON headers,
 * automatic Bearer token injection, timeout handling, and structured error handling.
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

  const controller = new AbortController();
  const timeoutMs = options.timeoutMs || 15000;
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers,
      signal: options.signal || controller.signal,
    });
  } catch (networkError) {
    clearTimeout(timeoutId);
    if (url.includes("localhost:8080") || url.includes("127.0.0.1:8080")) {
      const fallbackUrl = url.replace(/http:\/\/(localhost|127\.0\.0\.1):8080\/api/, "https://roever-opencode-backend-g3wy.onrender.com/api");
      try {
        response = await fetch(fallbackUrl, {
          ...options,
          headers,
        });
      } catch (fallbackError) {
        throw new ApiError(
          0,
          `Cannot connect to backend server at ${API_BASE_URL}. Ensure Spring Boot is running.`,
          networkError
        );
      }
    } else {
      throw new ApiError(
        0,
        `Cannot connect to backend server at ${API_BASE_URL}. Ensure Spring Boot is running.`,
        networkError
      );
    }
  } finally {
    clearTimeout(timeoutId);
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

// Lightweight in-memory cache and in-flight deduplication
const metadataCache = new Map();
const inFlightRequests = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const CACHEABLE_ENDPOINTS = [
  "/departments",
  "/courses",
  "/health",
];

function isCacheable(endpoint) {
  return CACHEABLE_ENDPOINTS.some((prefix) => endpoint.startsWith(prefix));
}

function invalidateMetadataCache() {
  metadataCache.clear();
}

export const apiClient = {
  get(endpoint, params) {
    const qs = buildQueryString(params);
    const fullEndpoint = `${endpoint}${qs}`;

    // Check metadata cache for static endpoints
    if (isCacheable(endpoint)) {
      const cached = metadataCache.get(fullEndpoint);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
        return Promise.resolve(cached.data);
      }
    }

    // In-flight request deduplication
    if (inFlightRequests.has(fullEndpoint)) {
      return inFlightRequests.get(fullEndpoint);
    }

    const reqPromise = request(fullEndpoint, { method: "GET" })
      .then((data) => {
        if (isCacheable(endpoint)) {
          metadataCache.set(fullEndpoint, { data, timestamp: Date.now() });
        }
        return data;
      })
      .finally(() => {
        inFlightRequests.delete(fullEndpoint);
      });

    inFlightRequests.set(fullEndpoint, reqPromise);
    return reqPromise;
  },

  post(endpoint, body) {
    invalidateMetadataCache();
    return request(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put(endpoint, body) {
    invalidateMetadataCache();
    return request(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete(endpoint) {
    invalidateMetadataCache();
    return request(endpoint, { method: "DELETE" });
  },

  clearCache() {
    metadataCache.clear();
  },
};

export default apiClient;
