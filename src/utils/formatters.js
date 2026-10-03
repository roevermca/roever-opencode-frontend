export const formatPercentage = (val) => `${val}%`;

export const getStatusBadgeClass = (rate) => {
  if (rate >= 95) return "bg-success text-white";
  if (rate >= 85) return "bg-primary text-white";
  if (rate >= 75) return "bg-warning text-dark";
  return "bg-danger text-white";
};

export const parseYear = (val) => {
  if (!val) return undefined;
  if (typeof val === "number") return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0], 10) : undefined;
};

export const formatYear = (val) => {
  if (!val) return "";
  const num = typeof val === "number" ? val : parseYear(val);
  if (num === 1) return "1st Year";
  if (num === 2) return "2nd Year";
  if (num === 3) return "3rd Year";
  if (num === 4) return "4th Year";
  return `${num} Year`;
};

export const parsePeriod = (val) => {
  if (!val) return undefined;
  if (typeof val === "number") return val;
  const match = String(val).match(/\d+/);
  return match ? parseInt(match[0], 10) : undefined;
};

export const formatPeriod = (val) => {
  if (!val) return "";
  const num = typeof val === "number" ? val : parsePeriod(val);
  return `Period ${num}`;
};
