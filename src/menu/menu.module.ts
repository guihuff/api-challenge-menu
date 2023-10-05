import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu-repository';
import { MenuRepositoryImp } from './repositories/database/menu-repository-imp';

@Module({
  controllers: [MenuController],
  providers: [
    MenuService,
    {
      provide: MenuRepository,
      useClass: MenuRepositoryImp,
    },
  ],
})
export class MenuModule {}
