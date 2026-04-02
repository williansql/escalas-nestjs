import { Module } from '@nestjs/common';
import { EscalaService } from './escala.service';
import { EscalaController } from './escala.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EscalaController],
  providers: [EscalaService],
  exports: [EscalaService],
})
export class EscalaModule {}
