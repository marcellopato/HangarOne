import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Hangar, Club } from '../types/aviation';

const HangarsPage: React.FC = () => {
  const [hangars, setHangars] = useState<Hangar[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    clubId: '',
    location: '',
    capacity: 1,
    description: '',
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/hangars'),
      api.get('/api/clubs'),
    ])
      .then(([hangarsRes, clubsRes]) => {
        setHangars(hangarsRes.data.data);
        setClubs(clubsRes.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar hangares ou clubes.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.clubId) {
      setFormError('Nome e Aeroclube são obrigatórios.');
      return;
    }
    try {
  const res = await api.post('/api/hangars', {
        ...form,
        clubId: Number(form.clubId),
        capacity: Number(form.capacity),
      });
      setHangars([...hangars, res.data.data]);
      setShowForm(false);
      setForm({ name: '', clubId: '', location: '', capacity: 1, description: '', isActive: true });
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Erro ao criar hangar.');
    }
  };

  if (loading) {
    return (
      <div className="flex-center loading-container">
        <div className="spinner"></div>
        <p className="loading-text">Carregando hangares...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="error-container">
        <div className="card">
          <h2 className="card-title text-danger">Erro</h2>
          <p className="card-subtitle">{error}</p>
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
              🏠 Gerenciamento de Hangares
            </h1>
            <p className="card-subtitle" style={{ fontSize: '1rem', margin: 0 }}>
              {hangars.length} hangar{hangars.length !== 1 ? 'es' : ''} cadastrado{hangars.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Hangar'}
          </button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <div className="card" style={{ maxWidth: 500, margin: '0 auto 2rem auto' }}>
            <h2 className="card-title" style={{ marginBottom: '1rem' }}>Cadastrar Hangar</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Nome</label>
                <input
                  className="input"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Aeroclube</label>
                <select
                  className="input"
                  name="clubId"
                  value={form.clubId}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                >
                  <option value="">Selecione</option>
                  {clubs && clubs.map((club) => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Localização</label>
                <input
                  className="input"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Capacidade</label>
                <input
                  className="input"
                  name="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Descrição</label>
                <input
                  className="input"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Status</label>
                <select
                  className="input"
                  name="isActive"
                  value={form.isActive ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}
                  style={{ width: '100%', padding: '0.75rem', border: '1px solid #dee2e6', borderRadius: '4px' }}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
              {formError && <div className="text-danger" style={{ marginBottom: '1rem', textAlign: 'center' }}>{formError}</div>}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-success">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid de hangares */}
        <div className="clubs-grid">
          {hangars.map((hangar) => (
            <div key={hangar.id} className="card club-card">
              <div className="club-header">
                <div style={{ flex: 1 }}>
                  <h3 className="card-title" style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
                    🏠 {hangar.name}
                  </h3>
                  <p className="card-subtitle">
                    Aeroclube: {clubs && clubs.length > 0 ? (clubs.find(c => c.id === hangar.clubId)?.name || `ID: ${hangar.clubId}`) : 'Carregando...'}
                  </p>
                  {hangar.location && (
                    <p className="card-subtitle">📍 {hangar.location}</p>
                  )}
                  {typeof hangar.capacity !== 'undefined' && (
                    <p className="card-subtitle">✈️ Capacidade: {hangar.capacity} aeronaves</p>
                  )}
                  {hangar.description && (
                    <p className="card-subtitle" style={{ marginTop: '0.5rem' }}>{hangar.description}</p>
                  )}
                </div>
                <span className={`status-badge ${hangar.isActive ? '' : 'status-inactive'}`}>
                  {hangar.isActive ? '✅ Ativo' : '❌ Inativo'}
                </span>
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

export default HangarsPage;
