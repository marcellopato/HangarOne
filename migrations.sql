CREATE TABLE roles (
    id INT PRIMARY KEY auto_increment NOT NULL,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO roles (name, description) VALUES
('superadmin', 'Full access to all records and settings'),
('admin', 'Owner of an aeroclube with management rights'),
('manager', 'Manages the operations of an aeroclube'),
('pilot', 'Client of the aeroclube with rights to manage their aircraft');

CREATE TABLE aeroclubes (
    id INT PRIMARY KEY auto_increment NOT NULL,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id INT PRIMARY KEY auto_increment NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    endereco VARCHAR(255),
    apelido VARCHAR(100),
    data_nasc DATE NOT NULL,
    licenca VARCHAR(10),
    aeroclube_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE hangares (
    id INT PRIMARY KEY auto_increment NOT NULL,
    aeroclube_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255),
    capacidade INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE
);

CREATE TABLE aeronaves (
    id INT PRIMARY KEY auto_increment NOT NULL,
    prefixo VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    motor VARCHAR(50) NOT NULL,
    ano INT NOT NULL,
    status_operacao BOOLEAN NOT NULL DEFAULT TRUE,
    user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE aeronave_hangar_assignments (
    id INT PRIMARY KEY auto_increment NOT NULL,
    aeronave_id INT NOT NULL,
    hangar_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aeronave_id) REFERENCES aeronaves(id) ON DELETE CASCADE,
    FOREIGN KEY (hangar_id) REFERENCES hangares(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (aeronave_id, hangar_id)
);

CREATE TABLE aeroclube_user_roles (
    id int PRIMARY KEY auto_increment NOT NULL,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    aeroclube_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id, aeroclube_id)
);

-- Migration to create necessary indexes and constraints for the HangarOne database

-- Indexes for aeroclubes table
CREATE INDEX idx_aeroclubes_nome ON aeroclubes(nome);

-- Indexes for hangares table
CREATE INDEX idx_hangares_aeroclube_id ON hangares(id);

-- Indexes for pilotos table

-- Indexes for aeronaves table
CREATE INDEX idx_aeronaves_prefixo ON aeronaves(prefixo);
CREATE INDEX idx_aeronaves_aeroclube_id ON aeronaves(id);

-- Indexes for aeronave_hangar_assignments table
CREATE INDEX idx_aeronave_hangar_assignments_aeronave_id ON aeronave_hangar_assignments(id);
CREATE INDEX idx_aeronave_hangar_assignments_hangar_id ON aeronave_hangar_assignments(id);

-- Constraints for users table
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_license ON users(licenca);
ALTER TABLE users ADD CONSTRAINT fk_users_aeroclube FOREIGN KEY (id) REFERENCES aeroclubes(id) ON DELETE CASCADE;

-- Constraints for aeronaves table
ALTER TABLE aeronaves ADD CONSTRAINT uq_aeronaves_prefixo UNIQUE (prefixo);

-- Constraints for aeronave_hangar_assignments table
ALTER TABLE aeronave_hangar_assignments ADD CONSTRAINT fk_aeronave_hangar_assignments_aeronave FOREIGN KEY (id) REFERENCES aeronaves(id) ON DELETE CASCADE;
ALTER TABLE aeronave_hangar_assignments ADD CONSTRAINT fk_aeronave_hangar_assignments_hangar FOREIGN KEY (id) REFERENCES hangares(id) ON DELETE CASCADE;

