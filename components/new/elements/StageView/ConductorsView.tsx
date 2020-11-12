/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import { useConductors } from '../../../../lib/digitalstage/useStageSelector';
import StageMemberView from './StageMemberView';

const ConductorsView = (): JSX.Element => {
  const conductors = useConductors();

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
