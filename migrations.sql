CREATE TABLE tenants (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
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

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    aeroclube_id INT NOT NULL,
    role_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE aeroclubes (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    endereco VARCHAR(255),
    cpf_dono VARCHAR(11) NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cpf_dono)
);

CREATE TABLE hangares (
    id SERIAL PRIMARY KEY,
    aeroclube_id INT NOT NULL,
    nome VARCHAR(255) NOT NULL,
    localizacao VARCHAR(255),
    capacidade INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE
);

CREATE TABLE pilotos (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) UNIQUE NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    apelido VARCHAR(100),
    data_nasc DATE NOT NULL,
    licenca VARCHAR(10) UNIQUE NOT NULL,
    aeroclube_id INT NOT NULL,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE
);

CREATE TABLE aeronaves (
    id SERIAL PRIMARY KEY,
    prefixo VARCHAR(10) NOT NULL UNIQUE,
    descricao TEXT NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    motor VARCHAR(50) NOT NULL,
    ano INT NOT NULL CHECK (ano > 1900 AND ano <= EXTRACT(YEAR FROM CURRENT_DATE)),
    status_operacao BOOLEAN NOT NULL DEFAULT TRUE,
    aeroclube_id INT NOT NULL,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE
);

CREATE TABLE aeronave_hangar_assignments (
    id SERIAL PRIMARY KEY,
    aeronave_id INT NOT NULL,
    hangar_id INT NOT NULL,
    aeroclube_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (aeronave_id) REFERENCES aeronaves(id) ON DELETE CASCADE,
    FOREIGN KEY (hangar_id) REFERENCES hangares(id) ON DELETE CASCADE,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE,
    UNIQUE (aeronave_id, hangar_id, aeroclube_id)
);

CREATE TABLE aeroclube_user_roles (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    aeroclube_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE,
    UNIQUE (user_id, role_id, aeroclube_id)
);

-- Migration to create necessary indexes and constraints for the HangarOne database

-- Indexes for aeroclubes table
CREATE INDEX idx_aeroclubes_owner_id ON aeroclubes(owner_id);
CREATE INDEX idx_aeroclubes_name ON aeroclubes(name);

-- Indexes for hangares table
CREATE INDEX idx_hangares_aeroclube_id ON hangares(aeroclube_id);
CREATE INDEX idx_hangares_location ON hangares(location);

-- Indexes for pilotos table
CREATE INDEX idx_pilotos_cpf ON pilotos(cpf);
CREATE INDEX idx_pilotos_license ON pilotos(license);

-- Indexes for aeronaves table
CREATE INDEX idx_aeronaves_prefix ON aeronaves(prefix);
CREATE INDEX idx_aeronaves_aeroclube_id ON aeronaves(aeroclube_id);

-- Indexes for aeronave_hangar_assignments table
CREATE INDEX idx_aeronave_hangar_assignments_aeronave_id ON aeronave_hangar_assignments(aeronave_id);
CREATE INDEX idx_aeronave_hangar_assignments_hangar_id ON aeronave_hangar_assignments(hangar_id);

-- Constraints for users table
ALTER TABLE users ADD CONSTRAINT fk_users_aeroclube FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE;

-- Constraints for pilotos table
ALTER TABLE pilotos ADD CONSTRAINT uq_pilotos_cpf UNIQUE (cpf);
ALTER TABLE pilotos ADD CONSTRAINT uq_pilotos_license UNIQUE (license);

-- Constraints for aeronaves table
ALTER TABLE aeronaves ADD CONSTRAINT uq_aeronaves_prefix UNIQUE (prefix);
ALTER TABLE aeronaves ADD CONSTRAINT fk_aeronaves_aeroclube FOREIGN KEY (aeroclube_id) REFERENCES aeroclubes(id) ON DELETE CASCADE;

-- Constraints for aeronave_hangar_assignments table
ALTER TABLE aeronave_hangar_assignments ADD CONSTRAINT fk_aeronave_hangar_assignments_aeronave FOREIGN KEY (aeronave_id) REFERENCES aeronaves(id) ON DELETE CASCADE;
ALTER TABLE aeronave_hangar_assignments ADD CONSTRAINT fk_aeronave_hangar_assignments_hangar FOREIGN KEY (hangar_id) REFERENCES hangares(id) ON DELETE CASCADE;

