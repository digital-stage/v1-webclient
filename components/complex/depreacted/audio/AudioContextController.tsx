import { styled } from 'baseui';
import React, { useCallback, useEffect, useState } from 'react';
import { IconButton, withStyles } from '@material-ui/core';
import Icon from '../../../../uikit/Icon';
import { useAudioContext } from '../../../../lib/useAudioContext';

const StartAudioOverlay = styled('div', {
  position: 'fixed',
  bottom: '1rem',
  left: '1rem',
});
const StartAudioButton = withStyles({})(IconButton);

const AudioContextController = () => {
  const { audioContext, createAudioContext } = useAudioContext();
  const [valid, setValid] = useState<boolean>(audioContext && audioContext.state === 'running');

  useEffect(() => {
    setValid(audioContext && audioContext.state === 'running');
  }, [audioContext]);

  const start = useCallback(() => {
    if (!audioContext) {
      return createAudioContext().then((createdAudioContext) => {
        if (createdAudioContext.state === 'suspended') {
          return createdAudioContext.resume()
            .then(() => {
              if (createdAudioContext.state === 'running') setValid(true);
            });
        }
        return null;
      });
    }
    return audioContext.resume()
      .then(() => {
        if (audioContext.state === 'running') setValid(true);
      });
  }, [audioContext]);

  if (!valid) {
    return (
      <StartAudioOverlay>
        <StartAudioButton onClick={() => start()}>
          <Icon name="speaker-off" />
        </StartAudioButton>
      </StartAudioOverlay>
    );
  }
  return null;
};
export default AudioContextController;
