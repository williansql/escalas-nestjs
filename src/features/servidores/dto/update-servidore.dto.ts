import { PartialType } from '@nestjs/mapped-types';
import { CreateServidoreDto } from './create-servidore.dto';

export class UpdateServidoreDto extends PartialType(CreateServidoreDto) {}
