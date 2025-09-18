import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ClubsPage from './pages/ClubsPage';
import HangarsPage from './pages/HangarsPage';
import Layout from './components/Layout';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  clubId?: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        // Invalid user data, clear storage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-sky-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show AuthPage
  if (!user) {
    return <AuthPage />;
  }

  // If user is authenticated, show the main application
  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/hangars" element={<HangarsPage />} />
          {/* Placeholder routes - páginas serão criadas posteriormente */}
          <Route path="/pilots" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-700">Página de Pilotos em desenvolvimento</h2></div>} />
          <Route path="/aircraft" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-700">Página de Aeronaves em desenvolvimento</h2></div>} />
          <Route path="/documents" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-700">Página de Documentos em desenvolvimento</h2></div>} />
          <Route path="/reports" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-700">Página de Relatórios em desenvolvimento</h2></div>} />
          <Route path="/settings" element={<div className="text-center py-12"><h2 className="text-2xl font-bold text-gray-700">Página de Configurações em desenvolvimento</h2></div>} />
          {/* Redirect unknown routes to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
