import React from 'react';
import { styled } from 'baseui';

const Wrapper = styled('div', ({ $theme }) => ({
  backgroundColor: $theme.colors.backgroundTertiary,
  display: 'flex',
  flexDirection: 'row',
  borderRadius: '20px',
  marginRight: '1rem',
}));

const Panel = (props: {
  children: React.ReactNode,
  className?: string
}) => {
  const { children, className } = props;

  return (
    <Wrapper className={className}>
      {children}
    </Wrapper>
  );
};
export default Panel;
