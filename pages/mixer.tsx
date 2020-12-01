import React from 'react';
import MixingPanel from '../components/mixer/MixingPanel';
import { Flex, Box } from 'theme-ui';

const Mixer = () => (
  <Flex
    sx={{
      position: 'relative',
      border: '1px solid red',
      whiteSpace: 'nowrap',
      flexGrow: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: '100%',
      height: '100%',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        overflowX: 'scroll',
        overflowY: 'auto',
      }}
    >
      <MixingPanel />
    </Box>
  </Flex>
);
export default Mixer;
