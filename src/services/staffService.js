import apiClient from "./apiClient";

export const staffService = {
  getStaff(params = {}) {
    return apiClient.get("/users", params);
  },

  getStaffById(id) {
    return apiClient.get(`/users/${id}`);
  },

  createStaff(data) {
    return apiClient.post("/users", data);
  },

  updateStaff(id, data) {
    return apiClient.put(`/users/${id}`, data);
  },

  deleteStaff(id) {
    return apiClient.delete(`/users/${id}`);
  },
};

export default staffService;
