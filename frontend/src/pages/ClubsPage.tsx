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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #0066cc',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          animation: 'spin 2s linear infinite',
          marginBottom: '20px'
        }}></div>
        <p style={{ color: '#666', fontSize: '16px' }}>Carregando aeroclubes...</p>
        <style>{
          `@keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }`
        }</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          padding: '20px',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#c33', marginBottom: '10px' }}>Erro</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>{error}</p>
          <button 
            onClick={handleRetry}
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <div style={{
          backgroundColor: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '400px'
        }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Nenhum aeroclube encontrado</h2>
          <p style={{ color: '#666', marginBottom: '20px' }}>Ainda não há aeroclubes cadastrados no sistema.</p>
          <button 
            onClick={() => console.log('Criar novo aeroclube')}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Cadastrar Aeroclube
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <div>
            <h1 style={{ color: '#333', margin: '0 0 5px 0' }}>Aeroclubes</h1>
            <p style={{ color: '#666', margin: '0' }}>{clubs.length} aeroclube{clubs.length !== 1 ? 's' : ''} cadastrado{clubs.length !== 1 ? 's' : ''}</p>
          </div>
          <button 
            onClick={() => console.log('Novo aeroclube')}
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            + Novo Aeroclube
          </button>
        </header>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '20px'
        }}>
          {clubs.map((club) => (
            <div key={club.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e0e0e0'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '15px'
              }}>
                <div>
                  <h3 style={{ color: '#333', margin: '0 0 5px 0' }}>{club.name}</h3>
                  <p style={{ color: '#666', margin: '0', fontSize: '14px' }}>{club.location}</p>
                </div>
                <span style={{
                  backgroundColor: club.status === 'active' ? '#d4edda' : '#f8d7da',
                  color: club.status === 'active' ? '#155724' : '#721c24',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {club.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '15px'
              }}>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#0066cc' }}>{club.pilots_count}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Pilotos</div>
                </div>
                <div style={{ textAlign: 'center', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#28a745' }}>{club.aircraft_count}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Aeronaves</div>
                </div>
              </div>
              
              <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
                Fundado em: {new Date(club.founded).toLocaleDateString('pt-BR')}
              </div>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button style={{
                  flex: 1,
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Ver Detalhes
                </button>
                <button style={{
                  flex: 1,
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;