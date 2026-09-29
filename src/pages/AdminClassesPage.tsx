import React, { useState } from 'react';
import { Layers, Plus, CheckCircle2, Power } from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import type { ClassItem } from '../types/common.types';

export const AdminClassesPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { classes, addClass, toggleClassStatus, addAuditLog } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const [newClassName, setNewClassName] = useState('');
  const [newShortCode, setNewShortCode] = useState('');
  const [newGradeLevel, setNewGradeLevel] = useState('');
  const [newRoomNumber, setNewRoomNumber] = useState('');
  const [newTeacherName, setNewTeacherName] = useState('');

  const handleToggleStatus = (cls: ClassItem) => {
    toggleClassStatus(cls.id);
    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.toggleRoomStatus, cls.name);
    }
    setSuccessNotice(uiData.feedback.statusUpdated);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    addClass({
      name: newClassName,
      shortCode: newShortCode || newClassName,
      gradeLevel: newGradeLevel,
      roomNumber: newRoomNumber,
      homeroomTeacherId: `u-teacher-${Date.now()}`,
      homeroomTeacherName: newTeacherName,
      studentCount: 10,
      isActive: true,
    });

    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.addClass, newClassName);
    }

    setIsModalOpen(false);
    setNewClassName('');
    setNewShortCode('');
    setNewGradeLevel('');
    setNewRoomNumber('');
    setNewTeacherName('');

    setSuccessNotice(uiData.feedback.classSaved);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.classesManagement.title}
          </h2>
          <span className="text-sm text-slate-500 mt-1 block">
            {classes.length} {uiData.units.rooms}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{uiData.classesManagement.addClassButton}</span>
        </button>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4">{uiData.tableHeaders.className}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.gradeLevel}</th>
              <th className="py-3 px-4 w-28 text-center">{uiData.tableHeaders.roomNumber}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.homeroomTeacher}</th>
              <th className="py-3 px-4 w-28 text-center">{uiData.tableHeaders.studentCount}</th>
              <th className="py-3 px-4 w-28 text-center">{uiData.tableHeaders.roomStatus}</th>
              <th className="py-3 px-4 w-28 text-center">{uiData.tableHeaders.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {classes.map((cls) => (
              <tr key={cls.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-bold text-slate-900">
                  <div className="flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>{cls.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600">{cls.gradeLevel}</td>
                <td className="py-3 px-4 text-center font-mono text-xs text-slate-700">
                  {cls.roomNumber}
                </td>
                <td className="py-3 px-4 text-slate-800 font-medium">
                  {cls.homeroomTeacherName}
                </td>
                <td className="py-3 px-4 text-center font-bold text-slate-700">
                  {cls.studentCount} {uiData.units.person}
                </td>
                <td className="py-3 px-4 text-center">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      cls.isActive
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cls.isActive
                      ? uiData.badges.systemActive
                      : uiData.badges.systemInactive}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(cls)}
                    className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                      cls.isActive
                        ? 'text-rose-700 hover:bg-rose-50 border border-rose-200'
                        : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                    }`}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>
                      {cls.isActive
                        ? uiData.common.inactive
                        : uiData.common.active}
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              {uiData.classesManagement.modalTitle}
            </h3>

            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {uiData.classesManagement.classNameLabel}
                </label>
                <input
                  type="text"
                  required
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {uiData.classesManagement.shortCodeLabel}
                  </label>
                  <input
                    type="text"
                    value={newShortCode}
                    onChange={(e) => setNewShortCode(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {uiData.classesManagement.roomNumberLabel}
                  </label>
                  <input
                    type="text"
                    value={newRoomNumber}
                    onChange={(e) => setNewRoomNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {uiData.classesManagement.gradeLevelLabel}
                </label>
                <input
                  type="text"
                  value={newGradeLevel}
                  onChange={(e) => setNewGradeLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {uiData.classesManagement.homeroomTeacherLabel}
                </label>
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                >
                  {uiData.classesManagement.cancelButton}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
                >
                  {uiData.classesManagement.saveButton}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
