import { Injectable } from '@nestjs/common';
import { CreateServidoreDto } from './dto/create-servidore.dto';
import { UpdateServidoreDto } from './dto/update-servidore.dto';

@Injectable()
export class ServidoresService {
  create(createServidoreDto: CreateServidoreDto) {
    return 'This action adds a new servidore';
  }

  findAll() {
    return `This action returns all servidores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} servidore`;
  }

  update(id: number, updateServidoreDto: UpdateServidoreDto) {
    return `This action updates a #${id} servidore`;
  }

  remove(id: number) {
    return `This action removes a #${id} servidore`;
  }
}
