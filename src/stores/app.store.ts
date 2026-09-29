import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  AttendanceSheet,
  AuditLogItem,
  ClassItem,
  LeaveRequest,
  SchoolSettings,
  StudentItem,
} from '../types/common.types';
import seedSettings from '../seed/settings.json';
import seedClasses from '../seed/classes.json';
import seedStudents from '../seed/students.json';
import seedAttendance from '../seed/attendance.json';
import seedLeaves from '../seed/leaves.json';
import seedAudit from '../seed/audit.json';
import { STORAGE_KEYS } from '../constants/storage';

interface AppContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: SchoolSettings) => void;
  classes: ClassItem[];
  addClass: (newClass: Omit<ClassItem, 'id'>) => void;
  updateClass: (updated: ClassItem) => void;
  toggleClassStatus: (classId: string) => void;
  students: StudentItem[];
  attendanceSheets: AttendanceSheet[];
  saveAttendanceSheet: (sheet: AttendanceSheet) => void;
  leaves: LeaveRequest[];
  updateLeaveStatus: (leaveId: string, status: 'approved' | 'rejected') => void;
  auditLogs: AuditLogItem[];
  addAuditLog: (actor: string, action: string, target: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore error
    }
    return seedSettings as SchoolSettings;
  });

  const [classes, setClasses] = useState<ClassItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CLASSES);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore error
    }
    return seedClasses as ClassItem[];
  });

  const [students] = useState<StudentItem[]>(seedStudents as StudentItem[]);

  const [attendanceSheets, setAttendanceSheets] = useState<AttendanceSheet[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_RECORDS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore error
    }
    return seedAttendance as AttendanceSheet[];
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LEAVES);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore error
    }
    return seedLeaves as LeaveRequest[];
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      if (stored) return JSON.parse(stored);
    } catch {
      // Ignore error
    }
    return seedAudit as AuditLogItem[];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // Ignore error
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
    } catch {
      // Ignore error
    }
  }, [classes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ATTENDANCE_RECORDS, JSON.stringify(attendanceSheets));
    } catch {
      // Ignore error
    }
  }, [attendanceSheets]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
    } catch {
      // Ignore error
    }
  }, [leaves]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(auditLogs));
    } catch {
      // Ignore error
    }
  }, [auditLogs]);

  const updateSettings = (newSettings: SchoolSettings) => {
    setSettings(newSettings);
  };

  const addClass = (newClass: Omit<ClassItem, 'id'>) => {
    const id = `cls-custom-${Date.now()}`;
    setClasses((prev) => [...prev, { ...newClass, id }]);
  };

  const updateClass = (updated: ClassItem) => {
    setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const toggleClassStatus = (classId: string) => {
    setClasses((prev) =>
      prev.map((c) => (c.id === classId ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const saveAttendanceSheet = (sheet: AttendanceSheet) => {
    setAttendanceSheets((prev) => {
      const index = prev.findIndex((s) => s.classId === sheet.classId && s.date === sheet.date);
      if (index >= 0) {
        const next = [...prev];
        next[index] = sheet;
        return next;
      }
      return [sheet, ...prev];
    });
  };

  const updateLeaveStatus = (leaveId: string, status: 'approved' | 'rejected') => {
    setLeaves((prev) =>
      prev.map((item) => (item.id === leaveId ? { ...item, status } : item))
    );
  };

  const addAuditLog = (actor: string, action: string, target: string) => {
    const dateObj = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const timestamp = `${dateObj.getFullYear()}-${pad(dateObj.getMonth() + 1)}-${pad(dateObj.getDate())} ${pad(dateObj.getHours())}:${pad(dateObj.getMinutes())}:${pad(dateObj.getSeconds())}`;
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      timestamp,
      actor,
      action,
      target,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return React.createElement(
    AppContext.Provider,
    {
      value: {
        settings,
        updateSettings,
        classes,
        addClass,
        updateClass,
        toggleClassStatus,
        students,
        attendanceSheets,
        saveAttendanceSheet,
        leaves,
        updateLeaveStatus,
        auditLogs,
        addAuditLog,
      },
    },
    children
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
