import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  History,
  Users,
  BarChart3,
  AlertTriangle,
  FileSpreadsheet,
  Settings,
  Layers,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { uiData, APP_ROUTES } from '../../constants';
import { useAuth } from '../../stores/auth.store';
import { getUserImageUrl } from '../../utils/images';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const Sidebar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.PUBLIC.LOGIN);
  };

  const teacherNavItems: NavItem[] = [
    {
      to: APP_ROUTES.TEACHER.ATTENDANCE,
      label: uiData.navigation.teacherAttendance,
      icon: ClipboardCheck,
    },
    {
      to: APP_ROUTES.TEACHER.HISTORY,
      label: uiData.navigation.teacherHistory,
      icon: History,
    },
    {
      to: APP_ROUTES.TEACHER.STUDENTS,
      label: uiData.navigation.teacherStudents,
      icon: Users,
    },
  ];

  const officerNavItems: NavItem[] = [
    {
      to: APP_ROUTES.OFFICER.OVERVIEW,
      label: uiData.navigation.officerOverview,
      icon: BarChart3,
    },
    {
      to: APP_ROUTES.OFFICER.TRUANCY,
      label: uiData.navigation.officerTruancy,
      icon: AlertTriangle,
    },
    {
      to: APP_ROUTES.OFFICER.REPORTS,
      label: uiData.navigation.officerReports,
      icon: FileSpreadsheet,
    },
  ];

  const adminNavItems: NavItem[] = [
    {
      to: APP_ROUTES.ADMIN.SETTINGS,
      label: uiData.navigation.adminSettings,
      icon: Settings,
    },
    {
      to: APP_ROUTES.ADMIN.CLASSES,
      label: uiData.navigation.adminClasses,
      icon: Layers,
    },
    {
      to: APP_ROUTES.ADMIN.AUDIT,
      label: uiData.navigation.adminAudit,
      icon: ShieldCheck,
    },
  ];

  let activeNavItems: NavItem[] = teacherNavItems;
  if (currentUser.role === 'officer') {
    activeNavItems = officerNavItems;
  } else if (currentUser.role === 'admin') {
    activeNavItems = adminNavItems;
  }

  const roleDisplay = uiData.roles[currentUser.role];
  const userPhoto = getUserImageUrl(currentUser.imageKey);

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-slate-800">
      <div className="flex flex-col">
        <div className="px-6 py-5 border-b border-slate-800">
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
            {roleDisplay}
          </span>
        </div>

        <nav className="p-4 space-y-1.5">
          {activeNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={userPhoto}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover border border-slate-700"
          />
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-white truncate">{currentUser.name}</p>
            <p className="text-xs text-slate-400 truncate">{roleDisplay}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 rounded-md border border-rose-800/50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{uiData.auth.logoutButton}</span>
        </button>
      </div>
    </aside>
  );
};
