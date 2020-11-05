import { styled } from 'baseui';
import React from 'react';

const Wrapper = styled('div', {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: '#FFFFFF',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
});
const Text = styled('div', {
  animationDuration: '1s',
  animationIterationCount: 'infinite',
  animationName: 'bounce',
});

const Loading = (props: { children: React.ReactNode }) => {
  const { children } = props;

  return (
    <Wrapper>
      <Text>{children}</Text>
    </Wrapper>
  );
};

export default Loading;
