import { Body, Controller, Post } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';

@Controller('menus')
export class MenuController {
  constructor(private menusService: MenuService) {}

  @Post()
  async create(@Body() createMenu: CreateMenuDto): Promise<string> {
    const id = await this.menusService.create(createMenu);
    const jsonString = JSON.stringify({ id });
    return jsonString;
  }
}
