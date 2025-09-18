import React, { useState, useEffect } from 'react';


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

  // Dados mockados para exibição local
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setClubs([
        {
          id: 1,
          name: 'Aeroclube de São Paulo',
          location: 'São Paulo, SP',
          founded: '1950-01-15',
          pilots_count: 45,
          aircraft_count: 12,
          status: 'active',
        },
        {
          id: 2,
          name: 'Aeroclube do Rio de Janeiro',
          location: 'Rio de Janeiro, RJ',
          founded: '1955-03-20',
          pilots_count: 38,
          aircraft_count: 8,
          status: 'active',
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleRetry = () => {
    window.location.reload();
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
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <span>+</span> Novo Aeroclube
          </button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <div className="card cadastro-card" style={{ maxWidth: 480, margin: '2.5rem auto', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', border: '1.5px solid #e2e8f0', padding: '2.2rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 className="card-title" style={{ fontSize: '1.35rem', marginBottom: 18, color: '#1e293b', textAlign: 'center', fontWeight: 700 }}>Cadastrar Aeroclube</h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                setFormError(null);
                if (!form.name.trim()) {
                  setFormError('O nome do aeroclube é obrigatório.');
                  return;
                }
                // Salvar logotipo no localStorage
                let logoUrl = '';
                if (form.logo) {
                  logoUrl = form.logo;
                  localStorage.setItem(`club_logo_${form.name}`, logoUrl);
                }
                // Adicionar novo clube
                setClubs(prev => [
                  ...prev,
                  {
                    id: Date.now(),
                    name: form.name,
                    cnpj: form.cnpj,
                    location: form.location,
                    founded: new Date().toISOString().split('T')[0],
                    pilots_count: 0,
                    aircraft_count: 0,
                    status: 'active',
                    logoUrl,
                  },
                ]);
                setShowForm(false);
                setForm({ name: '', cnpj: '', location: '', logo: '' });
                setLogoPreview(null);
              }}
              style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 18 }}
            >
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 2 }}>
                Nome*<br />
                <input
                  type="text"
                  className="card-input"
                  style={{ marginTop: 2, marginBottom: 8 }}
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Nome do aeroclube"
                />
              </label>
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 2 }}>
                CNPJ (opcional)
                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <input
                    type="text"
                    className="card-input"
                    value={form.cnpj}
                    onChange={e => setForm(f => ({ ...f, cnpj: e.target.value }))}
                    placeholder="00.000.000/0000-00"
                  />
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ minWidth: 90 }}
                    disabled={cnpjLoading || !form.cnpj.trim()}
                    onClick={async () => {
                      setFormError(null);
                      setCnpjLoading(true);
                      // Simulação de busca ReceitaWS
                      await new Promise(r => setTimeout(r, 900));
                      // Mock: CNPJ válido = '12.345.678/0001-99'
                      if (form.cnpj.replace(/\D/g, '') === '12345678000199') {
                        setForm(f => ({
                          ...f,
                          name: 'Aeroclube Exemplo',
                          location: 'São Paulo, SP',
                        }));
                        setFormError(null);
                      } else {
                        setFormError('CNPJ não encontrado na ReceitaWS (mock).');
                      }
                      setCnpjLoading(false);
                    }}
                  >
                    {cnpjLoading ? 'Buscando...' : 'Buscar CNPJ'}
                  </button>
                </div>
              </label>
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 2 }}>
                Localização<br />
                <input
                  type="text"
                  className="card-input"
                  style={{ marginTop: 2, marginBottom: 8 }}
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="Cidade, UF"
                />
              </label>
              <label style={{ fontWeight: 500, color: '#374151', marginBottom: 2 }}>
                Logotipo (opcional)<br />
                <input
                  type="file"
                  accept="image/*"
                  style={{ marginTop: 2 }}
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        setForm(f => ({ ...f, logo: ev.target?.result as string }));
                        setLogoPreview(ev.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {logoPreview && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                    <img src={logoPreview} alt="Prévia do logotipo" style={{ maxWidth: 120, borderRadius: 8 }} />
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '2px 8px', fontSize: 13 }}
                      onClick={() => { setForm(f => ({ ...f, logo: '' })); setLogoPreview(null); }}
                    >Remover</button>
                  </div>
                )}
              </label>
              {formError && <div style={{ color: '#dc2626', fontSize: 14, marginTop: 2 }}>{formError}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center' }}>
                <button type="submit" className="btn btn-primary">Salvar</button>
                <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setFormError(null); }}>Cancelar</button>
              </div>
            </form>
          </div>
        )}

        {/* Cards Grid */}
        <div className="clubs-grid">
          {clubs.map((club) => (
            <div key={club.id} className="card club-card">
              {/* Club Header */}
              <div className="club-header">
                <div style={{ flex: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: '0 0 0.25rem 0' }}>{club.name}</h3>
                  <p className="card-subtitle" style={{ fontSize: '0.9rem', margin: 0 }}>📍 {club.location}</p>
                  {club.cnpj && <p className="card-subtitle" style={{ fontSize: '0.85rem', margin: 0 }}>CNPJ: {club.cnpj}</p>}
                  {club.logoUrl && <img src={club.logoUrl} alt="Logo" style={{ maxWidth: 60, marginTop: 4, borderRadius: 6 }} />}
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