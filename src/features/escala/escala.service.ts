import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEscalaDto } from './dto/create-escala.dto';
import { UpdateEscalaDto } from './dto/update-escala.dto';
import { GerarEscalaDto } from './dto/gerar-escala.dto';
import { UpdateEscalaDiaDto } from './dto/update-escala-dia.dto';

const DIAS_SEMANA = [
  'domingo',
  'segunda-feira',
  'terça-feira',
  'quarta-feira',
  'quinta-feira',
  'sexta-feira',
  'sábado',
];

@Injectable()
export class EscalaService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Gerador Inteligente ────────────────────────────────────────────────────

  async gerarEscala(dto: GerarEscalaDto) {
    const { mes, ano, criadoPor } = dto;

    // 1. Valida mês/ano
    if (mes < 1 || mes > 12) {
      throw new BadRequestException('Mês inválido. Use valores entre 1 e 12.');
    }

    // 2. Verifica se já existe escala para o mês/ano
    const escalaExistente = await this.prisma.escalaMensal.findUnique({
      where: { mes_ano: { mes, ano } },
    });

    if (escalaExistente && escalaExistente.status === 'PUBLICADA') {
      throw new ConflictException(
        `Já existe uma escala PUBLICADA para ${mes}/${ano}. Não é possível gerar uma nova.`,
      );
    }

    // 3. Busca equipes ativas e ordena por ID para rotação consistente
    const equipes = await this.prisma.equipes.findMany({
      where: { status: true },
      orderBy: { id: 'asc' },
    });

    if (equipes.length === 0) {
      throw new BadRequestException(
        'Nenhuma equipe ativa encontrada. Cadastre equipes antes de gerar a escala.',
      );
    }

    // 4. Determina o índice de início da primeira equipe
    let indiceInicial = 0;
    if (dto.primeiraEquipeId) {
      const idx = equipes.findIndex((e) => e.id === dto.primeiraEquipeId);
      if (idx === -1) {
        throw new BadRequestException(
          `Equipe com ID ${dto.primeiraEquipeId} não encontrada entre as equipes ativas.`,
        );
      }
      indiceInicial = idx;
    }

    // 5. Calcula os dias do mês
    const diasDoMes = this.getDiasDoMes(mes, ano);

    // 6. Busca todos os afastamentos que se sobrepõem ao mês
    const inicioMes = new Date(ano, mes - 1, 1);
    const fimMes = new Date(ano, mes, 0, 23, 59, 59);

    const afastamentos = await this.prisma.afastamentos.findMany({
      where: {
        status: true,
        dataInicio: { lte: fimMes },
        dataFim: { gte: inicioMes },
      },
    });

    // 7. Cria ou recria a escala mensal
    let escalaMensal: { id: number };

    if (escalaExistente) {
      // Apaga os dias existentes e recria (CASCADE cuida dos filhos)
      await this.prisma.escalaDiaria.deleteMany({
        where: { escalaId: escalaExistente.id },
      });
      escalaMensal = await this.prisma.escalaMensal.update({
        where: { id: escalaExistente.id },
        data: {
          status: 'RASCUNHO',
          geradaEm: new Date(),
          atualizadoPor: criadoPor,
        },
      });
    } else {
      escalaMensal = await this.prisma.escalaMensal.create({
        data: {
          mes,
          ano,
          status: 'RASCUNHO',
          geradaEm: new Date(),
          criadoPor,
        },
      });
    }

    // 8. Gera cada dia da escala
    const diasParaInserir: {
      escalaId: number;
      data: Date;
      diaSemana: string;
      equipeId: number;
      sobreavisoEquipeId: number | null;
      servidoresEscalados: number[];
    }[] = [];

    for (let i = 0; i < diasDoMes.length; i++) {
      const data = diasDoMes[i];
      const indiceEquipe = (indiceInicial + i) % equipes.length;
      const equipe = equipes[indiceEquipe];

      // Sobreaviso = equipe do DIA SEGUINTE
      const indiceSobreaviso = (indiceInicial + i + 1) % equipes.length;
      const equipeSobreaviso = equipes[indiceSobreaviso];

      // Servidores da equipe, excluindo afastados neste dia
      const idsServidores = (equipe.servidoresId as number[]) ?? [];
      const servidoresDisponiveisIds = this.filtrarServidoresAfastados(
        idsServidores,
        data,
        afastamentos,
      );

      diasParaInserir.push({
        escalaId: escalaMensal.id,
        data,
        diaSemana: DIAS_SEMANA[data.getDay()],
        equipeId: equipe.id,
        sobreavisoEquipeId: equipeSobreaviso.id,
        servidoresEscalados: servidoresDisponiveisIds,
      });
    }

    // 9. Insere todos os dias em batch
    await this.prisma.escalaDiaria.createMany({
      data: diasParaInserir.map((d) => ({
        ...d,
        servidoresEscalados: d.servidoresEscalados,
      })),
    });

    // 10. Retorna a escala completa populada
    return this.findOne(escalaMensal.id);
  }

  // ─── CRUD EscalaMensal ──────────────────────────────────────────────────────

  async create(createEscalaDto: CreateEscalaDto) {
    const { mes, ano } = createEscalaDto;

    const existente = await this.prisma.escalaMensal.findUnique({
      where: { mes_ano: { mes, ano } },
    });

    if (existente) {
      throw new ConflictException(`Já existe uma escala para ${mes}/${ano}.`);
    }

    return this.prisma.escalaMensal.create({
      data: {
        mes,
        ano,
        criadoPor: createEscalaDto.criadoPor,
      },
    });
  }

  async findAll() {
    return this.prisma.escalaMensal.findMany({
      orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
      include: {
        _count: { select: { dias: true } },
      },
    });
  }

  async findOne(id: number) {
    const escala = await this.prisma.escalaMensal.findUnique({
      where: { id },
      include: { dias: { orderBy: { data: 'asc' } } },
    });

    if (!escala) {
      throw new NotFoundException(`Escala #${id} não encontrada.`);
    }

    // Popula equipes e servidores
    return this.popularEscala(escala);
  }

  async findByMesAno(mes: number, ano: number) {
    const escala = await this.prisma.escalaMensal.findUnique({
      where: { mes_ano: { mes, ano } },
      include: { dias: { orderBy: { data: 'asc' } } },
    });

    if (!escala) {
      throw new NotFoundException(`Escala para ${mes}/${ano} não encontrada.`);
    }

    return this.popularEscala(escala);
  }

  async update(id: number, updateEscalaDto: UpdateEscalaDto) {
    await this.ensureExists(id);

    const statusValidos = ['RASCUNHO', 'PUBLICADA', 'ARQUIVADA'];
    if (
      updateEscalaDto.status &&
      !statusValidos.includes(updateEscalaDto.status)
    ) {
      throw new BadRequestException(
        `Status inválido. Use: ${statusValidos.join(', ')}.`,
      );
    }

    return this.prisma.escalaMensal.update({
      where: { id },
      data: {
        status: updateEscalaDto.status,
        atualizadoPor: updateEscalaDto.atualizadoPor,
      },
    });
  }

  async remove(id: number) {
    await this.ensureExists(id);
    // Cascade deleta os EscalaDiaria
    await this.prisma.escalaMensal.delete({ where: { id } });
    return { message: `Escala #${id} removida com sucesso.` };
  }

  // ─── Edição de Dia Individual ───────────────────────────────────────────────

  async updateDia(diaId: number, dto: UpdateEscalaDiaDto) {
    const dia = await this.prisma.escalaDiaria.findUnique({
      where: { id: diaId },
    });
    if (!dia) {
      throw new NotFoundException(`Dia de escala #${diaId} não encontrado.`);
    }

    return this.prisma.escalaDiaria.update({
      where: { id: diaId },
      data: {
        equipeId: dto.equipeId ?? dia.equipeId,
        sobreavisoEquipeId:
          dto.sobreavisoEquipeId !== undefined
            ? dto.sobreavisoEquipeId
            : dia.sobreavisoEquipeId,
        servidoresEscalados:
          dto.servidoresEscalados !== undefined
            ? dto.servidoresEscalados
            : (dia.servidoresEscalados as number[]),
        observacao:
          dto.observacao !== undefined ? dto.observacao : dia.observacao,
      },
    });
  }

  async findDia(diaId: number) {
    const dia = await this.prisma.escalaDiaria.findUnique({
      where: { id: diaId },
    });
    if (!dia) {
      throw new NotFoundException(`Dia de escala #${diaId} não encontrado.`);
    }
    return dia;
  }

  // ─── Helpers Privados ───────────────────────────────────────────────────────

  private getDiasDoMes(mes: number, ano: number): Date[] {
    const dias: Date[] = [];
    const totalDias = new Date(ano, mes, 0).getDate();
    for (let d = 1; d <= totalDias; d++) {
      dias.push(new Date(ano, mes - 1, d));
    }
    return dias;
  }

  private filtrarServidoresAfastados(
    idsServidores: number[],
    data: Date,
    afastamentos: { servidorId: number; dataInicio: Date; dataFim: Date }[],
  ): number[] {
    return idsServidores.filter((id) => {
      const afastado = afastamentos.some(
        (a) => a.servidorId === id && a.dataInicio <= data && a.dataFim >= data,
      );
      return !afastado;
    });
  }

  private async popularEscala(escala: any) {
    // Coleta IDs únicos de equipes e servidores
    const equipeIds = new Set<number>();
    const servidorIds = new Set<number>();

    for (const dia of escala.dias ?? []) {
      if (dia.equipeId) equipeIds.add(dia.equipeId);
      if (dia.sobreavisoEquipeId) equipeIds.add(dia.sobreavisoEquipeId);
      const ids = (dia.servidoresEscalados as number[]) ?? [];
      ids.forEach((sid) => servidorIds.add(sid));
    }

    const [equipes, servidores] = await Promise.all([
      this.prisma.equipes.findMany({
        where: { id: { in: Array.from(equipeIds) } },
      }),
      this.prisma.servidores.findMany({
        where: { id: { in: Array.from(servidorIds) } },
      }),
    ]);

    const equipesMap = new Map(equipes.map((e) => [e.id, e]));
    const servidoresMap = new Map(servidores.map((s) => [s.id, s]));

    return {
      ...escala,
      dias: (escala.dias ?? []).map((dia: any) => ({
        ...dia,
        equipePlantao: equipesMap.get(dia.equipeId) ?? null,
        sobreaviso: dia.sobreavisoEquipeId
          ? (equipesMap.get(dia.sobreavisoEquipeId) ?? null)
          : null,
        servidoresEscaladosDetalhes: (
          (dia.servidoresEscalados as number[]) ?? []
        )
          .map((sid) => servidoresMap.get(sid) ?? null)
          .filter(Boolean),
      })),
    };
  }

  private async ensureExists(id: number) {
    const escala = await this.prisma.escalaMensal.findUnique({ where: { id } });
    if (!escala) {
      throw new NotFoundException(`Escala #${id} não encontrada.`);
    }
    return escala;
  }
}
