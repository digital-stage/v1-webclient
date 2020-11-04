import { styled } from 'styletron-react';
import React from 'react';

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
      STAGE DETAIL
    </StageDetail>
  </Wrapper>
);
export default StagesListPane;
