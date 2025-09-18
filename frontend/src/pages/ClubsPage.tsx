import React, { useState, useEffect } from 'react';
import { Hangar, Pilot, Aircraft } from '../types/aviation';


interface Club {
  id: number;
  name: string;
  cnpj?: string;
  location: string;
  founded: string;
  pilots_count: number;
  aircraft_count: number;
  status: string;
  logoUrl?: string;
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
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    cnpj: '',
    location: '',
    logo: '', // base64
  });
  const [cnpjLoading, setCnpjLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Dados reais da API
  useEffect(() => {
    setLoading(true);
    import('../services/api').then(({ default: api }) => {
      api.get('/api/clubs')
        .then((res) => {
          setClubs(res.data.data);
          setLoading(false);
        })
        .catch((err) => {
          setError('Erro ao carregar aeroclubes.');
          setLoading(false);
        });
    });
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="header-row">
            <h1 className="card-title">Carregando aeroclubes...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="header-row">
            <h1 className="card-title" style={{ color: '#c33' }}>Erro</h1>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={handleRetry}>Tentar Novamente</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Header */}
        <div className="header-row" style={{ marginBottom: '2rem' }}>
          <div>
            <h1 className="card-title" style={{ fontSize: '1.875rem', margin: '0 0 0.5rem 0' }}>
              🏢 Gerenciamento de Aeroclubes
            </h1>
            <p className="card-subtitle" style={{ fontSize: '1rem', margin: '0 0 0.5rem 0' }}>
              {clubs.length} aeroclube{clubs.length !== 1 ? 's' : ''} cadastrado{clubs.length !== 1 ? 's' : ''}
            </p>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
              <span>👨‍✈️ {clubs.reduce((acc, club) => acc + club.pilots_count, 0)} pilotos</span>
              <span>✈️ {clubs.reduce((acc, club) => acc + club.aircraft_count, 0)} aeronaves</span>
              <span>✅ {clubs.filter(club => club.status === 'active').length} ativos</span>
            </div>
          </div>
          <button 
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Aeroclube'}
          </button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <div className="card" style={{ maxWidth: 500, margin: '0 auto 2rem auto' }}>
            <h2 className="card-title" style={{ marginBottom: '1rem' }}>🏢 Cadastrar Aeroclube</h2>
            
            <form style={{ width: '100%' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome do Aeroclube</label>
                <input
                  type="text"
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Aeroclube de São Paulo"
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>CNPJ</label>
                <input
                  type="text"
                  className="input"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Localização</label>
                <input
                  type="text"
                  className="input"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: São Paulo, SP"
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>

              {formError && (
                <div className="text-danger" style={{ marginBottom: '1rem', textAlign: 'center' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn btn-success"
                  onClick={async (e) => {
                    e.preventDefault();
                    setFormError(null);
                    
                    if (!form.name || !form.location) {
                      setFormError('Nome e localização são obrigatórios');
                      return;
                    }

                    try {
                      const api = (await import('../services/api')).default;
                      const response = await api.post('/api/clubs', {
                        name: form.name,
                        location: form.location,
                        cnpj: form.cnpj
                      });

                      if (response.data.success) {
                        // Adicionar o novo clube à lista
                        setClubs([...clubs, response.data.data]);
                        // Limpar formulário
                        setForm({ name: '', cnpj: '', location: '', logo: '' });
                        setShowForm(false);
                      } else {
                        setFormError('Erro ao cadastrar aeroclube');
                      }
                    } catch (error: any) {
                      setFormError(error.response?.data?.message || 'Erro ao cadastrar aeroclube');
                    }
                  }}
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de clubes */}
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club.id} className="card club-card">
              <div className="club-header">
                <div style={{ flex: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
                    🏢 {club.name}
                  </h3>
                  <p className="card-subtitle">
                    📍 {club.location}
                  </p>
                  <p className="card-subtitle">
                    📅 Fundado em {new Date(club.founded).getFullYear()}
                  </p>
                  {club.cnpj && (
                    <p className="card-subtitle">
                      🏛️ CNPJ: {club.cnpj}
                    </p>
                  )}
                </div>
                <span className={`status-badge ${club.status === 'active' ? '' : 'status-inactive'}`}>
                  {club.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              
              {/* Estatísticas do clube */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', margin: '1rem 0' }}>
                <div className="stat-item" style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>👨‍✈️</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2563eb' }}>{club.pilots_count}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Pilotos</div>
                </div>
                <div className="stat-item" style={{ textAlign: 'center', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✈️</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#059669' }}>{club.aircraft_count}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Aeronaves</div>
                </div>
              </div>

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