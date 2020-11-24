/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import StageMemberView from './StageMemberView';
import { useConductorsByStage, useCurrentStageId } from '../../../../lib/use-digital-stage/hooks';

const ConductorsView = (): JSX.Element => {
  const stageId = useCurrentStageId();
  const conductors = useConductorsByStage(stageId);

  if (conductors.length > 0) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: '10vh',
          left: '10vw',
          width: '80vw',
          height: '80vh',
          backgroundColor: 'black',
        }}
      >
        {conductors.map((conductor) => (
          <StageMemberView key={conductor._id} stageMember={conductor} />
        ))}
      </Box>
    );
  }
  return null;
};

export default ConductorsView;
