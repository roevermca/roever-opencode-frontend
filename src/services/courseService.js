import apiClient from "./apiClient";

let coursesCache = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export const courseService = {
  async getCourses(params = {}, forceRefresh = false) {
    const isUnfiltered = Object.keys(params).length === 0;
    const now = Date.now();
    if (!forceRefresh && isUnfiltered && coursesCache && now < cacheExpiry) {
      return coursesCache;
    }
    const data = await apiClient.get("/courses", params);
    if (isUnfiltered && Array.isArray(data)) {
      coursesCache = data;
      cacheExpiry = now + CACHE_TTL_MS;
    }
    return data;
  },

  clearCache() {
    coursesCache = null;
    cacheExpiry = 0;
  },

  getCourseById(id) {
    return apiClient.get(`/courses/${id}`);
  },

  async createCourse(data) {
    const res = await apiClient.post("/courses", data);
    courseService.clearCache();
    return res;
  },

  async updateCourse(id, data) {
    const res = await apiClient.put(`/courses/${id}`, data);
    courseService.clearCache();
    return res;
  },

  async deleteCourse(id) {
    const res = await apiClient.delete(`/courses/${id}`);
    courseService.clearCache();
    return res;
  },
};

export default courseService;

