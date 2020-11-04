import { styled } from 'styletron-react';
import React from 'react';
import StageListView from '../layouts/StageListView';

const Wrapper = styled('div', {

});
const StagesList = styled('div', {

});

const StageDetail = styled('div', {

});

const StagesListPane = () => (
  <Wrapper>
    <StagesList>
      STAGE LIST
    </StagesList>
    <StageDetail>
      <StageListView />
    </StageDetail>
  </Wrapper>
);
export default StagesListPane;
