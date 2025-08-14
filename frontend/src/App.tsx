import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import ClubsPage from './pages/ClubsPage';

// Componente de Layout com Navegação
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '🏠' },
    { path: '/clubs', label: 'Aeroclubes', icon: '🏢' },
    { path: '/pilots', label: 'Pilotos', icon: '👨‍✈️' },
    { path: '/aircraft', label: 'Aeronaves', icon: '✈️' },
    { path: '/flights', label: 'Voos', icon: '🛫' },
    { path: '/maintenance', label: 'Manutenção', icon: '🔧' },
    { path: '/payments', label: 'Pagamentos', icon: '💰' },
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0066cc 0%, #004d99 100%)',
        color: 'white',
        padding: '1rem 0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', margin: 0 }}>
                ✈️ HangarOne
              </h1>
            </Link>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>
              Sistema de Gestão de Aeroclubes
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', overflowX: 'auto' }}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem 1.5rem',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? '#0066cc' : '#64748b',
                  borderBottom: location.pathname === item.path ? '2px solid #0066cc' : '2px solid transparent',
                  fontWeight: location.pathname === item.path ? '600' : '400',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ marginRight: '0.5rem' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ minHeight: 'calc(100vh - 140px)' }}>
        {children}
      </main>
    </div>
  );
};

// Dashboard Page
const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Welcome Section */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem' }}>
            Bem-vindo ao HangarOne! 🚁
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2rem' }}>
            Sistema completo de gerenciamento para aeroclubes e pilotos
          </p>
          
          {/* Quick Actions */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/clubs" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#0066cc',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                🏢 Gerenciar Aeroclubes
              </button>
            </Link>
            <Link to="/pilots" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#28a745',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                👨‍✈️ Cadastrar Piloto
              </button>
            </Link>
            <Link to="/flights" style={{ textDecoration: 'none' }}>
              <button style={{
                backgroundColor: '#fd7e14',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}>
                🛫 Agendar Voo
              </button>
            </Link>
          </div>
        </div>

        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🏢</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Aeroclubes
                </h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Total cadastrados</p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#0066cc' }}>2</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>👨‍✈️</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Pilotos
                </h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Ativos no sistema</p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#28a745' }}>83</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>✈️</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Aeronaves
                </h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Em operação</p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#fd7e14' }}>20</div>
          </div>

          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '1.5rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2rem', marginRight: '1rem' }}>🛫</span>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', margin: 0 }}>
                  Voos Hoje
                </h3>
                <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Agendamentos</p>
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#dc3545' }}>5</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '1.5rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', marginBottom: '1rem' }}>
            📋 Atividades Recentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px', borderLeft: '4px solid #0066cc' }}>
              <strong>João Silva</strong> agendou um voo para hoje às 14:00
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px', borderLeft: '4px solid #28a745' }}>
              <strong>Aeroclube SP</strong> cadastrou nova aeronave BR-1234
            </div>
            <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px', borderLeft: '4px solid #fd7e14' }}>
              <strong>Manutenção</strong> programada para BR-5678 na próxima semana
            </div>
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