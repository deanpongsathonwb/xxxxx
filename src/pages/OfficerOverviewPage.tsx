import React, { useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  UserX,
  Percent,
} from 'lucide-react';
import { uiData } from '../constants';
import { useApp } from '../stores/app.store';

export const OfficerOverviewPage: React.FC = () => {
  const { classes, students, attendanceSheets } = useApp();
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);

  const todaySheets = useMemo(() => {
    return attendanceSheets.filter((s) => s.date === todayStr);
  }, [attendanceSheets, todayStr]);

  const schoolMetrics = useMemo(() => {
    let present = 0;
    let late = 0;
    let leave = 0;
    let absent = 0;

    todaySheets.forEach((sheet) => {
      sheet.records.forEach((r) => {
        if (r.status === 'present') present++;
        else if (r.status === 'late') late++;
        else if (r.status === 'leave') leave++;
        else if (r.status === 'absent') absent++;
      });
    });

    const totalStudents = students.length || 1;
    const attended = present + late;
    const rate = Math.round((attended / totalStudents) * 100);

    return {
      total: students.length,
      present,
      late,
      leave,
      absent,
      rate,
      totalClasses: classes.length,
    };
  }, [students, classes, todaySheets]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.navigation.officerOverview}
          </h2>
          <span className="text-sm text-slate-500 mt-1 block">
            {uiData.common.dateLabel} {todayStr}
          </span>
        </div>

        <div className="flex items-center space-x-2 text-sm font-semibold text-slate-700 bg-slate-100 px-4 py-2 rounded-lg border border-slate-200">
          <span>{uiData.metrics.totalClasses}:</span>
          <span className="text-indigo-600">
            {schoolMetrics.totalClasses} {uiData.units.rooms}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">{uiData.metrics.totalStudents}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              {schoolMetrics.total} <span className="text-xs font-normal text-slate-500">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-indigo-700 font-medium">{uiData.metrics.attendancePercentage}</p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {schoolMetrics.rate} <span className="text-xs font-normal text-indigo-700">{uiData.units.percent}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Percent className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-emerald-700 font-medium">{uiData.metrics.todayPresent}</p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {schoolMetrics.present} <span className="text-xs font-normal text-emerald-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-amber-700 font-medium">{uiData.metrics.todayLate}</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {schoolMetrics.late} <span className="text-xs font-normal text-amber-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-blue-700 font-medium">{uiData.metrics.todayLeave}</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {schoolMetrics.leave} <span className="text-xs font-normal text-blue-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-rose-700 font-medium">{uiData.metrics.todayAbsent}</p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {schoolMetrics.absent} <span className="text-xs font-normal text-rose-700">{uiData.units.person}</span>
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
            <UserX className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">
            {uiData.reports.classBreakdown}
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4">{uiData.tableHeaders.className}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.homeroomTeacher}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.totalCount}</th>
              <th className="py-3 px-4 text-center text-emerald-700">{uiData.tableHeaders.presentCount}</th>
              <th className="py-3 px-4 text-center text-amber-700">{uiData.tableHeaders.lateCount}</th>
              <th className="py-3 px-4 text-center text-blue-700">{uiData.tableHeaders.leaveCount}</th>
              <th className="py-3 px-4 text-center text-rose-700">{uiData.tableHeaders.absentCount}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.attendanceRate}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.status}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {classes.map((cls) => {
              const sheet = todaySheets.find((s) => s.classId === cls.id);
              let present = 0;
              let late = 0;
              let leave = 0;
              let absent = 0;

              if (sheet) {
                sheet.records.forEach((r) => {
                  if (r.status === 'present') present++;
                  else if (r.status === 'late') late++;
                  else if (r.status === 'leave') leave++;
                  else if (r.status === 'absent') absent++;
                });
              }

              const total = cls.studentCount || 10;
              const rate = sheet ? Math.round(((present + late) / total) * 100) : 0;

              return (
                <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{cls.name}</td>
                  <td className="py-3 px-4 text-slate-600">{cls.homeroomTeacherName}</td>
                  <td className="py-3 px-4 text-center font-semibold text-slate-700">
                    {cls.studentCount}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">
                    {sheet ? present : uiData.common.dash}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-amber-600">
                    {sheet ? late : uiData.common.dash}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-blue-600">
                    {sheet ? leave : uiData.common.dash}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-rose-600">
                    {sheet ? absent : uiData.common.dash}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-indigo-600">
                    {sheet ? `${rate} ${uiData.units.percent}` : uiData.common.dash}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        sheet?.isSubmitted
                          ? 'bg-emerald-100 text-emerald-800'
                          : sheet
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {sheet?.isSubmitted
                        ? uiData.badges.submitted
                        : sheet
                        ? uiData.badges.draft
                        : uiData.badges.pending}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
