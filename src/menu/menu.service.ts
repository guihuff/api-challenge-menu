import { Injectable } from '@nestjs/common';
import { MenuRepository } from './repositories/menu-repository';

@Injectable()
export class MenuService {
  constructor(private menuRepository: MenuRepository) {}
}
