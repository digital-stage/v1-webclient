/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import GroupView from '../elements/StageView/GroupView';
import ConductorsView from '../elements/StageView/ConductorsView';
import useStageSelector, { useGroupsByStage } from '../../../lib/digitalstage/useStageSelector';
import { Stages } from '../../../lib/digitalstage/useStageContext/schema';

const StagePane = (): JSX.Element => {
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
  const stages = useStageSelector<Stages>((state) => state.stages);
  const groups = useGroupsByStage(stages.byId[stageId]);

  return (
    <Box>
      {groups.map((group) => (
        <GroupView key={group._id} group={group} />
      ))}
      <ConductorsView />
    </Box>
  );
};

export default StagePane;
