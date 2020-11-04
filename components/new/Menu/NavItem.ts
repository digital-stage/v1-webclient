import React from 'react';
import { SIZE } from '../Modal';

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  content?: React.ReactNode;
  size?: SIZE[keyof SIZE]
}

export default NavItem;
