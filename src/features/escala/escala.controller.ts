import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EscalaService } from './escala.service';
import { CreateEscalaDto } from './dto/create-escala.dto';
import { UpdateEscalaDto } from './dto/update-escala.dto';
import { GerarEscalaDto } from './dto/gerar-escala.dto';
import { UpdateEscalaDiaDto } from './dto/update-escala-dia.dto';

@Controller('escala')
export class EscalaController {
  constructor(private readonly escalaService: EscalaService) {}

  // ─── Gerador ─────────────────────────────────────────────────────────────────

  /**
   * POST /escala/gerar
   * Gera (ou regenera) a escala mensal de forma inteligente.
   * Body: { mes, ano, primeiraEquipeId?, criadoPor? }
   */
  @Post('gerar')
  gerarEscala(@Body() gerarEscalaDto: GerarEscalaDto) {
    return this.escalaService.gerarEscala(gerarEscalaDto);
  }

  // ─── CRUD EscalaMensal ────────────────────────────────────────────────────────

  /**
   * POST /escala
   * Cria uma escala mensal vazia (sem dias).
   */
  @Post()
  create(@Body() createEscalaDto: CreateEscalaDto) {
    return this.escalaService.create(createEscalaDto);
  }

  /**
   * GET /escala
   * Lista todas as escalas mensais (cabeçalho, com contagem de dias).
   */
  @Get()
  findAll() {
    return this.escalaService.findAll();
  }

  /**
   * GET /escala/mes/:mes/ano/:ano
   * Busca a escala de um mês/ano específico com todos os dias populados.
   */
  @Get('mes/:mes/ano/:ano')
  findByMesAno(
    @Param('mes', ParseIntPipe) mes: number,
    @Param('ano', ParseIntPipe) ano: number,
  ) {
    return this.escalaService.findByMesAno(mes, ano);
  }

  /**
   * GET /escala/:id
   * Busca uma escala pelo ID com todos os dias populados.
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.escalaService.findOne(id);
  }

  /**
   * PATCH /escala/:id
   * Atualiza a escala (status: PUBLICADA / ARQUIVADA, etc.).
   */
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEscalaDto: UpdateEscalaDto,
  ) {
    return this.escalaService.update(id, updateEscalaDto);
  }

  /**
   * DELETE /escala/:id
   * Remove a escala e todos os seus dias.
   */
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.escalaService.remove(id);
  }

  // ─── Edição de Dias Individuais ───────────────────────────────────────────────

  /**
   * GET /escala/dia/:diaId
   * Busca um dia específico da escala.
   */
  @Get('dia/:diaId')
  findDia(@Param('diaId', ParseIntPipe) diaId: number) {
    return this.escalaService.findDia(diaId);
  }

  /**
   * PATCH /escala/dia/:diaId
   * Edita manualmente um dia da escala (trocar equipe, servidores, sobreaviso).
   */
  @Patch('dia/:diaId')
  updateDia(
    @Param('diaId', ParseIntPipe) diaId: number,
    @Body() updateEscalaDiaDto: UpdateEscalaDiaDto,
  ) {
    return this.escalaService.updateDia(diaId, updateEscalaDiaDto);
  }
}
