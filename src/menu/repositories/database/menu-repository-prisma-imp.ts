import { Menu } from 'src/menu/interfaces/menu.interface';
import { MenuRepository } from '../menu-repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { $Enums } from '@prisma/client';
import { ResponseFindMenuDto } from 'src/menu/dto/response-find-menu-dto';

@Injectable()
export class MenuRepositoryPrismaImp implements MenuRepository {
  constructor(private prisma: PrismaService) {}

  async create(menu: Menu): Promise<void> {
    await this.prisma.menu
      .create({
        data: {
          id: menu.id,
          name: menu.name,
          time: menu.time,
          isActive: menu.isActive,
          products: {
            create: menu.products,
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('O Cardápio não foi cadastrado');
      });
  }

  async findAll(): Promise<Menu[]> {
    const menus = await this.prisma.menu.findMany({
      select: {
        id: true,
        name: true,
        isActive: true,
        time: true,
        products: {
          select: {
            id_product: true,
          },
        },
      },
    });
    return menus;
  }

  async findById(id: string): Promise<Menu> {
    const menu = await this.prisma.menu.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        isActive: true,
        time: true,
        products: {
          select: {
            id_product: true,
          },
        },
      },
    });

    return menu;
  }

  async findByTime(time: $Enums.TimeRole): Promise<ResponseFindMenuDto> {
    const menu = await this.prisma.menu.findFirst({
      where: {
        time,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        time: true,
        isActive: true,
        products: {
          select: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                  },
                },
                image: true,
                price: true,
              },
            },
          },
        },
      },
    });
    return menu;
  }

  async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({
      where: { id },
    });
  }

  async update(menu: Menu): Promise<Menu> {
    await this.prisma.menuProduct.deleteMany({
      where: {
        id_menu: menu.id,
      },
    });

    await this.prisma.menu
      .update({
        where: {
          id: menu.id,
        },
        data: {
          name: menu.name,
          time: menu.time,
          isActive: menu.isActive,
          products: {
            create: menu.products,
          },
        },
        include: {
          products: true,
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('O Cardápio não foi atualizado');
      });
    return menu;
  }
}
