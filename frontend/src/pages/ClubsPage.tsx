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
        height: '50vh',
        flexDirection: 'column'
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
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
        height: '50vh',
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
        padding: '2rem',
        textAlign: 'center'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '3rem 2rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏢</div>
          <h2 style={{ color: '#1e293b', marginBottom: '1rem', fontSize: '1.5rem' }}>
            Nenhum aeroclube encontrado
          </h2>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>
            Ainda não há aeroclubes cadastrados no sistema.
          </p>
          <button 
            onClick={() => console.log('Criar novo aeroclube')}
            style={{
              backgroundColor: '#0066cc',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            + Cadastrar Primeiro Aeroclube
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '1.875rem', 
              fontWeight: '700', 
              color: '#1e293b', 
              margin: '0 0 0.5rem 0' 
            }}>
              🏢 Gerenciamento de Aeroclubes
            </h1>
            <p style={{ 
              color: '#64748b', 
              margin: '0',
              fontSize: '1rem' 
            }}>
              {clubs.length} aeroclube{clubs.length !== 1 ? 's' : ''} cadastrado{clubs.length !== 1 ? 's' : ''}
            </p>
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
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <span>+</span>
            Novo Aeroclube
          </button>
        </div>

        {/* Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {clubs.map((club) => (
            <div key={club.id} style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease'
            }}>
              
              {/* Club Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ 
                    color: '#1e293b', 
                    margin: '0 0 0.25rem 0',
                    fontSize: '1.25rem',
                    fontWeight: '600'
                  }}>
                    {club.name}
                  </h3>
                  <p style={{ 
                    color: '#64748b', 
                    margin: '0',
                    fontSize: '0.9rem'
                  }}>
                    📍 {club.location}
                  </p>
                </div>
                
                <span style={{
                  backgroundColor: club.status === 'active' ? '#dcfce7' : '#fef2f2',
                  color: club.status === 'active' ? '#166534' : '#dc2626',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {club.status === 'active' ? '✅ Ativo' : '❌ Inativo'}
                </span>
              </div>
              
              {/* Stats */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                marginBottom: '1rem'
              }}>
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#0066cc',
                    marginBottom: '0.25rem'
                  }}>
                    {club.pilots_count}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    👨‍✈️ Pilotos
                  </div>
                </div>
                
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '700', 
                    color: '#28a745',
                    marginBottom: '0.25rem'
                  }}>
                    {club.aircraft_count}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    ✈️ Aeronaves
                  </div>
                </div>
              </div>
              
              {/* Founded Date */}
              <div style={{ 
                fontSize: '0.8rem', 
                color: '#64748b', 
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                📅 Fundado em {new Date(club.founded).toLocaleDateString('pt-BR')}
              </div>
              
              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button style={{
                  flex: 1,
                  backgroundColor: '#0066cc',
                  color: 'white',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#004d99'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0066cc'}
                >
                  👁️ Ver Detalhes
                </button>
                
                <button style={{
                  flex: 1,
                  backgroundColor: '#64748b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#475569'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#64748b'}
                >
                  ✏️ Editar
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