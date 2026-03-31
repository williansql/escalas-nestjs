import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAfastamentoDto } from './dto/create-afastamento.dto';
import { UpdateAfastamentoDto } from './dto/update-afastamento.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class AfastamentosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAfastamentoDto: CreateAfastamentoDto) {
    return this.prisma.afastamentos.create({
      data: {
        servidorId: createAfastamentoDto.servidorId,
        tipoAfastamento: createAfastamentoDto.tipo ?? '',
        dataInicio: new Date(createAfastamentoDto.dataInicio),
        dataFim: new Date(createAfastamentoDto.dataFim),
        motivo: createAfastamentoDto.motivo ?? createAfastamentoDto.observacao ?? '',
        status: createAfastamentoDto.status ?? true,
        criadoQuando: new Date(),
        criadoPor: createAfastamentoDto.criadoPor,
      },
    });
  }

  async findAll() {
    return this.prisma.afastamentos.findMany();
  }

  async findOne(id: number) {
    return this.prisma.afastamentos.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAfastamentoDto: UpdateAfastamentoDto) {
    const data: any = { ...updateAfastamentoDto };

    if (updateAfastamentoDto.dataInicio) {
      data.dataInicio = new Date(updateAfastamentoDto.dataInicio);
    }
    if (updateAfastamentoDto.dataFim) {
      data.dataFim = new Date(updateAfastamentoDto.dataFim);
    }
    if (updateAfastamentoDto.observacao) {
      data.motivo = updateAfastamentoDto.observacao;
    }
    if (updateAfastamentoDto.tipo) {
      data.tipoAfastamento = updateAfastamentoDto.tipo;
      delete data.tipo;
    }

    return this.prisma.afastamentos.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.afastamentos.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Afastamento não encontrado', HttpStatus.NOT_FOUND);
        }
      }
      throw new HttpException('Erro ao deletar afastamento', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
