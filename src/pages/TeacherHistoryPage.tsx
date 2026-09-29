import React, { useState, useMemo } from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, UserX, Eye } from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import { getStudentImageUrl } from '../utils/images';

export const TeacherHistoryPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classes, students, attendanceSheets } = useApp();

  const teacherClassId = currentUser?.assignedClassId || 'cls-m1-1';
  const assignedClass = classes.find((c) => c.id === teacherClassId);

  const classSheets = useMemo(() => {
    return attendanceSheets.filter((s) => s.classId === teacherClassId);
  }, [attendanceSheets, teacherClassId]);

  const [selectedSheetId, setSelectedSheetId] = useState<string>(() => {
    return classSheets[0]?.id || '';
  });

  const selectedSheet = useMemo(() => {
    return classSheets.find((s) => s.id === selectedSheetId) || classSheets[0];
  }, [classSheets, selectedSheetId]);

  const summary = useMemo(() => {
    if (!selectedSheet) return { present: 0, late: 0, leave: 0, absent: 0, rate: 0 };
    let present = 0;
    let late = 0;
    let leave = 0;
    let absent = 0;

    selectedSheet.records.forEach((r) => {
      if (r.status === 'present') present++;
      else if (r.status === 'late') late++;
      else if (r.status === 'leave') leave++;
      else if (r.status === 'absent') absent++;
    });

    const total = selectedSheet.records.length || 1;
    const rate = Math.round(((present + late) / total) * 100);
    return { present, late, leave, absent, rate };
  }, [selectedSheet]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.navigation.teacherHistory}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {uiData.common.classLabel} {assignedClass?.name}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-indigo-600" />
          <select
            value={selectedSheet?.id || ''}
            onChange={(e) => setSelectedSheetId(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {classSheets.map((sheet) => (
              <option key={sheet.id} value={sheet.id}>
                {sheet.date}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedSheet ? (
        <>
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-xs text-slate-500 font-medium">
                {uiData.tableHeaders.attendanceRate}
              </span>
              <p className="text-2xl font-bold text-indigo-600 mt-1">
                {summary.rate}
                <span className="text-sm font-normal text-slate-500 ml-1">
                  {uiData.units.percent}
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm">
              <span className="text-xs text-emerald-700 font-medium">
                {uiData.attendanceStatus.present}
              </span>
              <p className="text-2xl font-bold text-emerald-600 mt-1">
                {summary.present}
                <span className="text-xs font-normal text-emerald-700 ml-1">
                  {uiData.units.person}
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm">
              <span className="text-xs text-amber-700 font-medium">
                {uiData.attendanceStatus.late}
              </span>
              <p className="text-2xl font-bold text-amber-600 mt-1">
                {summary.late}
                <span className="text-xs font-normal text-amber-700 ml-1">
                  {uiData.units.person}
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
              <span className="text-xs text-blue-700 font-medium">
                {uiData.attendanceStatus.leave}
              </span>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {summary.leave}
                <span className="text-xs font-normal text-blue-700 ml-1">
                  {uiData.units.person}
                </span>
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm">
              <span className="text-xs text-rose-700 font-medium">
                {uiData.attendanceStatus.absent}
              </span>
              <p className="text-2xl font-bold text-rose-600 mt-1">
                {summary.absent}
                <span className="text-xs font-normal text-rose-700 ml-1">
                  {uiData.units.person}
                </span>
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center space-x-3">
                <Eye className="w-4 h-4 text-slate-600" />
                <span className="text-sm font-bold text-slate-800">
                  {uiData.common.dateLabel} {selectedSheet.date}
                </span>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                    selectedSheet.isSubmitted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedSheet.isSubmitted
                    ? uiData.badges.submitted
                    : uiData.badges.draft}
                </span>
              </div>

              <div className="text-xs text-slate-500">
                <span>
                  {uiData.tableHeaders.recordedBy}: {selectedSheet.recordedBy} ({selectedSheet.recordedAt})
                </span>
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
                  <th className="py-3 px-4 w-28 text-center">{uiData.tableHeaders.checkInTime}</th>
                  <th className="py-3 px-4">{uiData.tableHeaders.remark}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {selectedSheet.records.map((r) => {
                  const student = students.find((s) => s.id === r.studentId);
                  if (!student) return null;
                  const photo = getStudentImageUrl(student.imageKey);

                  let statusBadgeClass = 'bg-emerald-100 text-emerald-800';
                  let statusText = uiData.attendanceStatus.present;
                  let StatusIcon = CheckCircle2;

                  if (r.status === 'late') {
                    statusBadgeClass = 'bg-amber-100 text-amber-800';
                    statusText = uiData.attendanceStatus.late;
                    StatusIcon = Clock;
                  } else if (r.status === 'leave') {
                    statusBadgeClass = 'bg-blue-100 text-blue-800';
                    statusText = uiData.attendanceStatus.leave;
                    StatusIcon = AlertCircle;
                  } else if (r.status === 'absent') {
                    statusBadgeClass = 'bg-rose-100 text-rose-800';
                    statusText = uiData.attendanceStatus.absent;
                    StatusIcon = UserX;
                  }

                  return (
                    <tr key={r.studentId} className="hover:bg-slate-50/80 transition-colors">
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
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-semibold ${statusBadgeClass}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusText}</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-xs text-slate-700">
                        {r.checkInTime}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {r.remark || uiData.common.dash}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">{uiData.feedback.noRecordsFound}</p>
        </div>
      )}
    </div>
  );
};
