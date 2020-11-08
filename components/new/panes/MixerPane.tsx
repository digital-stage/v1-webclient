import { styled } from 'styletron-react';
import React from 'react';
import MixingPanelView from '../elements/MixingPanel';

const Wrapper = styled('div', {
  position: 'relative',
  border: '1px solid red',
  whiteSpace: 'nowrap',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  width: '100%',
  height: '100%'
});
const ScrollPane = styled('div', {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  overflowX: 'scroll',
  overflowY: 'auto'
});

const MixerPane = () => (
  <Wrapper>
    <ScrollPane>
      <MixingPanelView />
    </ScrollPane>
  </Wrapper>
);
export default MixerPane;
