import { Module } from '@nestjs/common';
import { EquipesService } from './equipes.service';
import { EquipesController } from './equipes.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [EquipesController],
  providers: [EquipesService],
})
export class EquipesModule {}
