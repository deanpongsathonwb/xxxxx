import React, { useState, useMemo } from 'react';
import {
  CheckCircle2,
  Clock,
  UserX,
  FileText,
  Save,
  Send,
  AlertCircle,
  Search,
} from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import { getStudentImageUrl } from '../utils/images';
import type { AttendanceStatus, StudentAttendanceRecord } from '../types/common.types';

export const TeacherAttendancePage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classes, students, attendanceSheets, saveAttendanceSheet, addAuditLog } = useApp();

  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const teacherClassId = currentUser?.assignedClassId || 'cls-m1-1';
  const assignedClass = classes.find((c) => c.id === teacherClassId);

  const classStudents = useMemo(() => {
    return students.filter((s) => s.classId === teacherClassId);
  }, [students, teacherClassId]);

  const existingSheet = useMemo(() => {
    return attendanceSheets.find(
      (s) => s.classId === teacherClassId && s.date === todayStr
    );
  }, [attendanceSheets, teacherClassId, todayStr]);

  const [records, setRecords] = useState<StudentAttendanceRecord[]>(() => {
    if (existingSheet && existingSheet.records.length > 0) {
      return existingSheet.records;
    }
    return classStudents.map((s) => ({
      studentId: s.id,
      status: 'present' as AttendanceStatus,
      checkInTime: '07:45',
      remark: '',
    }));
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const filteredStudents = useMemo(() => {
    return classStudents.filter((s) => {
      const q = searchQuery.trim().toLowerCase();
      if (!q) return true;
      return s.name.toLowerCase().includes(q) || s.studentCode.includes(q);
    });
  }, [classStudents, searchQuery]);

  const counts = useMemo(() => {
    let present = 0;
    let late = 0;
    let leave = 0;
    let absent = 0;
    records.forEach((r) => {
      if (r.status === 'present') present++;
      else if (r.status === 'late') late++;
      else if (r.status === 'leave') leave++;
      else if (r.status === 'absent') absent++;
    });
    return { present, late, leave, absent, total: records.length };
  }, [records]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRecords((prev) =>
      prev.map((r) => {
        if (r.studentId === studentId) {
          const currentTime = new Date().toTimeString().slice(0, 5);
          return {
            ...r,
            status,
            checkInTime:
              status === 'absent' || status === 'leave'
                ? uiData.common.dash
                : r.checkInTime === uiData.common.dash
                ? currentTime
                : r.checkInTime,
          };
        }
        return r;
      })
    );
  };

  const handleRemarkChange = (studentId: string, remark: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.studentId === studentId ? { ...r, remark } : r))
    );
  };

  const handleMarkAllPresent = () => {
    setRecords((prev) =>
      prev.map((r) => ({
        ...r,
        status: 'present',
        checkInTime: '07:45',
      }))
    );
  };

  const handleSaveDraft = () => {
    const sheet = {
      id: existingSheet?.id || `att-${todayStr}-${teacherClassId}`,
      classId: teacherClassId,
      date: todayStr,
      recordedBy: currentUser?.name || '',
      recordedAt: new Date().toTimeString().slice(0, 5),
      isSubmitted: false,
      records,
    };
    saveAttendanceSheet(sheet);
    if (currentUser && assignedClass) {
      addAuditLog(currentUser.name, uiData.audit.actions.saveDraft, assignedClass.name);
    }
    setSuccessNotice(uiData.feedback.attendanceDraftSaved);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleConfirmSubmit = () => {
    const sheet = {
      id: existingSheet?.id || `att-${todayStr}-${teacherClassId}`,
      classId: teacherClassId,
      date: todayStr,
      recordedBy: currentUser?.name || '',
      recordedAt: new Date().toTimeString().slice(0, 5),
      isSubmitted: true,
      records,
    };
    saveAttendanceSheet(sheet);
    if (currentUser && assignedClass) {
      addAuditLog(currentUser.name, uiData.audit.actions.recordAttendance, assignedClass.name);
    }
    setShowConfirmModal(false);
    setSuccessNotice(uiData.feedback.attendanceSavedSuccess);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.navigation.teacherAttendance}
          </h2>
          <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600">
            <span>
              {uiData.common.classLabel} {assignedClass?.name}
            </span>
            <span>{uiData.common.bullet}</span>
            <span>
              {uiData.common.homeroomTeacherLabel} {assignedClass?.homeroomTeacherName}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleMarkAllPresent}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{uiData.attendanceActions.markAllPresent}</span>
          </button>

          <button
            type="button"
            onClick={handleSaveDraft}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4 text-slate-600" />
            <span>{uiData.attendanceActions.saveDraft}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Send className="w-4 h-4" />
            <span>{uiData.attendanceActions.submitAttendance}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">{uiData.metrics.totalStudents}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {counts.total} <span className="text-xs font-normal text-slate-500">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <FileText className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-medium">{uiData.attendanceStatus.present}</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {counts.present} <span className="text-xs font-normal text-emerald-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-medium">{uiData.attendanceStatus.late}</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {counts.late} <span className="text-xs font-normal text-amber-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-medium">{uiData.attendanceStatus.leave}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {counts.leave} <span className="text-xs font-normal text-blue-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-700 font-medium">{uiData.attendanceStatus.absent}</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {counts.absent} <span className="text-xs font-normal text-rose-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={uiData.attendanceActions.searchStudentPlaceholder}
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>{uiData.metrics.totalStudents}: {filteredStudents.length} {uiData.units.person}</span>
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4 w-12 text-center">{uiData.tableHeaders.seatNumber}</th>
              <th className="py-3 px-4 w-20 text-center">{uiData.tableHeaders.studentPhoto}</th>
              <th className="py-3 px-4 w-28">{uiData.tableHeaders.studentId}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.studentName}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.status}</th>
              <th className="py-3 px-4 w-24 text-center">{uiData.tableHeaders.checkInTime}</th>
              <th className="py-3 px-4 w-64">{uiData.tableHeaders.remark}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredStudents.map((student) => {
              const record = records.find((r) => r.studentId === student.id) || {
                studentId: student.id,
                status: 'present' as AttendanceStatus,
                checkInTime: '07:45',
                remark: '',
              };
              const photo = getStudentImageUrl(student.imageKey);

              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {student.seatNumber}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <img
                      src={photo}
                      alt={student.name}
                      className="w-9 h-9 rounded-full object-cover mx-auto border border-slate-200"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    {student.studentCode}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50 space-x-1">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'present')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                          record.status === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {uiData.attendanceStatus.present}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'late')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                          record.status === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {uiData.attendanceStatus.late}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'leave')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                          record.status === 'leave'
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {uiData.attendanceStatus.leave}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleStatusChange(student.id, 'absent')}
                        className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-all ${
                          record.status === 'absent'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {uiData.attendanceStatus.absent}
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-mono text-xs text-slate-700">
                    {record.checkInTime}
                  </td>
                  <td className="py-3 px-4">
                    <input
                      type="text"
                      value={record.remark}
                      onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                      placeholder={uiData.attendanceActions.remarkPlaceholder}
                      className="w-full px-2.5 py-1 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 text-slate-800"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              {uiData.dialog.confirmTitle}
            </h3>
            <p className="text-sm text-slate-600 mb-6">
              {uiData.dialog.confirmSubmitAttendance}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
              >
                {uiData.dialog.cancel}
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                {uiData.dialog.confirmSave}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
