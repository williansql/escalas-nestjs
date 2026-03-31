import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServidoresDto } from './dto/create-servidores.dto';
import { UpdateServidoresDto } from './dto/update-servidores.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class ServidoresService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createServidoresDto: CreateServidoresDto) {
    const existeCpf = await this.prisma.servidores.findFirst({
      where: { cpf: createServidoresDto.cpf },
    });
    const existeMatricula = await this.prisma.servidores.findFirst({
      where: { matricula: createServidoresDto.matricula },
    });

    if (existeCpf) {
      throw new HttpException('CPF já existe', HttpStatus.CONFLICT);
    }

    if (existeMatricula) {
      throw new HttpException('Matrícula já existe', HttpStatus.CONFLICT);
    }

    return this.prisma.servidores.create({
      data: {
        nomeCompleto: createServidoresDto.nomeCompleto,
        matricula: createServidoresDto.matricula,
        cpf: createServidoresDto.cpf,
        funcao: createServidoresDto.funcao,
        equipe: createServidoresDto.equipe,
        status: createServidoresDto.status,
        cargaHoraria: createServidoresDto.cargaHoraria,
        criadoQuando: new Date(),
        criadoPor: createServidoresDto.criadoPor,
      },
    });
  }

  async findAll() {
    return this.prisma.servidores.findMany();
  }

  async findOne(id: number) {
    return this.prisma.servidores.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateServidoresDto: UpdateServidoresDto) {
    return this.prisma.servidores.update({
      where: { id },
      data: { ...updateServidoresDto },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.servidores.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            'Servidor não encontrado',
            HttpStatus.NOT_FOUND,
          );
        }
      }
      throw new HttpException(
        'Erro ao deletar servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
