import React, { useCallback, useState } from 'react';
import { ListItem, ListItemLabel } from 'baseui/list';
import { Button } from 'baseui/button';
import { Check, Delete } from 'baseui/icon';
import { DisplayMedium } from 'baseui/typography';
import { Notification } from 'baseui/notification';
import { KIND } from 'baseui/toast';
import Container from '../components/ui/Container';
import { useLocalDevice } from '../lib/use-digital-stage/hooks';

const Test = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const [error, setError] = useState<string>();
  const [videoTested, setVideoTested] = useState<boolean>();
  const [audioTested, setAudioTested] = useState<boolean>();

  const testAudio = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: false,
        audio:
          localDevice && localDevice.inputAudioDeviceId
            ? {
                deviceId: localDevice.inputAudioDeviceId,
              }
            : true,
      })
      .then((stream) => {
        if (stream.getAudioTracks().length > 0) {
          setAudioTested(true);
        } else {
          setError('Audiogerät ist nicht korrekt konfiguriert');
        }
        stream.getAudioTracks().forEach((track) => track.stop());
      })
      .catch((userMediaError) => setError(userMediaError.message));
  }, [localDevice]);

  const testVideo = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video:
          localDevice && localDevice.inputAudioDeviceId
            ? {
                deviceId: localDevice.inputAudioDeviceId,
              }
            : true,
      })
      .then((stream) => {
        if (stream.getVideoTracks().length > 0) {
          setVideoTested(true);
        } else {
          setError('Videogerät ist nicht korrekt konfiguriert');
        }
        stream.getVideoTracks().forEach((track) => track.stop());
      })
      .catch((userMediaError) => setError(userMediaError.message));
  }, [localDevice]);

  return (
    <Container>
      <DisplayMedium>Test</DisplayMedium>
      <>
        {error && (
          <Notification kind={KIND.negative}>
            {error === 'Permission denied' ? 'Bitte aktiviere der Gerät' : error}
          </Notification>
        )}
        <ListItem
          endEnhancer={() => <ListItemLabel>{audioTested ? <Check /> : <Delete />}</ListItemLabel>}
        >
          <ListItemLabel>
            {audioTested ? (
              'Audiogerät verfügbar'
            ) : (
              <Button onClick={() => testAudio()}>Teste Audiogerät</Button>
            )}
          </ListItemLabel>
        </ListItem>
        <ListItem
          endEnhancer={() => <ListItemLabel>{videoTested ? <Check /> : <Delete />}</ListItemLabel>}
        >
          <ListItemLabel>
            {videoTested ? (
              'Videogerät verfügbar'
            ) : (
              <Button onClick={() => testVideo()}>Teste Videogerät</Button>
            )}
          </ListItemLabel>
        </ListItem>
      </>
    </Container>
  );
};

export default Test;
