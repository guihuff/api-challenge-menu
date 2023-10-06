import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './interfaces/menu.interface';

@Controller('menus')
export class MenuController {
  constructor(private menusService: MenuService) {}

  @Post()
  async create(@Body() createMenu: CreateMenuDto): Promise<string> {
    const id = await this.menusService.create(createMenu);
    const jsonString = JSON.stringify({ id });
    return jsonString;
  }

  @Get('/all')
  async findAll(): Promise<Menu[]> {
    return this.menusService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<Menu> {
    return this.menusService.findById(id);
  }

  @Get()
  async findByTime(): Promise<Menu> {
    return this.menusService.findByTime();
  }
}
