import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ClubsPage from './pages/ClubsPage';
import HangarsPage from './pages/HangarsPage';

// Componente de Layout com Navegação
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/clubs', label: 'Aeroclubes', icon: '🏢' },
    { path: '/hangars', label: 'Hangares', icon: '🏚️' },
    { path: '/pilots', label: 'Pilotos', icon: '👨‍✈️' },
    { path: '/aircraft', label: 'Aeronaves', icon: '✈️' },
    { path: '/flights', label: 'Voos', icon: '🛫' },
    { path: '/maintenance', label: 'Manutenção', icon: '🔧' },
    { path: '/payments', label: 'Pagamentos', icon: '💰' },
  ];
  return (
    <div className="main-bg">
      {/* Header */}
      <header className="main-header">
        <div className="container">
          <div className="header-row">
            <Link to="/" className="brand-link">
              <h1 className="brand-title">✈️ HangarOne</h1>
            </Link>
            <div className="header-desc">Sistema de Gestão de Aeroclubes</div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="main-nav">
        <div className="container">
          <div className="nav-row">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-link${location.pathname === item.path ? ' nav-link-active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
  <main className="main-content" style={{ width: '100%' }}>
        {children}
      </main>
    </div>
  );
};

// Dashboard Page
const DashboardPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="content-container">
        {/* Welcome Section */}
        <div className="card welcome-card">
          <h1 className="card-title welcome-title">Bem-vindo ao HangarOne! 🚁</h1>
          <p className="card-subtitle welcome-desc">Sistema completo de gerenciamento para aeroclubes e pilotos</p>
          {/* Quick Actions */}
          <div className="quick-actions">
            <Link to="/clubs" className="btn btn-primary">🏢 Gerenciar Aeroclubes</Link>
            <Link to="/pilots" className="btn btn-success">👨‍✈️ Cadastrar Piloto</Link>
            <Link to="/flights" className="btn btn-warning">🛫 Agendar Voo</Link>
          </div>
        </div>
        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="card stat-card">
            <div className="stat-header"><span className="stat-icon">🏢</span>
              <div>
                <h3 className="card-title stat-title">Aeroclubes</h3>
                <p className="card-subtitle stat-subtitle">Total cadastrados</p>
              </div>
            </div>
            <div className="stat-value stat-blue">2</div>
          </div>
          <div className="card stat-card">
            <div className="stat-header"><span className="stat-icon">👨‍✈️</span>
              <div>
                <h3 className="card-title stat-title">Pilotos</h3>
                <p className="card-subtitle stat-subtitle">Ativos no sistema</p>
              </div>
            </div>
            <div className="stat-value stat-green">83</div>
          </div>
          <div className="card stat-card">
            <div className="stat-header"><span className="stat-icon">✈️</span>
              <div>
                <h3 className="card-title stat-title">Aeronaves</h3>
                <p className="card-subtitle stat-subtitle">Em operação</p>
              </div>
            </div>
            <div className="stat-value stat-orange">20</div>
          </div>
          <div className="card stat-card">
            <div className="stat-header"><span className="stat-icon">🛫</span>
              <div>
                <h3 className="card-title stat-title">Voos Hoje</h3>
                <p className="card-subtitle stat-subtitle">Agendamentos</p>
              </div>
            </div>
            <div className="stat-value stat-red">5</div>
          </div>
        </div>
        {/* Recent Activity */}
        <div className="card activity-card">
          <h2 className="card-title activity-title">📋 Atividades Recentes</h2>
          <div className="activity-list">
            <div className="activity-item activity-blue"><strong>João Silva</strong> agendou um voo para hoje às 14:00</div>
            <div className="activity-item activity-green"><strong>Aeroclube SP</strong> cadastrou nova aeronave BR-1234</div>
            <div className="activity-item activity-orange"><strong>Manutenção</strong> programada para BR-5678 na próxima semana</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder pages
const PilotsPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>👨‍✈️ Gestão de Pilotos</h1>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

const AircraftPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>✈️ Gestão de Aeronaves</h1>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

const FlightsPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🛫 Agendamento de Voos</h1>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

const MaintenancePage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>🔧 Gestão de Manutenção</h1>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

const PaymentsPage: React.FC = () => (
  <div style={{ padding: '2rem', textAlign: 'center' }}>
    <h1>💰 Gestão de Pagamentos</h1>
    <p>Funcionalidade em desenvolvimento...</p>
  </div>
);

// Main App Component
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/hangars" element={<HangarsPage />} />
          <Route path="/pilots" element={<PilotsPage />} />
          <Route path="/aircraft" element={<AircraftPage />} />
          <Route path="/flights" element={<FlightsPage />} />
          <Route path="/maintenance" element={<MaintenancePage />} />
          <Route path="/payments" element={<PaymentsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;