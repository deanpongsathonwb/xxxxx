import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Download, Printer, CheckCircle2 } from 'lucide-react';
import { uiData } from '../constants';
import { useApp } from '../stores/app.store';

export const OfficerReportsPage: React.FC = () => {
  const { classes, attendanceSheets, settings } = useApp();
  const [selectedMonth, setSelectedMonth] = useState<number>(8); // September (0-indexed 8)
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [printNotice, setPrintNotice] = useState<string | null>(null);

  const reportData = useMemo(() => {
    const filteredSheets = attendanceSheets.filter((sheet) => {
      const sheetMonth = new Date(sheet.date).getMonth();
      const monthMatches = sheetMonth === selectedMonth;
      const classMatches = selectedClassId === 'all' || sheet.classId === selectedClassId;
      return monthMatches && classMatches;
    });

    let totalRecorded = 0;
    let totalPresent = 0;
    let totalLate = 0;
    let totalLeave = 0;
    let totalAbsent = 0;

    filteredSheets.forEach((sheet) => {
      sheet.records.forEach((r) => {
        totalRecorded++;
        if (r.status === 'present') totalPresent++;
        else if (r.status === 'late') totalLate++;
        else if (r.status === 'leave') totalLeave++;
        else if (r.status === 'absent') totalAbsent++;
      });
    });

    const attendanceRate = totalRecorded
      ? Math.round(((totalPresent + totalLate) / totalRecorded) * 100)
      : 0;

    return {
      totalRecorded,
      totalPresent,
      totalLate,
      totalLeave,
      totalAbsent,
      attendanceRate,
      sheetCount: filteredSheets.length,
    };
  }, [attendanceSheets, selectedMonth, selectedClassId]);

  const handlePrint = () => {
    setPrintNotice(uiData.reports.printSuccess);
    setTimeout(() => setPrintNotice(null), 3000);
  };

  const handleExportCsv = () => {
    setPrintNotice(uiData.feedback.operationSuccess);
    setTimeout(() => setPrintNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.navigation.officerReports}
          </h2>
          <span className="text-sm text-slate-500 mt-1 block">
            {uiData.reports.title}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-slate-600" />
            <span>{uiData.reports.downloadExcel}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{uiData.attendanceActions.printReport}</span>
          </button>
        </div>
      </div>

      {printNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{printNotice}</span>
        </div>
      )}

      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">
            {uiData.reports.monthlySummary}:
          </span>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            {uiData.months.map((m, idx) => (
              <option key={m} value={idx}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-700">
            {uiData.tableHeaders.className}:
          </span>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">{uiData.common.all}</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 font-medium">
            {uiData.tableHeaders.attendanceRate}
          </span>
          <p className="text-3xl font-bold text-indigo-600 mt-2">
            {reportData.attendanceRate}
            <span className="text-sm font-normal text-slate-500 ml-1">
              {uiData.units.percent}
            </span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-emerald-100 shadow-sm">
          <span className="text-xs text-emerald-700 font-medium">
            {uiData.attendanceStatus.present}
          </span>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {reportData.totalPresent}
            <span className="text-sm font-normal text-emerald-700 ml-1">
              {uiData.units.times}
            </span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-amber-100 shadow-sm">
          <span className="text-xs text-amber-700 font-medium">
            {uiData.attendanceStatus.late}
          </span>
          <p className="text-3xl font-bold text-amber-600 mt-2">
            {reportData.totalLate}
            <span className="text-sm font-normal text-amber-700 ml-1">
              {uiData.units.times}
            </span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-blue-100 shadow-sm">
          <span className="text-xs text-blue-700 font-medium">
            {uiData.attendanceStatus.leave}
          </span>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {reportData.totalLeave}
            <span className="text-sm font-normal text-blue-700 ml-1">
              {uiData.units.times}
            </span>
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-rose-100 shadow-sm">
          <span className="text-xs text-rose-700 font-medium">
            {uiData.attendanceStatus.absent}
          </span>
          <p className="text-3xl font-bold text-rose-600 mt-2">
            {reportData.totalAbsent}
            <span className="text-sm font-normal text-rose-700 ml-1">
              {uiData.units.times}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-4">
          <FileSpreadsheet className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-bold text-slate-900">
            <span>{uiData.reports.monthlySummary}</span>
            <span className="mx-2">{uiData.common.dash}</span>
            <span>{uiData.months[selectedMonth]}</span>
            <span className="ml-1">{settings.academicYear}</span>
          </h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4">{uiData.tableHeaders.className}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.totalCount}</th>
              <th className="py-3 px-4 text-center text-emerald-700">{uiData.tableHeaders.presentCount}</th>
              <th className="py-3 px-4 text-center text-amber-700">{uiData.tableHeaders.lateCount}</th>
              <th className="py-3 px-4 text-center text-blue-700">{uiData.tableHeaders.leaveCount}</th>
              <th className="py-3 px-4 text-center text-rose-700">{uiData.tableHeaders.absentCount}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.attendanceRate}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {classes
              .filter((c) => selectedClassId === 'all' || c.id === selectedClassId)
              .map((c) => {
                const sheets = attendanceSheets.filter(
                  (s) =>
                    s.classId === c.id &&
                    new Date(s.date).getMonth() === selectedMonth
                );
                let p = 0;
                let l = 0;
                let lv = 0;
                let a = 0;
                sheets.forEach((s) => {
                  s.records.forEach((r) => {
                    if (r.status === 'present') p++;
                    else if (r.status === 'late') l++;
                    else if (r.status === 'leave') lv++;
                    else if (r.status === 'absent') a++;
                  });
                });
                const total = p + l + lv + a || 1;
                const rate = Math.round(((p + l) / total) * 100);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-bold text-slate-900">{c.name}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700">
                      {sheets.length * c.studentCount}
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-600">{p}</td>
                    <td className="py-3 px-4 text-center font-bold text-amber-600">{l}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{lv}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-600">{a}</td>
                    <td className="py-3 px-4 text-center font-bold text-indigo-600">
                      {rate} {uiData.units.percent}
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
