import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { APP_ROUTES } from '../constants';
import { useAuth } from '../stores/auth.store';
import { AppLayout } from '../components/layout/AppLayout';
import { LoginPage } from '../pages/LoginPage';
import { TeacherAttendancePage } from '../pages/TeacherAttendancePage';
import { TeacherHistoryPage } from '../pages/TeacherHistoryPage';
import { TeacherStudentsPage } from '../pages/TeacherStudentsPage';
import { OfficerOverviewPage } from '../pages/OfficerOverviewPage';
import { OfficerTruancyPage } from '../pages/OfficerTruancyPage';
import { OfficerReportsPage } from '../pages/OfficerReportsPage';
import { AdminSettingsPage } from '../pages/AdminSettingsPage';
import { AdminClassesPage } from '../pages/AdminClassesPage';
import { AdminAuditPage } from '../pages/AdminAuditPage';

const RootRedirect: React.FC = () => {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return React.createElement(Navigate, { to: APP_ROUTES.PUBLIC.LOGIN, replace: true });
  }
  if (currentUser.role === 'teacher') {
    return React.createElement(Navigate, { to: APP_ROUTES.TEACHER.ATTENDANCE, replace: true });
  }
  if (currentUser.role === 'officer') {
    return React.createElement(Navigate, { to: APP_ROUTES.OFFICER.OVERVIEW, replace: true });
  }
  return React.createElement(Navigate, { to: APP_ROUTES.ADMIN.SETTINGS, replace: true });
};

export const AppRoutes: React.FC = () => {
  return React.createElement(
    Routes,
    null,
    React.createElement(Route, {
      path: APP_ROUTES.PUBLIC.LOGIN,
      element: React.createElement(LoginPage, null),
    }),
    React.createElement(
      Route,
      {
        element: React.createElement(AppLayout, null),
      },
      // Teacher routes
      React.createElement(Route, {
        path: APP_ROUTES.TEACHER.ATTENDANCE,
        element: React.createElement(TeacherAttendancePage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.TEACHER.HISTORY,
        element: React.createElement(TeacherHistoryPage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.TEACHER.STUDENTS,
        element: React.createElement(TeacherStudentsPage, null),
      }),

      // Officer routes
      React.createElement(Route, {
        path: APP_ROUTES.OFFICER.OVERVIEW,
        element: React.createElement(OfficerOverviewPage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.OFFICER.TRUANCY,
        element: React.createElement(OfficerTruancyPage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.OFFICER.REPORTS,
        element: React.createElement(OfficerReportsPage, null),
      }),

      // Admin routes
      React.createElement(Route, {
        path: APP_ROUTES.ADMIN.SETTINGS,
        element: React.createElement(AdminSettingsPage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.ADMIN.CLASSES,
        element: React.createElement(AdminClassesPage, null),
      }),
      React.createElement(Route, {
        path: APP_ROUTES.ADMIN.AUDIT,
        element: React.createElement(AdminAuditPage, null),
      })
    ),
    React.createElement(Route, {
      path: '/',
      element: React.createElement(RootRedirect, null),
    }),
    React.createElement(Route, {
      path: '*',
      element: React.createElement(RootRedirect, null),
    })
  );
};
