import apiClient from "./apiClient";

let departmentsCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const departmentService = {
  async getDepartments(active, forceRefresh = false) {
    const now = Date.now();
    if (!forceRefresh && active === undefined && departmentsCache && now < cacheExpiry) {
      return departmentsCache;
    }
    const data = await apiClient.get("/departments", { active });
    if (active === undefined && Array.isArray(data)) {
      departmentsCache = data;
      cacheExpiry = now + CACHE_TTL_MS;
    }
    return data;
  },

  clearCache() {
    departmentsCache = null;
    cacheExpiry = 0;
  },

  getDepartmentById(id) {
    return apiClient.get(`/departments/${id}`);
  },

  async createDepartment(data) {
    const res = await apiClient.post("/departments", data);
    departmentService.clearCache();
    return res;
  },

  async updateDepartment(id, data) {
    const res = await apiClient.put(`/departments/${id}`, data);
    departmentService.clearCache();
    return res;
  },

  async deleteDepartment(id) {
    const res = await apiClient.delete(`/departments/${id}`);
    departmentService.clearCache();
    return res;
  },
};

export default departmentService;

