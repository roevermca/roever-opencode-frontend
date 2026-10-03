import apiClient from "./apiClient";

export const studentService = {
  getStudents(params = {}) {
    return apiClient.get("/students", params);
  },

  getStudentById(id) {
    return apiClient.get(`/students/${id}`);
  },

  createStudent(data) {
    return apiClient.post("/students", data);
  },

  createStudentsBulk(data) {
    return apiClient.post("/students/bulk", data);
  },

  updateStudent(id, data) {
    return apiClient.put(`/students/${id}`, data);
  },

  deleteStudent(id) {
    return apiClient.delete(`/students/${id}`);
  },
};

export default studentService;
