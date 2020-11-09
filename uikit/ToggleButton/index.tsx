import React from 'react';
import { Button } from 'baseui/button';
import { KIND, SIZE } from '../Theme';

const ToggleButton = (props: {
  children: React.ReactNode;
  active: boolean;
  size?: SIZE[keyof SIZE];
  kind?: KIND[keyof KIND];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}) => {
  const {
    children, active, size, kind, onClick,
  } = props;
  return (
    <Button
      onClick={onClick}
      size={size}
      shape="circle"
      kind={active ? kind : 'minimal'}
    >
      {children}
    </Button>
  );
};
export default ToggleButton;
