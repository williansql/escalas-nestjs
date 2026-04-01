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
        servidoresId: createEquipeDto.servidores ?? [],
        criadoQuando: new Date(),
        criadoPor: createEquipeDto.criadoPor,
      },
    });
  }

  async findAll() {
    const equipes = await this.prisma.equipes.findMany();
    const allServidoresIds = equipes.flatMap(equipe => equipe.servidoresId as number[] || []);
    const uniqueServidoresIds = Array.from(new Set(allServidoresIds));
    const servidores = await this.prisma.servidores.findMany({
      where: { id: { in: uniqueServidoresIds } },
    });
    const servidoresMap = new Map(servidores.map(servidor => [servidor.id, servidor]));

    return equipes.map(equipe => ({
      ...equipe,
      servidores: (equipe.servidoresId as number[] || []).map(id => servidoresMap.get(id)).filter(Boolean),
    }));
  }

  async findOne(id: number) {
    const equipe = await this.prisma.equipes.findUnique({
      where: { id },
    });

    if (!equipe) {
      throw new HttpException('Equipe não encontrada', HttpStatus.NOT_FOUND);
    }

    const servidoresIds = equipe.servidoresId as number[] || [];
    const servidores = await this.prisma.servidores.findMany({
      where: { id: { in: servidoresIds } },
    });

    return {
      ...equipe,
      servidores,
    };
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
