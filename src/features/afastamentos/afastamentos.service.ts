import { Injectable } from '@nestjs/common';
import { CreateAfastamentoDto } from './dto/create-afastamento.dto';
import { UpdateAfastamentoDto } from './dto/update-afastamento.dto';

@Injectable()
export class AfastamentosService {
  create(createAfastamentoDto: CreateAfastamentoDto) {
    return 'This action adds a new afastamento';
  }

  findAll() {
    return `This action returns all afastamentos`;
  }

  findOne(id: number) {
    return `This action returns a #${id} afastamento`;
  }

  update(id: number, updateAfastamentoDto: UpdateAfastamentoDto) {
    return `This action updates a #${id} afastamento`;
  }

  remove(id: number) {
    return `This action removes a #${id} afastamento`;
  }
}
