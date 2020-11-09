/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import GroupView from '../elements/StageView/GroupView';
import ConductorsView from '../elements/StageView/ConductorsView';
import useStageSelector, { useGroupsByStage } from '../../../lib/digitalstage/useStageSelector';
import { Stages } from '../../../lib/digitalstage/useStageContext/schema';

const StagePane = () => {
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
  const stages = useStageSelector<Stages>((state) => state.stages);
  const groups = useGroupsByStage(stages.byId[stageId]);

  return (
    <div>
      {groups.map((group) => (
        <GroupView key={group._id} group={group} />
      ))}
      <ConductorsView />
    </div>
  );
};

export default StagePane;
