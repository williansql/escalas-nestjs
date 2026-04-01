export class CreateAfastamentoDto {
  id?: number;
  servidorId?: number;
  servidor?: {
    id: number;
  };
  tipo?: string;
  dataInicio: Date;
  dataFim: Date;
  motivo?: string;
  observacao?: string;
  status?: boolean;
  criadoQuando?: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
