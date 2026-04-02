import { PartialType } from '@nestjs/mapped-types';
import { CreateEscalaDto } from './create-escala.dto';

export class UpdateEscalaDto extends PartialType(CreateEscalaDto) {
  status?: string; // RASCUNHO | PUBLICADA | ARQUIVADA
  atualizadoPor?: string;
}
