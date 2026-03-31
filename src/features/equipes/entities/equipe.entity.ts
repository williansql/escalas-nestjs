export class Equipe {
  id: number;
  nomeEquipe: string;
  descricao?: string;
  codigoVtr: string;
  cor: string;
  status: boolean;
  servidoresId: number[];
  criadoQuando: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
