export class UpdateMenuDto {
  id: string;
  name?: string;
  timeInit?: number;
  timeEnd?: number;
  isActive?: boolean;
  products?: string[];
}
