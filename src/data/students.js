export const STUDENT_DEPARTMENTS = [
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
];

export const STUDENT_COURSES = [
  // Computer Applications
  "BCA",
  "MCA",
  // Computer Science & IT
  "B.Sc Computer Science",
  "B.Sc Information Technology",
  "M.Sc Computer Science",
  // Commerce
  "B.Com",
  "B.Com (CA)",
  "B.Com (CS)",
  "M.Com",
  // Management Studies
  "BBA",
  "MBA",
  // Mathematics
  "B.Sc Mathematics",
  "M.Sc Mathematics",
  // Physics
  "B.Sc Physics",
  "M.Sc Physics",
  // Chemistry
  "B.Sc Chemistry",
  "M.Sc Chemistry",
  // Biotechnology
  "B.Sc Biotechnology",
  "M.Sc Biotechnology",
  // Botany
  "B.Sc Botany",
  "M.Sc Botany",
  // Zoology
  "B.Sc Zoology",
  "M.Sc Zoology",
  // Microbiology
  "B.Sc Microbiology",
  "M.Sc Microbiology",
  // Nutrition & Dietetics
  "B.Sc Nutrition & Dietetics",
  // Languages & Humanities
  "B.Lit. Tamil",
  "M.A. Tamil",
  "B.A. English",
  "M.A. English",
  // Social Work
  "BSW",
  "MSW",
  // Visual & Professional
  "B.Sc Visual Communication",
  "B.Sc Hotel Management & Catering Science",
  "B.Sc Physical Education",
];

export const DEPARTMENT_COURSES = {
  Biotechnology: ["B.Sc Biotechnology", "M.Sc Biotechnology"],
  Botany: ["B.Sc Botany", "M.Sc Botany"],
  Chemistry: ["B.Sc Chemistry", "M.Sc Chemistry"],
  Commerce: ["B.Com", "B.Com (CA)", "B.Com (CS)", "M.Com"],
  "Computer Applications": ["BCA", "MCA"],
  "Computer Science & IT": [
    "B.Sc Computer Science",
    "B.Sc Information Technology",
    "M.Sc Computer Science",
  ],
  English: ["B.A. English", "M.A. English"],
  "Hotel Management": ["B.Sc Hotel Management & Catering Science"],
  "Management Studies": ["BBA", "MBA"],
  Mathematics: ["B.Sc Mathematics", "M.Sc Mathematics"],
  Microbiology: ["B.Sc Microbiology", "M.Sc Microbiology"],
  "Nutrition and Dietetics": ["B.Sc Nutrition & Dietetics"],
  "Physical Education": ["B.Sc Physical Education"],
  Physics: ["B.Sc Physics", "M.Sc Physics"],
  "Social Work": ["BSW", "MSW"],
  Tamil: ["B.Lit. Tamil", "M.A. Tamil"],
  "Visual Communication": ["B.Sc Visual Communication"],
  Zoology: ["B.Sc Zoology", "M.Sc Zoology"],
};

export const getCoursesForDepartment = (deptName) => {
  if (!deptName) return [];
  const normalized = deptName.trim().toLowerCase();
  for (const [dept, courses] of Object.entries(DEPARTMENT_COURSES)) {
    if (dept.toLowerCase() === normalized) return courses;
  }
  if (normalized.includes("application")) return DEPARTMENT_COURSES["Computer Applications"];
  if (normalized.includes("computer") || normalized.includes("cs")) return DEPARTMENT_COURSES["Computer Science & IT"];
  if (normalized.includes("commerce") || normalized.includes("com")) return DEPARTMENT_COURSES["Commerce"];
  if (normalized.includes("management") || normalized.includes("bba") || normalized.includes("mba")) return DEPARTMENT_COURSES["Management Studies"];
  if (normalized.includes("math")) return DEPARTMENT_COURSES["Mathematics"];
  if (normalized.includes("physic")) return DEPARTMENT_COURSES["Physics"];
  if (normalized.includes("chem")) return DEPARTMENT_COURSES["Chemistry"];
  if (normalized.includes("biotech")) return DEPARTMENT_COURSES["Biotechnology"];
  if (normalized.includes("botan")) return DEPARTMENT_COURSES["Botany"];
  if (normalized.includes("zool")) return DEPARTMENT_COURSES["Zoology"];
  if (normalized.includes("microbio")) return DEPARTMENT_COURSES["Microbiology"];
  if (normalized.includes("nutrition") || normalized.includes("diet")) return DEPARTMENT_COURSES["Nutrition and Dietetics"];
  if (normalized.includes("tamil")) return DEPARTMENT_COURSES["Tamil"];
  if (normalized.includes("english")) return DEPARTMENT_COURSES["English"];
  if (normalized.includes("social")) return DEPARTMENT_COURSES["Social Work"];
  if (normalized.includes("vis") || normalized.includes("communication")) return DEPARTMENT_COURSES["Visual Communication"];
  if (normalized.includes("hotel")) return DEPARTMENT_COURSES["Hotel Management"];
  if (normalized.includes("physical") || normalized.includes("ped")) return DEPARTMENT_COURSES["Physical Education"];
  return [];
};

export const getDepartmentForCourse = (courseName) => {
  if (!courseName) return "";
  const normalized = courseName.trim().toLowerCase();
  for (const [dept, courses] of Object.entries(DEPARTMENT_COURSES)) {
    if (courses.some((c) => c.toLowerCase() === normalized)) {
      return dept;
    }
  }
  return "";
};

export const STUDENT_LEVELS = ["UG", "PG"];

export const STUDENT_YEARS = [1, 2, 3];
export const STUDENT_SECTIONS = ["A", "B", "C"];
export const STUDENT_STATUSES = ["Active", "Inactive"];

export const initialStudents = [];
