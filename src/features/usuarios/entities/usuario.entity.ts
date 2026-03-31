export class Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  senha: string;
  secretaria: string;
  orgao: string;
  role?: string;
  refreshToken?: string;
  criadoQuando: Date;
  criadoPor: string;
  atualizadoQuando: Date;
  atualizadoPor: string;
}
