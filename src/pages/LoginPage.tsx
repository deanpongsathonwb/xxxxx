import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { School, UserCheck } from 'lucide-react';
import { uiData, APP_ROUTES } from '../constants';
import { useAuth } from '../stores/auth.store';
import { useApp } from '../stores/app.store';
import { getUserImageUrl } from '../utils/images';
import type { UserProfile } from '../types/common.types';

export const LoginPage: React.FC = () => {
  const { currentUser, allUsers, loginById, loginByUsername } = useAuth();
  const { settings, addAuditLog } = useApp();
  const navigate = useNavigate();

  const [usernameInput, setUsernameInput] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (currentUser) {
    if (currentUser.role === 'teacher') {
      return <Navigate to={APP_ROUTES.TEACHER.ATTENDANCE} replace />;
    }
    if (currentUser.role === 'officer') {
      return <Navigate to={APP_ROUTES.OFFICER.OVERVIEW} replace />;
    }
    return <Navigate to={APP_ROUTES.ADMIN.SETTINGS} replace />;
  }

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput.trim()) return;

    const success = loginByUsername(usernameInput);
    if (success) {
      setErrorMessage(null);
      const user = allUsers.find(
        (u) => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
      );
      if (user) {
        addAuditLog(user.name, uiData.audit.actions.login, user.username);
        if (user.role === 'teacher') navigate(APP_ROUTES.TEACHER.ATTENDANCE);
        else if (user.role === 'officer') navigate(APP_ROUTES.OFFICER.OVERVIEW);
        else navigate(APP_ROUTES.ADMIN.SETTINGS);
      }
    } else {
      setErrorMessage(uiData.feedback.loginFailed);
    }
  };

  const handleQuickLogin = (user: UserProfile) => {
    loginById(user.id);
    addAuditLog(user.name, uiData.audit.actions.login, user.username);
    if (user.role === 'teacher') {
      navigate(APP_ROUTES.TEACHER.ATTENDANCE);
    } else if (user.role === 'officer') {
      navigate(APP_ROUTES.OFFICER.OVERVIEW);
    } else {
      navigate(APP_ROUTES.ADMIN.SETTINGS);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-6 min-w-[1280px]">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-3 shadow-md">
            <School className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 text-center">
            {uiData.system.name}
          </h1>
          <span className="text-sm font-medium text-slate-500 mt-1">
            {settings.systemOwner}
          </span>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {uiData.auth.usernameLabel}
            </label>
            <input
              type="text"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {uiData.auth.passwordLabel}
            </label>
            <input
              type="password"
              placeholder={uiData.common.passwordPlaceholder}
              className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow transition-colors cursor-pointer"
          >
            {uiData.auth.loginButton}
          </button>
        </form>

        <div className="border-t border-slate-200 pt-5">
          <p className="text-xs font-semibold text-slate-600 mb-3 text-center">
            {uiData.auth.selectUserPrompt}
          </p>

          <div className="space-y-2">
            {allUsers.map((user) => {
              const roleDisplay = uiData.roles[user.role];
              const photo = getUserImageUrl(user.imageKey);

              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={photo}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <div className="text-sm font-bold text-slate-800">{user.name}</div>
                      <div className="text-xs text-slate-500">
                        <span>{user.username}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
                      {roleDisplay}
                    </span>
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
