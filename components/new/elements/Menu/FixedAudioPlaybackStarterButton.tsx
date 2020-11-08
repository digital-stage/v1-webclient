import React, { useCallback, useEffect, useState } from 'react';
import { useStyletron } from 'baseui';
import Icon from '../../../../uikit/Icon';
import { useAudioContext } from '../../../../lib/useAudioContext';
import Button from '../../../../uikit/Button';

const FixedAudioPlaybackStarterButton = () => {
  const [css, theme] = useStyletron();
  const { audioContext, createAudioContext } = useAudioContext();
  const [valid, setValid] = useState<boolean>(
    audioContext && audioContext.state === 'running'
  );

  useEffect(() => {
    setValid(audioContext && audioContext.state === 'running');
  }, [audioContext]);

  const start = useCallback(() => {
    if (!audioContext) {
      return createAudioContext().then(createdAudioContext => {
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
            left: '4rem'
          }
        })}
      >
        <Button kind="minimal" shape="circle" onClick={() => start()}>
          <Icon
            className={css({
              color: theme.colors.warning,
              ':hover': {
                color: theme.colors.warning700
              }
            })}
            size={64}
            name="speaker-off"
          />
        </Button>
      </div>
    );
  }
  return null;
};
export default FixedAudioPlaybackStarterButton;
