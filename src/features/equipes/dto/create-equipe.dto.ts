import { ServidoresResponseDto } from "src/features/servidores/dto/servidores-response.dto";

export class CreateEquipeDto {
  nomeEquipe: string;
  descricao?: string;
  codigoVtr: string;
  cor: string;
  status?: boolean;
  servidores?: ServidoresResponseDto[];
  criadoQuando?: Date;
  criadoPor?: string;
  atualizadoQuando?: Date;
  atualizadoPor?: string;
}
