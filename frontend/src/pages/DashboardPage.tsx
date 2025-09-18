import React from 'react';
import { BarChart3, Users, Plane, Building2 } from 'lucide-react';

const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do sistema HangarOne</p>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Aeroclubes</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-full">
              <Building2 size={24} className="text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Pilotos</p>
              <p className="text-3xl font-bold text-gray-900">83</p>
            </div>
            <div className="p-3 bg-green-50 rounded-full">
              <Users size={24} className="text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Aeronaves</p>
              <p className="text-3xl font-bold text-gray-900">20</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-full">
              <Plane size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Aeronaves Ativas</p>
              <p className="text-3xl font-bold text-gray-900">2</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-full">
              <BarChart3 size={24} className="text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Atividade Recente */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Atividade Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-blue-100 rounded-full">
                <Building2 size={16} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Aeroclube de São Paulo foi atualizado</p>
                <p className="text-xs text-gray-500">Há 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-green-100 rounded-full">
                <Users size={16} className="text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Novo piloto cadastrado</p>
                <p className="text-xs text-gray-500">Há 4 horas</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="p-2 bg-purple-100 rounded-full">
                <Plane size={16} className="text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Aeronave PT-ABC passou por manutenção</p>
                <p className="text-xs text-gray-500">Ontem</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;