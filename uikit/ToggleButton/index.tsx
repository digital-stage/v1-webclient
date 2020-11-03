import React, { CSSProperties } from 'react';
import Button from '../Button';
import { KIND, SIZE } from '../Theme';

const ToggleButton = (props: {
  children: React.ReactNode;
  active: boolean;
  size?: SIZE[keyof SIZE];
  style?: CSSProperties;
  kind?: KIND[keyof KIND];
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => any;
}) => {
  const {
    children, active, style, size, kind, onClick,
  } = props;
  return (
    <Button
      onClick={onClick}
      style={style}
      size={size}
      shape="circle"
      kind={active ? kind : 'minimal'}
    >
      {children}
    </Button>
  );
};
export default ToggleButton;
