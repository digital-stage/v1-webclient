import React from 'react';

interface NavItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  content?: React.ReactNode;
  size?: any;
}

export default NavItem;
