import apiClient from "./apiClient";

function invalidateDashboardCache() {
  try {
    sessionStorage.removeItem("ams_dashboard_cache_v1");
  } catch {
    // ignore
  }
}

export const attendanceService = {
  async markAttendanceBulk(data) {
    const res = await apiClient.post("/attendance/bulk", data);
    invalidateDashboardCache();
    return res;
  },

  getAttendance(params = {}) {
    return apiClient.get("/attendance", params);
  },

  getStudentAttendance(studentId, params = {}) {
    return apiClient.get(`/attendance/student/${studentId}`, params);
  },

  getStudentSummary(studentId) {
    return apiClient.get(`/attendance/student/${studentId}/summary`);
  },

  async updateAttendance(id, data) {
    const res = await apiClient.put(`/attendance/${id}`, data);
    invalidateDashboardCache();
    return res;
  },
};


export default attendanceService;
