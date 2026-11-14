import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AccessibilityProvider } from './contexts/AccessibilityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { MainLayout } from './layouts/MainLayout';

import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Volunteers } from './pages/Volunteers';
import { VolunteerProfilePage } from './pages/VolunteerProfilePage';
import { Requests } from './pages/Requests';
import { TicketsPage } from './pages/TicketsPage';
import { ChatPage } from './pages/ChatPage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';

// Protected Route Guard
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="py-24 text-center text-sm text-zinc-500">
        Verificando permissões...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export function App() {
  return (
    <AccessibilityProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetails />} />
              <Route path="/volunteers" element={<Volunteers />} />
              <Route path="/volunteers/:id" element={<VolunteerProfilePage />} />

              {/* Rotas Autenticadas */}
              <Route
                path="/requests"
                element={
                  <ProtectedRoute>
                    <Requests />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets"
                element={
                  <ProtectedRoute>
                    <TicketsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:id"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />

              {/* Painel Administrativo */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Autenticação */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Rota Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AccessibilityProvider>
  );
}

export default App;
