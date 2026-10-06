import apiClient from "./apiClient";

export const systemService = {
  getStorageStatus() {
    return apiClient.get("/system/storage-status");
  },

  triggerCleanup(data = {}) {
    return apiClient.post("/system/cleanup", data);
  },
};

export default systemService;
