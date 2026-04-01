export class Afastamento {
  id: number;
  servidorId: number;
  servidor?: any;
  tipoAfastamento: string;
  dataInicio: Date;
  dataFim: Date;
  motivo: string;
  status: boolean;
  criadoQuando: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
