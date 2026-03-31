import { PartialType } from '@nestjs/mapped-types';
import { CreateServidoresDto } from './create-servidores.dto';

export class UpdateServidoresDto extends PartialType(CreateServidoresDto) {}
