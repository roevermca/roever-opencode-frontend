import apiClient from "./apiClient";

export const reportService = {
  getOverallReport(params = {}) {
    return apiClient.get("/reports/overall", params);
  },

  getStudentReports(params = {}) {
    return apiClient.get("/reports/students", params);
  },

  getDepartmentReports(params = {}) {
    return apiClient.get("/reports/departments", params);
  },

  getLowAttendanceReports(params = {}) {
    return apiClient.get("/reports/low-attendance", params);
  },
};

export default reportService;
