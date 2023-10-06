import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { Menu } from './interfaces/menu.interface';
import { UpdateMenuDto } from './dto/update-menu.dto';

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

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    return this.menusService.delete(id);
  }

  @Patch()
  async update(@Body() updateMenu: UpdateMenuDto): Promise<Menu> {
    return this.menusService.update(updateMenu);
  }
}
