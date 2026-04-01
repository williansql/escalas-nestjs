import { Module } from '@nestjs/common';
import { EscalaService } from './escala.service';
import { EscalaController } from './escala.controller';

@Module({
  controllers: [EscalaController],
  providers: [EscalaService],
})
export class EscalaModule {}
