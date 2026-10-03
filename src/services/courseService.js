import apiClient from "./apiClient";

export const courseService = {
  getCourses(params = {}) {
    return apiClient.get("/courses", params);
  },

  getCourseById(id) {
    return apiClient.get(`/courses/${id}`);
  },

  createCourse(data) {
    return apiClient.post("/courses", data);
  },

  updateCourse(id, data) {
    return apiClient.put(`/courses/${id}`, data);
  },

  deleteCourse(id) {
    return apiClient.delete(`/courses/${id}`);
  },
};

export default courseService;
