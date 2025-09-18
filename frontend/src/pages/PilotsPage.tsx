import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pilot, Club } from '../types/aviation';

const PilotsPage: React.FC = () => {
  const [pilots, setPilots] = useState<Pilot[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPilot, setEditingPilot] = useState<Pilot | null>(null);
  const [form, setForm] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    license: '',
    nickname: '',
    bloodType: '',
    address: '',
    emergencyContact: '',
    medicalInsurance: '',
    medications: '',
    restrictions: '',
    clubId: '',
    hangar: '',
    isActive: true,
  });
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get('/api/pilots'),
      api.get('/api/clubs'),
    ])
      .then(([pilotsRes, clubsRes]) => {
        setPilots(pilotsRes.data.data);
        setClubs(clubsRes.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Erro ao carregar pilotos ou clubes.');
        setLoading(false);
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    });
  };

  const resetForm = () => {
    setForm({
      name: '',
      cpf: '',
      birthDate: '',
      license: '',
      nickname: '',
      bloodType: '',
      address: '',
      emergencyContact: '',
      medicalInsurance: '',
      medications: '',
      restrictions: '',
      clubId: '',
      hangar: '',
      isActive: true,
    });
    setEditingPilot(null);
    setFormError(null);
  };

  const handleEdit = (pilot: Pilot) => {
    setEditingPilot(pilot);
    setForm({
      name: pilot.name,
      cpf: pilot.cpf,
      birthDate: pilot.birthDate.split('T')[0], // Converter para formato de input date
      license: pilot.license,
      nickname: pilot.nickname || '',
      bloodType: pilot.bloodType || '',
      address: pilot.address,
      emergencyContact: pilot.emergencyContact || '',
      medicalInsurance: pilot.medicalInsurance || '',
      medications: pilot.medications?.join(', ') || '',
      restrictions: pilot.restrictions?.join(', ') || '',
      clubId: pilot.clubId.toString(),
      hangar: pilot.hangar || '',
      isActive: pilot.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.name || !form.cpf || !form.license || !form.clubId) {
      setFormError('Nome, CPF, Licença e Aeroclube são obrigatórios.');
      return;
    }

    try {
      const submitData = {
        ...form,
        clubId: Number(form.clubId),
        medications: form.medications ? form.medications.split(',').map(m => m.trim()) : [],
        restrictions: form.restrictions ? form.restrictions.split(',').map(r => r.trim()) : [],
      };

      if (editingPilot) {
        const res = await api.put(`/api/pilots/${editingPilot.id}`, submitData);
        setPilots(pilots.map(p => p.id === editingPilot.id ? res.data.data : p));
      } else {
        const res = await api.post('/api/pilots', submitData);
        setPilots([...pilots, res.data.data]);
      }

      setShowForm(false);
      resetForm();
    } catch (err: any) {
      const errorData = err.response?.data;
      if (errorData?.errors && Array.isArray(errorData.errors)) {
        // Se há erros específicos de validação, mostra todos
        setFormError(errorData.errors.join('\n'));
      } else {
        // Caso contrário, mostra a mensagem genérica
        setFormError(errorData?.message || 'Erro ao salvar piloto.');
      }
    }
  };

  const handleDelete = async (pilot: Pilot) => {
    if (window.confirm(`Deseja realmente remover o piloto ${pilot.name}?`)) {
      try {
        await api.delete(`/api/pilots/${pilot.id}`);
        setPilots(pilots.filter(p => p.id !== pilot.id));
      } catch (err: any) {
        alert('Erro ao remover piloto.');
      }
    }
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl font-semibold text-gray-900">Carregando pilotos...</p>
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
            👨‍✈️ Gerenciamento de Pilotos
          </h1>
          <p className="text-gray-600">
            {pilots.length} piloto{pilots.length !== 1 ? 's' : ''} cadastrado{pilots.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            showForm 
              ? 'bg-gray-600 text-white hover:bg-gray-700' 
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          onClick={() => {
            if (showForm) {
              setShowForm(false);
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
        >
          {showForm ? 'Cancelar' : '+ Novo Piloto'}
        </button>
      </div>

      {/* Formulário de cadastro */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {editingPilot ? 'Editar Piloto' : 'Cadastrar Piloto'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* CPF */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CPF *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="cpf"
                value={form.cpf}
                onChange={handleInputChange}
                placeholder="00000000000"
                required
              />
            </div>

            {/* Data de Nascimento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data de Nascimento</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="birthDate"
                type="date"
                value={form.birthDate}
                onChange={handleInputChange}
              />
            </div>

            {/* Licença */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Licença *</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="license"
                value={form.license}
                onChange={handleInputChange}
                placeholder="PCH12345"
                required
              />
            </div>

            {/* Apelido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Apelido</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="nickname"
                value={form.nickname}
                onChange={handleInputChange}
              />
            </div>

            {/* Tipo Sanguíneo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tipo Sanguíneo</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="bloodType"
                value={form.bloodType}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Aeroclube */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Aeroclube *</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="clubId"
                value={form.clubId}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecione</option>
                {clubs.map((club) => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            {/* Hangar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hangar</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="hangar"
                value={form.hangar}
                onChange={handleInputChange}
              />
            </div>

            {/* Endereço */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="address"
                value={form.address}
                onChange={handleInputChange}
              />
            </div>

            {/* Contato de Emergência */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Contato de Emergência</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="emergencyContact"
                value={form.emergencyContact}
                onChange={handleInputChange}
                placeholder="Nome - Telefone"
              />
            </div>

            {/* Plano de Saúde */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plano de Saúde</label>
              <input
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="medicalInsurance"
                value={form.medicalInsurance}
                onChange={handleInputChange}
              />
            </div>

            {/* Status */}
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

            {/* Medicamentos */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Medicamentos (separados por vírgula)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="medications"
                value={form.medications}
                onChange={handleInputChange}
                rows={2}
                placeholder="Aspirina quando necessário, Medicamento XYZ"
              />
            </div>

            {/* Restrições */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Restrições (separadas por vírgula)</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                name="restrictions"
                value={form.restrictions}
                onChange={handleInputChange}
                rows={2}
                placeholder="Não voar com tempo instável, Restrição médica"
              />
            </div>

            {formError && (
              <div className="md:col-span-2 text-red-600 text-center bg-red-50 p-3 rounded-lg">
                {formError.split('\n').map((error, index) => (
                  <div key={index} className="mb-1 last:mb-0">
                    {error}
                  </div>
                ))}
              </div>
            )}

            <div className="md:col-span-2 flex gap-2 justify-end pt-4">
              <button 
                type="button" 
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors" 
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingPilot ? 'Atualizar' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid de pilotos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pilots.map((pilot) => (
          <div key={pilot.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  👨‍✈️ {pilot.name}
                </h3>
                {pilot.nickname && (
                  <p className="text-gray-600 text-sm mb-1">"{pilot.nickname}"</p>
                )}
                <p className="text-gray-600 text-sm mb-1">
                  📄 CPF: {formatCPF(pilot.cpf)}
                </p>
                <p className="text-gray-600 text-sm mb-1">
                  🆔 Licença: {pilot.license}
                </p>
                {pilot.birthDate && (
                  <p className="text-gray-600 text-sm mb-1">
                    🎂 {getAge(pilot.birthDate)} anos ({formatDate(pilot.birthDate)})
                  </p>
                )}
                <p className="text-gray-600 text-sm mb-1">
                  🏢 {pilot.clubName || 'Aeroclube não identificado'}
                </p>
                {pilot.hangar && (
                  <p className="text-gray-600 text-sm mb-1">
                    🏭 Hangar: {pilot.hangar}
                  </p>
                )}
                {pilot.bloodType && (
                  <p className="text-gray-600 text-sm mb-1">
                    🩸 Tipo: {pilot.bloodType}
                  </p>
                )}
                {pilot.emergencyContact && (
                  <p className="text-gray-600 text-sm mb-1">
                    🚨 Emergência: {pilot.emergencyContact}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  pilot.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {pilot.isActive ? '✅ Ativo' : '❌ Inativo'}
                </span>
                {pilot.isPaymentUpToDate !== undefined && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pilot.isPaymentUpToDate
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {pilot.isPaymentUpToDate ? '💳 Em dia' : '⚠️ Pendente'}
                  </span>
                )}
              </div>
            </div>

            {/* Medicamentos e Restrições */}
            {(pilot.medications && pilot.medications.length > 0) && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">💊 Medicamentos:</p>
                <p className="text-xs text-gray-600">{pilot.medications.join(', ')}</p>
              </div>
            )}

            {(pilot.restrictions && pilot.restrictions.length > 0) && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-1">⚠️ Restrições:</p>
                <p className="text-xs text-gray-600">{pilot.restrictions.join(', ')}</p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <button 
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                onClick={() => handleEdit(pilot)}
              >
                ✏️ Editar
              </button>
              <button 
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                onClick={() => handleDelete(pilot)}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {pilots.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Nenhum piloto cadastrado ainda.</p>
          <button
            className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={() => setShowForm(true)}
          >
            Cadastrar Primeiro Piloto
          </button>
        </div>
      )}
    </div>
  );
};

export default PilotsPage;