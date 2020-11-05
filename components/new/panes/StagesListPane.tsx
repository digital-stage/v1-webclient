import { styled } from 'styletron-react';
import React from 'react';
import { H1 } from 'baseui/typography';
import StageListView from '../../layouts/StageListView';

const Wrapper = styled('div', {

});

const StagesListPane = () => (
  <Wrapper>
    <H1>
      My Stages
    </H1>
    <StageListView />
  </Wrapper>
);
export default StagesListPane;
