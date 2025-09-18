require('dotenv').config();
const express = require('express');

// Importar rotas e controllers
const apiRoutes = require('./routes');
const UserController = require('./controllers/UserController');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware básico para parsing de JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS simples
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware de log básico
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Middleware para servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rotas básicas
app.get('/', (req, res) => {
  res.json({
    message: '🚁 HangarOne API - Sistema de Gerenciamento de Aeroclubes',
    version: '1.0.0',
    status: 'online',
    timestamp: new Date().toISOString(),
    documentation: {
      health: '/health',
      api: '/api/info',
      clubs: '/api/clubs'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Usar rotas da API
app.use('/api', apiRoutes);

// Middleware de tratamento de erro 404 (deve vir DEPOIS das rotas)
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint não encontrado',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro:', err.message);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado!'
  });
});

// Inicializar dados padrão
UserController.initializeDefaultUsers();

app.listen(PORT, () => {
  console.log(`🚁 HangarOne Backend rodando na porta ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
});