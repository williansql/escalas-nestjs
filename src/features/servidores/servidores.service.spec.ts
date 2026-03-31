import { Test, TestingModule } from '@nestjs/testing';
import { ServidoresService } from './servidores.service';

describe('ServidoresService', () => {
  let service: ServidoresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServidoresService],
    }).compile();

    service = module.get<ServidoresService>(ServidoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
