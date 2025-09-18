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
      api.get('/hangars'),
      api.get('/clubs'),
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
      const res = await api.post('/hangars', {
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
    return <div className="flex-center loading-container"><div className="spinner" />Carregando hangares...</div>;
  }
  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hangares</h1>
      <button className="btn btn-primary mb-4" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancelar' : 'Novo Hangar'}
      </button>
      {showForm && (
        <form className="card p-4 mb-4" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label className="block mb-1">Nome</label>
            <input className="input" name="name" value={form.name} onChange={handleInputChange} required />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Aeroclube</label>
            <select className="input" name="clubId" value={form.clubId} onChange={handleInputChange} required>
              <option value="">Selecione</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Localização</label>
            <input className="input" name="location" value={form.location} onChange={handleInputChange} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Capacidade</label>
            <input className="input" name="capacity" type="number" min={1} value={form.capacity} onChange={handleInputChange} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Descrição</label>
            <input className="input" name="description" value={form.description} onChange={handleInputChange} />
          </div>
          <div className="mb-2">
            <label className="block mb-1">Ativo?</label>
            <select className="input" name="isActive" value={form.isActive ? 'true' : 'false'} onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}>
              <option value="true">Sim</option>
              <option value="false">Não</option>
            </select>
          </div>
          {formError && <div className="text-red-500 mb-2">{formError}</div>}
          <button className="btn btn-success" type="submit">Salvar</button>
        </form>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hangars.map((hangar) => (
          <div key={hangar.id} className="card p-4">
            <h2 className="font-bold text-lg mb-2">{hangar.name}</h2>
            <div className="text-sm text-gray-600 mb-1">Aeroclube: {clubs.find(c => c.id === hangar.clubId)?.name || hangar.clubId}</div>
            {hangar.location && <div className="text-sm mb-1">Localização: {hangar.location}</div>}
            {typeof hangar.capacity !== 'undefined' && <div className="text-sm mb-1">Capacidade: {hangar.capacity}</div>}
            {hangar.description && <div className="text-sm mb-1">{hangar.description}</div>}
            <div className="text-xs text-gray-400 mt-2">ID: {hangar.id}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HangarsPage;
