export const APP_ROUTES = {
  PUBLIC: {
    LOGIN: '/login',
  },
  TEACHER: {
    ATTENDANCE: '/teacher/attendance',
    HISTORY: '/teacher/history',
    STUDENTS: '/teacher/students',
  },
  OFFICER: {
    OVERVIEW: '/officer/overview',
    TRUANCY: '/officer/truancy',
    REPORTS: '/officer/reports',
  },
  ADMIN: {
    SETTINGS: '/admin/settings',
    CLASSES: '/admin/classes',
    AUDIT: '/admin/audit',
  },
} as const;
