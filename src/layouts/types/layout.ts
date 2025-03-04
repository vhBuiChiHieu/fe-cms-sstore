import { ReactNode } from 'react';

export interface DynamicSubMenuItem {
  text: string;
  icon: ReactNode;
  path: string;
}

export interface SubMenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  dynamicSubItems?: DynamicSubMenuItem[];
}

export interface MenuItem {
  text: string;
  icon: ReactNode;
  path: string;
  subItems?: SubMenuItem[];
}

export interface MainLayoutProps {
  window?: () => Window;
}
