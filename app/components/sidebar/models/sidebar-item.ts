import { IconType } from 'react-icons';

export interface SidebarItemModel {
  title: string;
  link: string;
  icon: IconType;
  onClick?: () => void;
}
