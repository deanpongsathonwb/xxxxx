import React, { useState } from 'react';
import { Save, RotateCcw, CheckCircle2 } from 'lucide-react';
import { uiData } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import seedSettings from '../seed/settings.json';
import type { SchoolSettings } from '../types/common.types';

export const AdminSettingsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { settings, updateSettings, addAuditLog } = useApp();

  const [formData, setFormData] = useState<SchoolSettings>({ ...settings });
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.updateSettings, formData.systemOwner);
    }
    setSuccessNotice(uiData.settings.settingsSavedSuccess);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleReset = () => {
    const defaultSettings = seedSettings as SchoolSettings;
    setFormData(defaultSettings);
    updateSettings(defaultSettings);
    if (currentUser) {
      addAuditLog(currentUser.name, uiData.audit.actions.updateSettings, defaultSettings.systemOwner);
    }
    setSuccessNotice(uiData.feedback.operationSuccess);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.settings.title}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {uiData.settings.description}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center space-x-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-slate-600" />
            <span>{uiData.settings.resetSettingsButton}</span>
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center space-x-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm cursor-pointer transition-colors"
          >
            <Save className="w-4 h-4" />
            <span>{uiData.settings.saveSettingsButton}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span className="font-medium">{successNotice}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.systemOwnerLabel}
            </label>
            <input
              type="text"
              value={formData.systemOwner}
              onChange={(e) => setFormData({ ...formData, systemOwner: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.schoolBranchLabel}
            </label>
            <input
              type="text"
              value={formData.schoolBranch}
              onChange={(e) => setFormData({ ...formData, schoolBranch: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.academicYearLabel}
            </label>
            <input
              type="text"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.academicTermLabel}
            </label>
            <input
              type="text"
              value={formData.academicTerm}
              onChange={(e) => setFormData({ ...formData, academicTerm: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.morningAssemblyTimeLabel}
            </label>
            <input
              type="time"
              value={formData.morningAssemblyTime}
              onChange={(e) => setFormData({ ...formData, morningAssemblyTime: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.lateThresholdMinutesLabel}
            </label>
            <input
              type="number"
              value={formData.lateThresholdMinutes}
              onChange={(e) => setFormData({ ...formData, lateThresholdMinutes: Number(e.target.value) })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.autoMarkAbsentAfterLabel}
            </label>
            <input
              type="time"
              value={formData.autoMarkAbsentAfter}
              onChange={(e) => setFormData({ ...formData, autoMarkAbsentAfter: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {uiData.settings.contactEmailLabel}
            </label>
            <input
              type="email"
              value={formData.contactEmail}
              onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 grid grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              id="allowTeacherSelfApproval"
              checked={formData.allowTeacherSelfApproval}
              onChange={(e) => setFormData({ ...formData, allowTeacherSelfApproval: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="allowTeacherSelfApproval" className="text-xs font-semibold text-slate-800 cursor-pointer">
              {uiData.settings.allowTeacherSelfApprovalLabel}
            </label>
          </div>

          <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <input
              type="checkbox"
              id="notificationLineNotify"
              checked={formData.notificationLineNotify}
              onChange={(e) => setFormData({ ...formData, notificationLineNotify: e.target.checked })}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
            />
            <label htmlFor="notificationLineNotify" className="text-xs font-semibold text-slate-800 cursor-pointer">
              {uiData.settings.notificationLineNotifyLabel}
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};
