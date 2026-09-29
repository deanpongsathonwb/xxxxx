import React, { useState, useMemo } from 'react';
import { ShieldCheck, Search } from 'lucide-react';
import { uiData } from '../constants';
import { useApp } from '../stores/app.store';

export const AdminAuditPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const q = filterQuery.trim().toLowerCase();
      if (!q) return true;
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q)
      );
    });
  }, [auditLogs, filterQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {uiData.audit.title}
          </h2>
          <span className="text-sm text-slate-500 mt-1 block">
            {auditLogs.length} {uiData.units.items}
          </span>
        </div>

        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder={uiData.common.search}
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase">
              <th className="py-3 px-4 w-44">{uiData.tableHeaders.logTimestamp}</th>
              <th className="py-3 px-4 w-48">{uiData.tableHeaders.logActor}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.logAction}</th>
              <th className="py-3 px-4">{uiData.tableHeaders.logTarget}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-mono text-xs text-slate-500">
                  {log.timestamp}
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>{log.actor}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-700 font-medium">
                  {log.action}
                </td>
                <td className="py-3 px-4 text-slate-600 text-xs font-mono">
                  {log.target}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
