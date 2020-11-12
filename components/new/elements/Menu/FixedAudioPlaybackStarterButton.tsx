/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Flex } from 'theme-ui';
import { useStyletron } from 'baseui';
import { FaMicrophone } from 'react-icons/fa';
import { useAudioContext } from '../../../../lib/useAudioContext';

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
      <div
        className={css({
          position: 'fixed',
          bottom: '1rem',
          left: '1rem',
          color: theme.colors.warning,

          [theme.mediaQuery.large]: {
            left: '4rem',
          },
        })}
      >
        <Button variant="outlined" onClick={() => start()}>
          <FaMicrophone sx={{ color: 'accent' }} size={64} name="Microphone Off" />
        </Button>
      </div>
    );
  }
  return null;
};
export default FixedAudioPlaybackStarterButton;
