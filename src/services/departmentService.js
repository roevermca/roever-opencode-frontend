import apiClient from "./apiClient";

export const departmentService = {
  getDepartments(active) {
    return apiClient.get("/departments", { active });
  },

  getDepartmentById(id) {
    return apiClient.get(`/departments/${id}`);
  },

  createDepartment(data) {
    return apiClient.post("/departments", data);
  },

  updateDepartment(id, data) {
    return apiClient.put(`/departments/${id}`, data);
  },

  deleteDepartment(id) {
    return apiClient.delete(`/departments/${id}`);
  },
};

export default departmentService;
