import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateServidoresDto } from './dto/create-servidores.dto';
import { UpdateServidoresDto } from './dto/update-servidores.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class ServidoresService {
  constructor(private readonly prisma: PrismaService) {}

  private getEquipeIdFromPayload(payload: CreateServidoresDto | UpdateServidoresDto): number | undefined {
    if (payload.equipeId != null) {
      return payload.equipeId;
    }

    if (payload.equipe?.id != null) {
      return payload.equipe.id;
    }

    return undefined;
  }

  private async loadEquipe(equipeId: number) {
    const equipe = await this.prisma.equipes.findUnique({
      where: { id: equipeId },
    });

    if (!equipe) {
      throw new HttpException('Equipe não encontrada', HttpStatus.BAD_REQUEST);
    }

    return equipe;
  }

  private async addServidorToEquipe(equipeId: number, servidorId: number) {
    const equipe = await this.loadEquipe(equipeId);
    const servidoresId = Array.isArray(equipe.servidoresId) ? equipe.servidoresId : [];

    if (!servidoresId.includes(servidorId)) {
      servidoresId.push(servidorId);
      await this.prisma.equipes.update({
        where: { id: equipeId },
        data: { servidoresId },
      });
    }
  }

  private async removeServidorFromEquipe(equipeId: number, servidorId: number) {
    const equipe = await this.prisma.equipes.findUnique({
      where: { id: equipeId },
    });

    if (!equipe) {
      return;
    }

    const servidoresId = Array.isArray(equipe.servidoresId) ? equipe.servidoresId : [];
    const updatedIds = servidoresId.filter(id => id !== servidorId);

    if (updatedIds.length !== servidoresId.length) {
      await this.prisma.equipes.update({
        where: { id: equipeId },
        data: { servidoresId: updatedIds },
      });
    }
  }

  private async buildServidorWithEquipe(servidor: any) {
    if (!servidor) {
      return null;
    }

    const equipe = servidor.equipeId
      ? await this.prisma.equipes.findUnique({ where: { id: servidor.equipeId } })
      : null;

    return {
      ...servidor,
      equipeId: equipe,
    };
  }

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

    const equipeId = this.getEquipeIdFromPayload(createServidoresDto);

    if (equipeId == null) {
      throw new HttpException('Selecionar a equipe é obrigatório', HttpStatus.BAD_REQUEST);
    }

    await this.loadEquipe(equipeId);

    const servidor = await this.prisma.servidores.create({
      data: {
        nomeCompleto: createServidoresDto.nomeCompleto,
        matricula: createServidoresDto.matricula,
        cpf: createServidoresDto.cpf,
        equipeId,
        funcao: createServidoresDto.funcao,
        status: createServidoresDto.status,
        cargaHoraria: createServidoresDto.cargaHoraria,
        criadoQuando: new Date(),
        criadoPor: createServidoresDto.criadoPor,
      },
    });

    await this.addServidorToEquipe(equipeId, servidor.id);

    return this.buildServidorWithEquipe(servidor);
  }

  async findAll() {
    const servidores = await this.prisma.servidores.findMany();
    const equipeIds = Array.from(new Set(servidores.map(s => s.equipeId).filter(Boolean)));
    const equipes = await this.prisma.equipes.findMany({
      where: { id: { in: equipeIds as number[] } },
    });
    const equipeMap = new Map(equipes.map(equipe => [equipe.id, equipe]));

    return servidores.map(servidor => ({
      ...servidor,
      equipeId: servidor.equipeId ? equipeMap.get(servidor.equipeId) : null,
    }));
  }

  async findOne(id: number) {
    const servidor = await this.prisma.servidores.findUnique({
      where: { id },
    });

    if (!servidor) {
      throw new HttpException('Servidor não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.buildServidorWithEquipe(servidor);
  }

  async update(id: number, updateServidoresDto: UpdateServidoresDto) {
    const servidorExistente = await this.prisma.servidores.findUnique({ where: { id } });

    if (!servidorExistente) {
      throw new HttpException('Servidor não encontrado', HttpStatus.NOT_FOUND);
    }

    const novaEquipeId = this.getEquipeIdFromPayload(updateServidoresDto);

    if (novaEquipeId != null && novaEquipeId !== servidorExistente.equipeId) {
      await this.loadEquipe(novaEquipeId);
      if (servidorExistente.equipeId != null) {
        await this.removeServidorFromEquipe(servidorExistente.equipeId, id);
      }
      await this.addServidorToEquipe(novaEquipeId, id);
    }

    const data: any = { ...updateServidoresDto };
    delete data.equipe;

    if (novaEquipeId != null) {
      data.equipeId = novaEquipeId;
    }

    const servidorAtualizado = await this.prisma.servidores.update({
      where: { id },
      data,
    });

    return this.buildServidorWithEquipe(servidorAtualizado);
  }

  async remove(id: number) {
    const servidor = await this.prisma.servidores.findUnique({ where: { id } });

    if (!servidor) {
      throw new HttpException('Servidor não encontrado', HttpStatus.NOT_FOUND);
    }

    if (servidor.equipeId != null) {
      await this.removeServidorFromEquipe(servidor.equipeId, id);
    }

    try {
      await this.prisma.servidores.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException('Servidor não encontrado', HttpStatus.NOT_FOUND);
        }
      }
      throw new HttpException('Erro ao deletar servidor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
