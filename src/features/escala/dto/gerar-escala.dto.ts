export class GerarEscalaDto {
  mes: number;
  ano: number;
  /** ID da equipe que inicia a rotação (opcional — se omitido usa a primeria equipe ativa) */
  primeiraEquipeId?: number;
  criadoPor?: string;
}
