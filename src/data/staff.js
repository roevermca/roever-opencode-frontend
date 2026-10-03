export const STAFF_DEPARTMENTS = [
  "Biotechnology",
  "Botany",
  "Chemistry",
  "Commerce",
  "Computer Applications",
  "Computer Science & IT",
  "English",
  "Hotel Management",
  "Management Studies",
  "Mathematics",
  "Microbiology",
  "Nutrition and Dietetics",
  "Physical Education",
  "Physics",
  "Social Work",
  "Tamil",
  "Visual Communication",
  "Zoology",
  "Administration",
];

export const SYSTEM_USER_ROLES = [
  { value: "VP", label: "Vice Principal (VP)" },
  { value: "HOD", label: "Head of Department (HOD)" },
  { value: "STAFF", label: "Faculty / Staff" },
  { value: "ADMIN", label: "Administrator (ADMIN)" },
  { value: "STUDENT", label: "Student" },
];

export const STAFF_ROLES = ["VP", "HOD", "STAFF", "ADMIN", "STUDENT"];

export const STAFF_STATUSES = ["Active", "Inactive"];

export const initialStaff = [];

export const userProfileData = {
  id: "usr-admin-1",
  name: "Roever Administrator",
  email: "roevermca09@gmail.com",
  phone: "+91 98765 00001",
  role: "System Administrator",
  department: "Administration",
  employeeId: "EMP-ROEVER-001",
  joinedDate: "August 15, 2022",
  office: "Admin Block, Room 204",
  status: "Active",
};
