export class Equipe {
  id: number;
  nomeEquipe: string;
  descricao?: string;
  codigoVtr: string;
  cor: string;
  status: boolean;
  servidoresId: number[];
  servidores?: any[]; // Adicionado para incluir os objetos dos servidores
  criadoQuando: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
