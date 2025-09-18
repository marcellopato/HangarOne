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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-900">Carregando hangares...</p>
          </div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Erro</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🏠 Gerenciamento de Hangares
            </h1>
            <p className="text-gray-600">
              {hangars.length} hangar{hangars.length !== 1 ? 'es' : ''} cadastrado{hangars.length !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              showForm 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? 'Cancelar' : '+ Novo Hangar'}
          </button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-lg mx-auto mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Cadastrar Hangar</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Aeroclube</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="clubId"
                  value={form.clubId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  {clubs && clubs.map((club) => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="location"
                  value={form.location}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Capacidade</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="capacity"
                  type="number"
                  min={1}
                  value={form.capacity}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                <input
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="description"
                  value={form.description}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  name="isActive"
                  value={form.isActive ? 'true' : 'false'}
                  onChange={e => setForm({ ...form, isActive: e.target.value === 'true' })}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
                </select>
              </div>
              {formError && <div className="text-red-600 text-center">{formError}</div>}
              <div className="flex gap-2 justify-end pt-4">
                <button 
                  type="button" 
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" 
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Grid de hangares */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hangars.map((hangar) => (
            <div key={hangar.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🏠 {hangar.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    Aeroclube: {clubs && clubs.length > 0 ? (clubs.find(c => c.id === hangar.clubId)?.name || `ID: ${hangar.clubId}`) : 'Carregando...'}
                  </p>
                  {hangar.location && (
                    <p className="text-gray-600 text-sm mb-1">📍 {hangar.location}</p>
                  )}
                  {typeof hangar.capacity !== 'undefined' && (
                    <p className="text-gray-600 text-sm mb-1">✈️ Capacidade: {hangar.capacity} aeronaves</p>
                  )}
                  {hangar.description && (
                    <p className="text-gray-600 text-sm mt-2">{hangar.description}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  hangar.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {hangar.isActive ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  👁️ Ver Detalhes
                </button>
                <button className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium">
                  ✏️ Editar
                </button>
              </div>
            </div>
          ))}
        </div>
    </div>
  );
};

export default HangarsPage;
