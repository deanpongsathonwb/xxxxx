import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './stores/auth.store';
import { AppProvider } from './stores/app.store';
import { AppRoutes } from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
