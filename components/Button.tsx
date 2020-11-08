/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Button as ThemeButton } from 'theme-ui';

interface Props {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'light' | 'dark';
}

const Button = ({ children, variant = 'primary' }: Props) => {
  console.log(variant);
  return (
    <ThemeButton
      sx={{
        variant: `buttons.${variant}`
      }}
    >
      {children}
    </ThemeButton>
  );
};
export default Button;
