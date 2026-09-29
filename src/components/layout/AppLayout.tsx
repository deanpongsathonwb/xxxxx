import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../stores/auth.store';
import { APP_ROUTES } from '../../constants';

export const AppLayout: React.FC = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to={APP_ROUTES.PUBLIC.LOGIN} replace />;
  }

  return (
    <div className="flex h-screen bg-slate-100 min-w-[1280px] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 h-screen overflow-y-auto">
        <Header />
        <main className="p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
