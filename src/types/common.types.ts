export type UserRole = 'teacher' | 'officer' | 'admin';

export type AttendanceStatus = 'present' | 'late' | 'leave' | 'absent';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  assignedClassId?: string;
  imageKey: string;
}

export interface StudentItem {
  id: string;
  studentCode: string;
  name: string;
  seatNumber: number;
  classId: string;
  gender: 'male' | 'female';
  guardianName: string;
  guardianPhone: string;
  imageKey: string;
  accumulatedAbsences: number;
}

export interface ClassItem {
  id: string;
  name: string;
  shortCode: string;
  gradeLevel: string;
  roomNumber: string;
  homeroomTeacherId: string;
  homeroomTeacherName: string;
  studentCount: number;
  isActive: boolean;
}

export interface StudentAttendanceRecord {
  studentId: string;
  status: AttendanceStatus;
  checkInTime: string;
  remark: string;
}

export interface AttendanceSheet {
  id: string;
  classId: string;
  date: string;
  recordedBy: string;
  recordedAt: string;
  isSubmitted: boolean;
  records: StudentAttendanceRecord[];
}

export interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  leaveDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  guardianPhone: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
}

export interface SchoolSettings {
  systemOwner: string;
  academicYear: string;
  academicTerm: string;
  lateThresholdMinutes: number;
  morningAssemblyTime: string;
  allowTeacherSelfApproval: boolean;
  notificationLineNotify: boolean;
  contactEmail: string;
  schoolBranch: string;
  autoMarkAbsentAfter: string;
}
