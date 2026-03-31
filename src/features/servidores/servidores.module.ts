import { Module } from '@nestjs/common';
import { ServidoresService } from './servidores.service';
import { ServidoresController } from './servidores.controller';

@Module({
  controllers: [ServidoresController],
  providers: [ServidoresService],
})
export class ServidoresModule {}
