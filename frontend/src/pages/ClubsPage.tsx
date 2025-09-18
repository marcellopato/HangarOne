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
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h1 className="text-xl font-semibold text-gray-900">Carregando aeroclubes...</h1>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Erro</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleRetry}
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
              🏢 Gerenciamento de Aeroclubes
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              {clubs.length} aeroclube{clubs.length !== 1 ? 's' : ''} cadastrado{clubs.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                👨‍✈️ {clubs.reduce((acc, club) => acc + club.pilots_count, 0)} pilotos
              </span>
              <span className="flex items-center gap-1">
                ✈️ {clubs.reduce((acc, club) => acc + club.aircraft_count, 0)} aeronaves
              </span>
              <span className="flex items-center gap-1">
                ✅ {clubs.filter(club => club.status === 'active').length} ativos
              </span>
            </div>
          </div>
          <button 
            className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
              showForm 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <>
                <span>×</span>
                Cancelar
              </>
            ) : (
              <>
                <span className="text-lg">+</span>
                Novo Aeroclube
              </>
            )}
          </button>
        </div>

        {/* Formulário de cadastro */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">🏢 Cadastrar Aeroclube</h2>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Aeroclube</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Ex: Aeroclube de São Paulo"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CNPJ</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.cnpj}
                  onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                  placeholder="XX.XXX.XXX/XXXX-XX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Ex: São Paulo, SP"
                  required
                />
              </div>

              {formError && (
                <div className="text-red-600 text-sm text-center">
                  {formError}
                </div>
              )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <div key={club.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    🏢 {club.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">
                    📍 {club.location}
                  </p>
                  <p className="text-gray-600 text-sm mb-1">
                    📅 Fundado em {new Date(club.founded).getFullYear()}
                  </p>
                  {club.cnpj && (
                    <p className="text-gray-600 text-sm">
                      🏛️ CNPJ: {club.cnpj}
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  club.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {club.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              
              {/* Estatísticas do clube */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">👨‍✈️</div>
                  <div className="text-xl font-bold text-blue-600">{club.pilots_count}</div>
                  <div className="text-xs text-gray-500">Pilotos</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-2xl mb-1">✈️</div>
                  <div className="text-xl font-bold text-green-600">{club.aircraft_count}</div>
                  <div className="text-xs text-gray-500">Aeronaves</div>
                </div>
              </div>

              <div className="flex gap-2">
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

export default ClubsPage;