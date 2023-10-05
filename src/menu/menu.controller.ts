import { Controller } from '@nestjs/common';
import { MenuService } from './menu.service';

@Controller('menus')
export class MenuController {
  constructor(private menusService: MenuService) {}
}
