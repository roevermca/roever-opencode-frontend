import apiClient from "./apiClient";

function invalidateDashboardCache() {
  try {
    sessionStorage.removeItem("ams_dashboard_cache_v1");
  } catch {
    // ignore
  }
}

export const studentService = {
  getStudents(params = {}) {
    return apiClient.get("/students", params);
  },

  getStudentById(id) {
    return apiClient.get(`/students/${id}`);
  },

  async createStudent(data) {
    const res = await apiClient.post("/students", data);
    invalidateDashboardCache();
    return res;
  },

  async createStudentsBulk(data) {
    const res = await apiClient.post("/students/bulk", data);
    invalidateDashboardCache();
    return res;
  },

  async updateStudent(id, data) {
    const res = await apiClient.put(`/students/${id}`, data);
    invalidateDashboardCache();
    return res;
  },

  async deleteStudent(id) {
    const res = await apiClient.delete(`/students/${id}`);
    invalidateDashboardCache();
    return res;
  },
};


export default studentService;
