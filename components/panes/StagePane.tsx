import React from 'react';
import { styled } from 'styletron-react';
import StageView from '../layouts/StageView';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import { Stages } from '../../lib/digitalstage/useStageContext/schema';

const Wrapper = styled('div', {});

const StagePane = () => {
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
  const stages = useStageSelector<Stages>((state) => state.stages);

  return (
    <Wrapper>
      <StageView stage={stages.byId[stageId]} />
    </Wrapper>
  );
};
export default StagePane;
