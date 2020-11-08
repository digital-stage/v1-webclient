import React from 'react';
import StageView from '../elements/StageView';
import useStageSelector from '../../../lib/digitalstage/useStageSelector';
import { Stages } from '../../../lib/digitalstage/useStageContext/schema';

const StagePane = () => {
  const stageId = useStageSelector<string | undefined>(state => state.stageId);
  const stages = useStageSelector<Stages>(state => state.stages);

  return (
    <div>
      <StageView stage={stages.byId[stageId]} />
    </div>
  );
};
export default StagePane;
