export interface Menu {
  id: string;
  name: string;
  time: TimeRole;
  isActive: boolean;
  products: string[];
}

export enum TimeRole {
  night = 'night',
  day = 'day',
}
