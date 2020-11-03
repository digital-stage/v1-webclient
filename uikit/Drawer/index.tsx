import {
  Drawer as BaseDrawer,
} from 'baseui/drawer';
import React from 'react';

export interface ANCHOR {
  left: 'left';
  right: 'right';
  top: 'top';
  bottom: 'bottom';
}

export interface SIZE {
  left: 'left';
  right: 'right';
  top: 'top';
  bottom: 'bottom';
}

const Drawer = (props: {
  children: React.ReactNode,
  isOpen: boolean;
  onClose: () => void;
  anchor?: ANCHOR[keyof ANCHOR];
  size?: SIZE[keyof SIZE];
}) => {
  const {
    children, isOpen, onClose, anchor, size,
  } = props;

  return (
    <BaseDrawer
      isOpen={isOpen}
      onClose={onClose}
      anchor={anchor}
      size={size}
    >
      {children}
    </BaseDrawer>
  );
};
export default Drawer;
