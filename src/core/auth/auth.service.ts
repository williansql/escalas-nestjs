import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsuariosService } from '../../features/usuarios/usuarios.service';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, senha: string) {
    const user = await this.usuariosService.findByEmail(email);

    if (!user) throw new UnauthorizedException('Usuário não encontrado');

    const match = await bcrypt.compare(senha, user.senha);
    if (!match) throw new UnauthorizedException('Senha inválida');

    return this.generateTokens(user);
  }

  async generateTokens(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: 'ACCESS_SECRET',
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: 'REFRESH_SECRET',
      expiresIn: '7d',
    });

    await this.updateRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async updateRefreshToken(userId: number, refreshToken: string) {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.usuariosService.update(userId, {
      refreshToken: hash,
    });
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usuariosService.findOne(userId);

    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Acesso negado');
    }

    const match = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!match) throw new ForbiddenException('Token inválido');

    return this.generateTokens(user);
  }
}
