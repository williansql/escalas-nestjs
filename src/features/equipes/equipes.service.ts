import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEquipeDto } from './dto/create-equipe.dto';
import { UpdateEquipeDto } from './dto/update-equipe.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class EquipesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEquipeDto: CreateEquipeDto) {
    return this.prisma.equipes.create({
      data: {
        nomeEquipe: createEquipeDto.nomeEquipe,
        descricao: createEquipeDto.descricao ?? '',
        codigoVtr: createEquipeDto.codigoVtr,
        cor: createEquipeDto.cor,
        status: createEquipeDto.status ?? true,
        servidoresId: createEquipeDto.servidoresId ?? [],
        criadoQuando: new Date(),
        criadoPor: createEquipeDto.criadoPor,
      },
    });
  }

  async findAll() {
    return this.prisma.equipes.findMany();
  }

  async findOne(id: number) {
    return this.prisma.equipes.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateEquipeDto: UpdateEquipeDto) {
    return this.prisma.equipes.update({
      where: { id },
      data: { ...updateEquipeDto },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.equipes.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Equipe não encontrada', HttpStatus.NOT_FOUND);
        }
      }
      throw new HttpException('Erro ao deletar equipe', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
