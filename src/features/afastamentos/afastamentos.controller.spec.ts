import { Test, TestingModule } from '@nestjs/testing';
import { AfastamentosController } from './afastamentos.controller';
import { AfastamentosService } from './afastamentos.service';

describe('AfastamentosController', () => {
  let controller: AfastamentosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfastamentosController],
      providers: [AfastamentosService],
    }).compile();

    controller = module.get<AfastamentosController>(AfastamentosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
