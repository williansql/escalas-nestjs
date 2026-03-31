import { Module } from '@nestjs/common';
import { AfastamentosService } from './afastamentos.service';
import { AfastamentosController } from './afastamentos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AfastamentosController],
  providers: [AfastamentosService],
})
export class AfastamentosModule {}
