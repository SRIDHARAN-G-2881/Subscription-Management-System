// API Configuration
export const API_BASE_URL = "http://localhost:5000/api/auth";

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff"
};

// App Modes
export const APP_MODES = {
  HOME: "home",
  LOGIN: "login",
  SIGNUP: "signup",
  ADMIN_DASHBOARD: "admin-dashboard",
  STAFF_DASHBOARD: "staff-dashboard"
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  ROLE: "role"
};

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 6,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
};
