import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuariosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existeEmail = await this.prisma.usuarios.findFirst({
      where: { email: createUsuarioDto.email },
    });

    if (existeEmail) {
      throw new HttpException('Email já cadastrado', HttpStatus.CONFLICT);
    }


    return this.prisma.usuarios.create({
      data: {
        nomeCompleto: createUsuarioDto.nomeCompleto,
        email: createUsuarioDto.email,
        senha: await this.hashPassword(createUsuarioDto.senha),
        role: createUsuarioDto.role || 'USER',
      }
    });
  }

  async findAll() {
    return await this.prisma.usuarios.findMany();
  }

  async findOne(id: number) {
    const buscarUsuario = await this.prisma.usuarios.findUnique({
      where: { id },
    });
    if (!buscarUsuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return buscarUsuario;
  }

  async findByEmail(email: string) {
    return this.prisma.usuarios.findUnique({
      where: { email },
    });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const buscarUsuario = await this.prisma.usuarios.findUnique({
      where: { id },
    });
    if (!buscarUsuario) {
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
    return this.prisma.usuarios.update({
      where: { id },
      data: { 
        nomeCompleto: updateUsuarioDto.nomeCompleto,
        email: updateUsuarioDto.email,
        role: updateUsuarioDto.role,
       },
    });
  }

  async remove(id: number) {
    try {
      await this.prisma.usuarios.delete({
        where: { id },
      });
      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            `Usuário ${id} não encontrado`,
            HttpStatus.NOT_FOUND,
          );
        }
        throw new HttpException(
          'Erro ao deletar usuário',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  private async hashPassword(senha: string): Promise<string> {
    return bcrypt.hash(senha, 10);
  }
}
