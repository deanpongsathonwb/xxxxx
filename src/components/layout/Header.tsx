import React from 'react';
import { Calendar, School } from 'lucide-react';
import { uiData } from '../../constants';
import { useApp } from '../../stores/app.store';

export const Header: React.FC = () => {
  const { settings } = useApp();
  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
          <School className="w-6 h-6" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 leading-tight">
            {uiData.system.name}
          </h1>
          <span className="text-xs text-slate-500 font-medium">
            {settings.systemOwner}
          </span>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>{uiData.common.dateLabel}</span>
          <span className="font-semibold text-slate-700">{todayStr}</span>
        </div>

        <div className="text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-md">
          <span>{uiData.common.termPrefix} {settings.academicTerm}</span>
          <span className="mx-1">{uiData.common.separatorSlash}</span>
          <span>{uiData.common.yearPrefix} {settings.academicYear}</span>
        </div>
      </div>
    </header>
  );
};
