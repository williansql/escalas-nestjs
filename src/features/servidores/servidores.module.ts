import { Module } from '@nestjs/common';
import { ServidoresService } from './servidores.service';
import { ServidoresController } from './servidores.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServidoresController],
  providers: [ServidoresService],
})
export class ServidoresModule {}
