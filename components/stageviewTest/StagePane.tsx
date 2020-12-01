/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import { useCurrentStageId, useGroupsByStage } from '../../lib/use-digital-stage';
import ConductorsView from '../new/elements/StageView/ConductorsView';
import GroupView from './GroupView';

const StagePane = (): JSX.Element => {
  const stageId = useCurrentStageId();
  const groups = useGroupsByStage(stageId);

  return (
    <Box>
      {groups && groups.map((group) => <GroupView key={group._id} group={group} />)}
      <ConductorsView  />
    </Box>
  );
};

export default StagePane;
