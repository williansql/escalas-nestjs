
export class CreateEquipeDto {
  nomeEquipe: string;
  descricao?: string;
  codigoVtr: string;
  cor: string;
  status?: boolean;
  servidores: [
    { id: number }
  ];
  criadoQuando?: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
