import { Menu } from 'src/menu/interfaces/menu.interface';
import { MenuRepository } from '../menu-repository';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { $Enums } from '@prisma/client';

@Injectable()
export class MenuRepositoryPrismaImp implements MenuRepository {
  constructor(private prisma: PrismaService) {}

  async create(menu: Menu): Promise<void> {
    const manyProducts = menu.products.map((value) => {
      console.log(value);
      return { id_product: value.id_product };
    });

    console.log(manyProducts);

    await this.prisma.menu
      .create({
        data: {
          id: menu.id,
          name: menu.name,
          time: menu.time,
          isActive: menu.isActive,
          products: {
            create: manyProducts,
          },
        },
      })
      .catch(() => {
        throw new InternalServerErrorException('O Cardápio não foi cadastrado');
      });
  }

  async addProduct(
    menu: string,
    products: { id_product: string }[],
  ): Promise<{ count: number }> {
    return { count: 0 };
  }

  findAll(): Promise<Menu[]> {
    throw new Error('Method not implemented.');
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

  async findByTime(time: $Enums.TimeRole): Promise<Menu> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<void> {
    await this.prisma.menu.delete({
      where: { id },
    });
  }
  async update(menu: Menu): Promise<Menu> {
    throw new Error('Method not implemented.');
  }
}
