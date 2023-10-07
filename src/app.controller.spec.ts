import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    appService = module.get<AppService>(AppService);
  });

  describe('getHello', () => {
    it('should return "pong" from AppService', () => {
      const pongValue = 'pong';
      jest.spyOn(appService, 'getPong').mockReturnValue(pongValue);

      const result = appController.getHello();

      expect(result).toBe(pongValue);
    });
  });
});
