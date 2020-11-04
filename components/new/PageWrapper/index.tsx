import { styled } from 'baseui';
import React from 'react';

const Wrapper = styled('div', {
  background: 'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box;',
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
