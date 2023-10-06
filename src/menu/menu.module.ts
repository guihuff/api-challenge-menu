import { Module } from '@nestjs/common';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';
import { MenuRepository } from './repositories/menu-repository';
import { MenuRepositoryPrismaImp } from './repositories/database/menu-repository-prisma-imp';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [MenuController],
  providers: [
    MenuService,
    {
      provide: MenuRepository,
      useClass: MenuRepositoryPrismaImp,
    },
    PrismaService,
  ],
})
export class MenuModule {}
