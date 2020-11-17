/** @jsxRuntime classic */
/** @jsx jsx */
import { useStyletron } from 'baseui';
import * as React from 'react';
import { FaMicrophone } from 'react-icons/fa';
import { Box, Button, jsx } from 'theme-ui';
import { useAudioContext } from '../../../../lib/useAudioContext';

// TODO: @delude88 please check as well
const FixedAudioPlaybackStarterButton = (): JSX.Element => {
  const [css, theme] = useStyletron();
  const { audioContext, createAudioContext } = useAudioContext();
  const [valid, setValid] = React.useState<boolean>(
    audioContext && audioContext.state === 'running'
  );

  React.useEffect(() => {
    setValid(audioContext && audioContext.state === 'running');
  }, [audioContext]);

  const start = React.useCallback(() => {
    if (!audioContext) {
      return createAudioContext().then((createdAudioContext) => {
        if (createdAudioContext.state === 'suspended') {
          return createdAudioContext.resume().then(() => {
            if (createdAudioContext.state === 'running') setValid(true);
          });
        }
        return null;
      });
    }
    return audioContext.resume().then(() => {
      if (audioContext.state === 'running') setValid(true);
    });
  }, [audioContext]);

  if (!valid) {
    return (
      <Box
        sx={{
          position: 'fixed',
          bottom: '1rem',
          left: ['1rem', null, '4rem'],
          color: 'danger',
        }}
      >
        <Button variant="outlined" onClick={() => start()}>
          <FaMicrophone sx={{ color: 'accent' }} size={64} name="Microphone Off" />
        </Button>
      </Box>
    );
  }
  return null;
};
export default FixedAudioPlaybackStarterButton;
