import { styled } from 'baseui';
import React from 'react';

const Wrapper = styled('div', {
  width: '100%',
  minHeight: '100vh',
});

const PageWrapper = (props: {
  children: React.ReactNode
}) => {
  const { children } = props;

  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
};
export default PageWrapper;
