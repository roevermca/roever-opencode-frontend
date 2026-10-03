import apiClient from "./apiClient";

export const attendanceService = {
  markAttendanceBulk(data) {
    return apiClient.post("/attendance/bulk", data);
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

  updateAttendance(id, data) {
    return apiClient.put(`/attendance/${id}`, data);
  },
};

export default attendanceService;
