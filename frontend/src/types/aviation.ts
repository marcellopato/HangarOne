// Modelos e relacionamentos principais do domínio de Aeroclubes

export interface Hangar {
  id: number;
  name: string;
  clubId: number; // Aeroclube ao qual pertence
}

export interface Pilot {
  id: number;
  name: string;
  cpf: string;
  address: string;
  nickname: string;
  birthDate: string; // ISO
  license: string; // letras e números
  clubId: number; // Aeroclube ao qual pertence
}

export interface Aircraft {
  id: number;
  prefix: string; // letras e números
  description: string;
  type: string;
  engine: string;
  year: number;
  status: 'operational' | 'inoperational';
  clubId: number; // Aeroclube ao qual pertence
  hangarId: number; // Hangar onde está
  ownerPilotIds: number[]; // IDs dos pilotos que são donos
}

export interface Club {
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
