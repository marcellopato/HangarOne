# HangarOne

<p align="center">
  <img src="docs/assets/logo.svg" alt="HangarOne Logo" width="500"/>
</p>

Sistema de gerenciamento de aeroclubes e pilotos que visa facilitar a colaboração e o compartilhamento de informações entre entusiastas da aviação.

## 🎯 Objetivos

HangarOne é uma plataforma multi-tenant que permite aos aeroclubes gerenciar:

- 👨‍✈️ Cadastro de pilotos e documentos
- ✈️ Cadastro de aeronaves
- 📅 Agendamento de voos
- 🔧 Gerenciamento de manutenção
- 📊 Relatórios de voo e desempenho
- 🏢 Controle de hangares e pagamentos
- 🔔 Notificações automatizadas

## 🛠️ Tecnologias

### Frontend
- **React 19** + TypeScript
- **CSS Customizado** (replica Tailwind CSS)
- **React Router** para navegação
- **Redux Toolkit** para estado global
- **Axios** para comunicação com API

### Backend
- **Node.js** + Express
- **MySQL** com Docker
- **JWT** para autenticação
- **Multer** para upload de arquivos
- **Sequelize** ORM (planejado)

### DevOps
- **Docker** + Docker Compose
- **Git** com GitHub
- **ESLint** + Prettier
- **Jest** para testes

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+
- Docker + Docker Compose
- Git

### Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/marcellopato/HangarOne.git
cd HangarOne
```

2. **Inicie os serviços Docker**
```bash
docker-compose up -d
```

3. **Instale dependências do Backend**
```bash
cd backend
npm install
```

4. **Instale dependências do Frontend**
```bash
cd ../frontend
npm install
```

5. **Inicie os servidores**

Backend:
```bash
cd backend
npm start
```

Frontend (em outro terminal):
```bash
cd frontend
npm start
```

### URLs dos Serviços

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3003
- **phpMyAdmin**: http://localhost:8080
- **MySQL**: localhost:3306

## 📁 Estrutura do Projeto

```
HangarOne/
├── 📁 backend/              # Servidor Node.js + Express
│   ├── 📁 src/
│   │   ├── 📁 config/       # Configurações de banco e app
│   │   ├── 📁 controllers/  # Controladores de rotas
│   │   ├── 📁 middleware/   # Middlewares personalizados
│   │   ├── 📁 models/       # Modelos de dados
│   │   ├── 📁 routes/       # Definição de rotas
│   │   ├── 📁 utils/        # Utilitários e helpers
│   │   └── server.js        # Ponto de entrada do servidor
│   ├── 📁 uploads/          # Arquivos enviados pelos usuários
│   └── package.json
├── 📁 frontend/             # App React + TypeScript
│   ├── 📁 public/           # Arquivos públicos
│   ├── 📁 src/
│   │   ├── 📁 components/   # Componentes reutilizáveis
│   │   ├── 📁 pages/        # Páginas da aplicação
│   │   ├── 📁 services/     # Serviços de API
│   │   ├── 📁 store/        # Estado global (Redux)
│   │   ├── 📁 types/        # Tipos TypeScript
│   │   ├── 📁 utils/        # Utilitários
│   │   └── index.tsx        # Ponto de entrada do React
│   └── package.json
├── 📁 docs/                 # Documentação
│   └── 📁 assets/           # Logos e imagens
├── docker-compose.yml       # Configuração Docker
└── README.md
```

## 🎨 Design System

O projeto utiliza um **CSS customizado** que replica as funcionalidades do Tailwind CSS, com tema específico para aviação:

### Paleta de Cores
- **Primary**: Azuis aeronáuticos (#1e40af, #3b82f6)
- **Secondary**: Ciano (#0891b2)
- **Accent**: Vermelho de alerta (#dc2626)
- **Success**: Verde (#059669)
- **Warning**: Âmbar (#f59e0b)

### Classes Disponíveis
- Layout: `.flex`, `.grid`, `.container`
- Spacing: `.p-*`, `.m-*`, `.px-*`, `.py-*`
- Colors: `.bg-aviation-*`, `.text-aviation-*`
- Components: `.btn`, `.card`, `.aviation-card`

## 🏗️ Funcionalidades

### ✅ Implementado
- [x] Estrutura base do projeto
- [x] Docker + MySQL configurado
- [x] Backend Node.js + Express
- [x] Frontend React + CSS customizado
- [x] Design system aviation theme
- [x] Multi-tenancy preparado

### 🚧 Em Desenvolvimento
- [ ] Sistema de autenticação
- [ ] CRUD de pilotos
- [ ] CRUD de aeronaves
- [ ] Sistema de agendamento
- [ ] Upload de documentos

### 📋 Planejado
- [ ] Relatórios avançados
- [ ] Notificações em tempo real
- [ ] Integração com sistemas externos
- [ ] Mobile app (React Native)
- [ ] API pública (MCP)

## 🗄️ Banco de Dados

### Tabelas Principais

**clubs** - Aeroclubes (Multi-tenancy)
- id, name, settings, created_at, updated_at

**pilots** - Pilotos
- id, club_id, name, nickname, blood_type, address, emergency_contact, medical_insurance, medications, restrictions, photo

**aircraft** - Aeronaves
- id, club_id, pilot_id, type, prefix, hangar_location, photo

**flights** - Voos
- id, club_id, pilot_id, aircraft_id, scheduled_date, status

**maintenance** - Manutenções
- id, aircraft_id, type, scheduled_date, completed_date, notes

**payments** - Pagamentos
- id, club_id, pilot_id, amount, due_date, paid_date, status

## 🔒 Segurança

- **Multi-tenancy**: Isolamento completo de dados por aeroclube
- **JWT Tokens**: Autenticação segura
- **Sanitização**: Validação de inputs
- **File Upload**: Validação de tipos de arquivo
- **Rate Limiting**: Proteção contra ataques

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Marcello Pato**
- GitHub: [@marcellopato](https://github.com/marcellopato)
- Email: marcellocorreia@gmail.com

---

<p align="center">
  Feito com ❤️ para a comunidade aeronáutica brasileira
</p>