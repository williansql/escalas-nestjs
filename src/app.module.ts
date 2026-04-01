import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './features/usuarios/usuarios.module';
import { ServidoresModule } from './features/servidores/servidores.module';
import { EquipesModule } from './features/equipes/equipes.module';
import { AfastamentosModule } from './features/afastamentos/afastamentos.module';
import { EscalaModule } from './features/escala/escala.module';

@Module({
  imports: [
    UsuariosModule,
    ServidoresModule,
    EquipesModule,
    AfastamentosModule,
    EscalaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
