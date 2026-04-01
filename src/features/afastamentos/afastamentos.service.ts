import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAfastamentoDto } from './dto/create-afastamento.dto';
import { UpdateAfastamentoDto } from './dto/update-afastamento.dto';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';

@Injectable()
export class AfastamentosService {
  constructor(private readonly prisma: PrismaService) {}

  private getServidorIdFromPayload(payload: CreateAfastamentoDto | UpdateAfastamentoDto): number | undefined {
    const anyPayload = payload as any;

    if (typeof anyPayload.servidorId === 'number') {
      return anyPayload.servidorId;
    }

    if (anyPayload.servidor?.id != null) {
      return anyPayload.servidor.id;
    }

    if (typeof anyPayload.servidorId === 'object' && anyPayload.servidorId?.id != null) {
      return anyPayload.servidorId.id;
    }

    return undefined;
  }

  private async loadServidor(servidorId: number) {
    const servidor = await this.prisma.servidores.findUnique({ where: { id: servidorId } });

    if (!servidor) {
      throw new HttpException('Servidor não encontrado', HttpStatus.BAD_REQUEST);
    }

    return servidor;
  }

  private async buildAfastamentoWithServidor(afastamento: any) {
    if (!afastamento) {
      return null;
    }

    const servidor = afastamento.servidorId
      ? await this.prisma.servidores.findUnique({ where: { id: afastamento.servidorId } })
      : null;

    return {
      ...afastamento,
      servidor,
    };
  }

  async create(createAfastamentoDto: CreateAfastamentoDto) {
    const servidorId = this.getServidorIdFromPayload(createAfastamentoDto);

    if (servidorId == null) {
      throw new HttpException('Selecionar o servidor é obrigatório', HttpStatus.BAD_REQUEST);
    }

    await this.loadServidor(servidorId);

    const afastamento = await this.prisma.afastamentos.create({
      data: {
        servidorId,
        tipoAfastamento: createAfastamentoDto.tipo ?? '',
        dataInicio: new Date(createAfastamentoDto.dataInicio),
        dataFim: new Date(createAfastamentoDto.dataFim),
        motivo: createAfastamentoDto.motivo ?? createAfastamentoDto.observacao ?? '',
        status: createAfastamentoDto.status ?? true,
        criadoQuando: new Date(),
        criadoPor: createAfastamentoDto.criadoPor,
      },
    });

    return this.buildAfastamentoWithServidor(afastamento);
  }

  async findAll() {
    const afastamentos = await this.prisma.afastamentos.findMany();
    const servidorIds = Array.from(new Set(afastamentos.map(a => a.servidorId)));
    const servidores = await this.prisma.servidores.findMany({ where: { id: { in: servidorIds } } });
    const servidorMap = new Map(servidores.map(servidor => [servidor.id, servidor]));

    return afastamentos.map(afastamento => ({
      ...afastamento,
      servidor: servidorMap.get(afastamento.servidorId) ?? null,
    }));
  }

  async findOne(id: number) {
    const afastamento = await this.prisma.afastamentos.findUnique({ where: { id } });

    if (!afastamento) {
      throw new HttpException('Afastamento não encontrado', HttpStatus.NOT_FOUND);
    }

    return this.buildAfastamentoWithServidor(afastamento);
  }

  async update(id: number, updateAfastamentoDto: UpdateAfastamentoDto) {
    const afastamentoExistente = await this.prisma.afastamentos.findUnique({ where: { id } });

    if (!afastamentoExistente) {
      throw new HttpException('Afastamento não encontrado', HttpStatus.NOT_FOUND);
    }

    const servidorId = this.getServidorIdFromPayload(updateAfastamentoDto);
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

    if (servidorId != null) {
      await this.loadServidor(servidorId);
      data.servidorId = servidorId;
    }

    delete data.servidor;

    const afastamentoAtualizado = await this.prisma.afastamentos.update({
      where: { id },
      data,
    });

    return this.buildAfastamentoWithServidor(afastamentoAtualizado);
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
