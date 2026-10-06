export const ATTENDANCE_PERIODS = [
  "Full Day",
  "Period 1",
  "Period 2",
  "Period 3",
  "Period 4",
  "Period 5",
];


// Helper to get today's date formatted as YYYY-MM-DD
export const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// In-memory initial attendance history store
export const initialAttendanceHistory = [];

// Global in-memory submitted attendance sessions map
// Key: `${date}_${department}_${course}_${year}_${section}_${period}`
export const attendanceSessionStore = new Map();

