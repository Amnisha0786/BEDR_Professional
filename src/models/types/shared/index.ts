import { STEPPER } from '@/enums/create-patient';

export interface User {
  email: string;
  id: string;
  username: string;
}

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: string;
  label?: string;
  description?: string;
  alignTop?: boolean;
  padding?: string;
  value?: string;
  textOnly?: boolean;
}

export interface StepItem {
  title: STEPPER;
  disabled?: boolean;
  icon?: string;
  label?: string;
  padding?: string;
}

export interface FileInProgressSteps {
  title: string;
  value?: string;
  disabled?: boolean;
  icon?: string;
  label?: string;
  padding?: string;
  textOnly?: boolean;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export interface IOptions {
  label: string;
  value: string;
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;
