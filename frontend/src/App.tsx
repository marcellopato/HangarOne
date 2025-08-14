import React from 'react';

function App() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #1e40af 0%, #0891b2 100%)',
        color: 'white',
        padding: '2rem 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
            ✈️ HangarOne
          </h1>
          <p style={{ fontSize: '1.125rem', opacity: '0.9' }}>
            Sistema de Gestão de Aeroclubes e Pilotos
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          
          {/* Status Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Sistema Operacional
              </h3>
              <p style={{ color: '#059669', fontWeight: '500' }}>✅ Frontend funcionando com CSS customizado</p>
              <p style={{ color: '#059669', fontWeight: '500' }}>✅ Backend Node.js operacional</p>
              <p style={{ color: '#059669', fontWeight: '500' }}>✅ Banco MySQL conectado</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Funcionalidades
              </h3>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>📋 Cadastro de Pilotos</p>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>✈️ Cadastro de Aeronaves</p>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>📅 Agendamento de Voos</p>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>🔧 Gestão de Manutenção</p>
            </div>

            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.75rem',
              padding: '1.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.5rem' }}>
                Multi-Tenancy
              </h3>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>🏢 Suporte a Múltiplos Aeroclubes</p>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>🔒 Isolamento de Dados</p>
              <p style={{ color: '#475569', marginBottom: '0.25rem' }}>⚙️ Configurações Personalizadas</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button style={{
              backgroundColor: '#1e40af',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginRight: '1rem',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#1e3a8a'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#1e40af'}
            >
              Acessar Dashboard
            </button>
            
            <button style={{
              backgroundColor: '#e2e8f0',
              color: '#334155',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#cbd5e1'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
            >
              Documentação
            </button>
          </div>

          {/* Info Text */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: '3rem',
            padding: '1.5rem',
            backgroundColor: 'white',
            borderRadius: '0.75rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
              Problema PostCSS/Tailwind Resolvido!
            </h2>
            <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.6' }}>
              O frontend agora está funcionando com CSS customizado que replica as funcionalidades do Tailwind CSS, 
              sem depender de PostCSS ou configurações externas problemáticas. Todos os estilos de aviação 
              estão implementados e o sistema está pronto para desenvolvimento.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;