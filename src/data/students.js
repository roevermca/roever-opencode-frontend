export const STUDENT_DEPARTMENTS = [
  "Tamil",
  "English",
  "Commerce",
  "Commerce CA & Commerce CS",
  "Management Studies",
  "Social Work",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Computer Applications",
  "Computer Science, Information Technology and Artificial Intelligence & Machine Learning",
  "Biotechnology",
  "Microbiology",
  "Nutrition and Dietetics",
  "Botany",
  "Zoology",
  "Physical Education",
  "Hotel Management & Catering Science",
  "Visual Communication",
  "Performing Arts",
];

export const DEPARTMENT_COURSES = {
  Tamil: [
    "B.Lit. Tamil",
    "B.A. Tamil",
    "M.A. Tamil",
  ],
  English: [
    "B.A. English",
    "M.A. English",
  ],
  Commerce: [
    "B.Com",
    "M.Com",
  ],
  "Commerce CA & Commerce CS": [
    "B.Com (CA)",
    "B.Com (CS)",
    "M.Com (CA)",
  ],
  "Management Studies": [
    "BBA",
    "MBA",
  ],
  "Social Work": [
    "BSW",
    "MSW",
  ],
  Mathematics: [
    "B.Sc Mathematics",
    "M.Sc Mathematics",
  ],
  Physics: [
    "B.Sc Physics",
    "M.Sc Physics",
  ],
  Chemistry: [
    "B.Sc Chemistry",
    "M.Sc Chemistry",
  ],
  "Computer Applications": [
    "BCA",
    "MCA",
  ],
  "Computer Science, Information Technology and Artificial Intelligence & Machine Learning": [
    "B.Sc Computer Science",
    "B.Sc Information Technology",
    "B.Sc Artificial Intelligence & Machine Learning",
    "M.Sc Computer Science",
    "M.Sc Information Technology",
  ],
  Biotechnology: [
    "B.Sc Biotechnology",
    "M.Sc Biotechnology",
  ],
  Microbiology: [
    "B.Sc Microbiology",
    "M.Sc Microbiology",
  ],
  "Nutrition and Dietetics": [
    "B.Sc Nutrition and Dietetics",
    "M.Sc Nutrition and Dietetics",
  ],
  Botany: [
    "B.Sc Botany",
    "M.Sc Botany",
  ],
  Zoology: [
    "B.Sc Zoology",
    "M.Sc Zoology",
  ],
  "Physical Education": [
    "B.Sc Physical Education",
    "M.P.Ed",
  ],
  "Hotel Management & Catering Science": [
    "B.Sc Hotel Management & Catering Science",
    "M.Sc Hotel Management & Catering Science",
  ],
  "Visual Communication": [
    "B.Sc Visual Communication",
    "M.Sc Visual Communication",
  ],
  "Performing Arts": [
    "B.A. Performing Arts",
    "M.A. Performing Arts",
  ],
};

export const STUDENT_COURSES = Array.from(
  new Set(Object.values(DEPARTMENT_COURSES).flat())
);

export const getCoursesForDepartment = (deptName) => {
  if (!deptName) return [];
  const normalized = deptName.trim().toLowerCase();
  for (const [dept, courses] of Object.entries(DEPARTMENT_COURSES)) {
    if (dept.toLowerCase() === normalized) return courses;
  }
  if (normalized.includes("commerce ca") || normalized.includes("commerce cs") || normalized.includes("ca & cs")) {
    return DEPARTMENT_COURSES["Commerce CA & Commerce CS"];
  }
  if (normalized.includes("commerce") || normalized.includes("com")) {
    return DEPARTMENT_COURSES["Commerce"];
  }
  if (normalized.includes("application")) {
    return DEPARTMENT_COURSES["Computer Applications"];
  }
  if (
    normalized.includes("computer") ||
    normalized.includes("cs") ||
    normalized.includes("information technology") ||
    normalized.includes("artificial intelligence") ||
    normalized.includes("aiml")
  ) {
    return DEPARTMENT_COURSES[
      "Computer Science, Information Technology and Artificial Intelligence & Machine Learning"
    ];
  }
  if (normalized.includes("management") || normalized.includes("bba") || normalized.includes("mba")) {
    return DEPARTMENT_COURSES["Management Studies"];
  }
  if (normalized.includes("social") || normalized.includes("msw") || normalized.includes("bsw")) {
    return DEPARTMENT_COURSES["Social Work"];
  }
  if (normalized.includes("math")) return DEPARTMENT_COURSES["Mathematics"];
  if (normalized.includes("physic")) return DEPARTMENT_COURSES["Physics"];
  if (normalized.includes("chem")) return DEPARTMENT_COURSES["Chemistry"];
  if (normalized.includes("biotech")) return DEPARTMENT_COURSES["Biotechnology"];
  if (normalized.includes("botan")) return DEPARTMENT_COURSES["Botany"];
  if (normalized.includes("zool")) return DEPARTMENT_COURSES["Zoology"];
  if (normalized.includes("microbio")) return DEPARTMENT_COURSES["Microbiology"];
  if (normalized.includes("nutrition") || normalized.includes("diet")) {
    return DEPARTMENT_COURSES["Nutrition and Dietetics"];
  }
  if (normalized.includes("tamil")) return DEPARTMENT_COURSES["Tamil"];
  if (normalized.includes("english")) return DEPARTMENT_COURSES["English"];
  if (normalized.includes("vis") || normalized.includes("communication")) {
    return DEPARTMENT_COURSES["Visual Communication"];
  }
  if (normalized.includes("hotel") || normalized.includes("catering") || normalized.includes("hmcs")) {
    return DEPARTMENT_COURSES["Hotel Management & Catering Science"];
  }
  if (normalized.includes("physical") || normalized.includes("ped")) {
    return DEPARTMENT_COURSES["Physical Education"];
  }
  if (normalized.includes("performing") || normalized.includes("pa")) {
    return DEPARTMENT_COURSES["Performing Arts"];
  }
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
export const UG_YEARS = [1, 2, 3];
export const PG_YEARS = [1, 2];

export const UG_YEAR_LABELS = ["1st Year", "2nd Year", "3rd Year"];
export const PG_YEAR_LABELS = ["1st Year", "2nd Year"];

export const isPgCourse = (courseName) => {
  if (!courseName) return false;
  const name = courseName.trim().toUpperCase();
  return (
    name.startsWith("M.") ||
    name.startsWith("M.SC") ||
    name.startsWith("M.COM") ||
    name.startsWith("M.A.") ||
    name === "MCA" ||
    name === "MBA" ||
    name === "MSW" ||
    name === "MPED" ||
    name === "M.P.ED" ||
    name.includes("MASTER") ||
    name.includes("POST GRADUATE") ||
    name.includes("(PG)")
  );
};

export const getCourseLevel = (courseName) => {
  return isPgCourse(courseName) ? "PG" : "UG";
};

export const getYearsForLevel = (level) => {
  return level === "PG" ? PG_YEARS : UG_YEARS;
};

export const getYearLabelsForLevel = (level) => {
  return level === "PG" ? PG_YEAR_LABELS : UG_YEAR_LABELS;
};

export const STUDENT_SECTIONS = ["A", "B", "C"];
export const STUDENT_STATUSES = ["Active", "Inactive"];

export const initialStudents = [];
