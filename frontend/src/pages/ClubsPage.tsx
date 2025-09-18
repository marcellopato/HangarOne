import React, { useState, useEffect } from 'react';
import api from '../services/api';

interface Club {
  id: number;
  name: string;
  location: string;
  founded: string;
  pilots_count: number;
  aircraft_count: number;
  status: string;
}

interface ApiResponse {
  success: boolean;
  data: Club[];
  total: number;
  message?: string;
}

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fazendo requisição para /api/clubs...');
      const response = await api.get<ApiResponse>('/api/clubs');
      console.log('📡 Resposta recebida:', response.data);
      
      if (response.data.success) {
        setClubs(response.data.data);
        console.log('✅ Clubs carregados:', response.data.data);
      } else {
        setError('Erro ao carregar aeroclubes');
        console.error('❌ Erro na resposta:', response.data);
      }
    } catch (err) {
      console.error('❌ Erro na requisição:', err);
      setError('Falha na conexão com o servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchClubs();
  };

  if (loading) {
    return (
      <div className="flex-center loading-container">
        <div className="spinner" />
        <p className="text-gray loading-text">Carregando aeroclubes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-center error-container">
        <div className="card" style={{ maxWidth: 400 }}>
          <h2 className="card-title" style={{ color: '#c33', marginBottom: 10 }}>Erro</h2>
          <p className="card-subtitle" style={{ marginBottom: 20 }}>{error}</p>
          <button className="btn btn-primary" onClick={handleRetry}>
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="empty-list-container">
        <div className="card" style={{ padding: '3rem 2rem', maxWidth: 500, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
          <h2 className="card-title" style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>
            Nenhum aeroclube encontrado
          </h2>
          <p className="card-subtitle" style={{ marginBottom: '2rem' }}>
            Ainda não há aeroclubes cadastrados no sistema.
          </p>
          <button className="btn btn-primary" onClick={() => console.log('Criar novo aeroclube')}>
            + Cadastrar Primeiro Aeroclube
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header */}
        <div className="header-row">
          <div>
            <h1 className="card-title" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>
              🏢 Gerenciamento de Aeroclubes
            </h1>
            <p className="card-subtitle" style={{ fontSize: '1rem', margin: 0 }}>
              {clubs.length} aeroclube{clubs.length !== 1 ? 's' : ''} cadastrado{clubs.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button className="btn btn-primary" onClick={() => console.log('Novo aeroclube')}>
            <span>+</span> Novo Aeroclube
          </button>
        </div>
        {/* Cards Grid */}
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club.id} className="card club-card">
              {/* Club Header */}
              <div className="club-header">
                <div style={{ flex: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>{club.name}</h3>
                  <p className="card-subtitle" style={{ fontSize: '0.9rem', margin: 0 }}>📍 {club.location}</p>
                </div>
                <span className={club.status === 'active' ? 'status-badge status-active' : 'status-badge status-inactive'}>
                  {club.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              {/* Stats */}
              <div className="club-stats">
                <div className="club-stat">
                  <div className="stat-value stat-pilots">{club.pilots_count}</div>
                  <div className="stat-label">👨‍✈️ Pilotos</div>
                </div>
                <div className="club-stat">
                  <div className="stat-value stat-aircraft">{club.aircraft_count}</div>
                  <div className="stat-label">✈️ Aeronaves</div>
                </div>
              </div>
              {/* Founded Date */}
              <div className="club-founded">📅 Fundado em {new Date(club.founded).toLocaleDateString('pt-BR')}</div>
              {/* Actions */}
              <div className="club-actions">
                <button className="btn btn-primary">👁️ Ver Detalhes</button>
                <button className="btn btn-secondary">✏️ Editar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;