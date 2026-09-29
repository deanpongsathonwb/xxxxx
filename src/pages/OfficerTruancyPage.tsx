import React, { useState, useMemo } from 'react';
import { AlertTriangle, Check, X, Phone, CheckCircle2 } from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import { getStudentImageUrl } from '../utils/images';

export const OfficerTruancyPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { students, leaves, updateLeaveStatus, addAuditLog } = useApp();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [contactedIds, setContactedIds] = useState<Record<string, boolean>>({});

  const highRiskStudents = useMemo(() => {
    return students.filter((s) => s.accumulatedAbsences >= 3);
  }, [students]);

  const handleApproveLeave = (leaveId: string, studentName: string) => {
    updateLeaveStatus(leaveId, 'approved');
    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.approveLeave, studentName);
    }
    setSuccessMessage(uiData.feedback.leaveStatusUpdated);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleRejectLeave = (leaveId: string, studentName: string) => {
    updateLeaveStatus(leaveId, 'rejected');
    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.rejectLeave, studentName);
    }
    setSuccessMessage(uiData.feedback.leaveStatusUpdated);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleToggleContacted = (studentId: string, studentName: string) => {
    const nextState = !contactedIds[studentId];
    setContactedIds((prev) => ({ ...prev, [studentId]: nextState }));
    if (nextState && currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.contactGuardian, studentName);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          {uiData.navigation.officerTruancy}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {uiData.truancy.title}
        </p>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {/* High-risk students section */}
      <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-rose-100 bg-rose-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-bold text-rose-900">
              {uiData.truancy.highRiskTitle}
            </span>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 bg-rose-200 text-rose-900 rounded-full">
            {highRiskStudents.length} {uiData.units.person}
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4 w-20 text-center">{uiData.tableHeaders.studentPhoto}</th>
              <th className="py-3 px-4 w-28">{uiData.tableHeaders.studentId}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.studentName}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.guardianName}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.guardianPhone}</th>
              <th className="py-3 px-4 text-center">{uiData.truancy.accumulatedAbsencesPrefix}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {highRiskStudents.map((student) => {
              const photo = getStudentImageUrl(student.imageKey);
              const isContacted = !!contactedIds[student.id];

              return (
                <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 text-center">
                    <img
                      src={photo}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover mx-auto border border-slate-200"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    {student.studentCode}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {student.name}
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    {student.guardianName}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-600">
                    {student.guardianPhone}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      {student.accumulatedAbsences} {uiData.units.days}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleContacted(student.id, student.name)}
                      className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                        isContacted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>
                        {isContacted
                          ? uiData.truancy.contactedStatus
                          : uiData.truancy.guardianContactAction}
                      </span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Leave requests section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-800">
            {uiData.truancy.leaveApprovalTitle}
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-200 text-slate-700 rounded-full">
            {leaves.length} {uiData.units.items}
          </span>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4 w-28">{uiData.tableHeaders.leaveDate}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.studentName}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.className}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.leaveReason}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.leaveStatus}</th>
              <th className="py-3 px-4 text-center">{uiData.tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {leaves.map((leave) => {
              const isPending = leave.status === 'pending';

              return (
                <tr key={leave.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-slate-700 font-semibold">
                    {leave.leaveDate}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {leave.studentName}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {leave.className}
                  </td>
                  <td className="py-3 px-4 text-slate-700 text-xs">
                    {leave.reason}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        leave.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : leave.status === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {leave.status === 'approved'
                        ? uiData.badges.approved
                        : leave.status === 'rejected'
                        ? uiData.badges.rejected
                        : uiData.badges.pending}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {isPending ? (
                      <div className="inline-flex space-x-2">
                        <button
                          type="button"
                          onClick={() => handleApproveLeave(leave.id, leave.studentName)}
                          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md cursor-pointer transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{uiData.truancy.approveAction}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRejectLeave(leave.id, leave.studentName)}
                          className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md cursor-pointer transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>{uiData.truancy.rejectAction}</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">
                        {leave.status === 'approved'
                          ? uiData.badges.approved
                          : uiData.badges.rejected}
                      </span>
                    )}
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
