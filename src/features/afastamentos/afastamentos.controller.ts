import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AfastamentosService } from './afastamentos.service';
import { CreateAfastamentoDto } from './dto/create-afastamento.dto';
import { UpdateAfastamentoDto } from './dto/update-afastamento.dto';

@Controller('afastamentos')
export class AfastamentosController {
  constructor(private readonly afastamentosService: AfastamentosService) {}

  @Post()
  create(@Body() createAfastamentoDto: CreateAfastamentoDto) {
    return this.afastamentosService.create(createAfastamentoDto);
  }

  @Get()
  findAll() {
    return this.afastamentosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.afastamentosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAfastamentoDto: UpdateAfastamentoDto) {
    return this.afastamentosService.update(+id, updateAfastamentoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.afastamentosService.remove(+id);
  }
}
