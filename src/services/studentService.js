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

  async deleteStudentsBulk(ids) {
    if (!ids || ids.length === 0) return { totalRequested: 0, deletedCount: 0 };
    try {
      const res = await apiClient.post("/students/bulk-delete", { ids });
      invalidateDashboardCache();
      return res;
    } catch (err) {
      // Fallback: delete individually if bulk endpoint is not reachable
      const results = await Promise.allSettled(ids.map((id) => apiClient.delete(`/students/${id}`)));
      invalidateDashboardCache();
      const succeeded = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;
      if (succeeded === 0 && failed > 0) {
        throw new Error(err.message || "Failed to delete selected students.");
      }
      return { totalRequested: ids.length, deletedCount: succeeded, failedCount: failed };
    }
  },
};


export default studentService;
