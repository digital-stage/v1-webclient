/** @jsxRuntime classic */
/** @jsx jsx */
import _ from 'lodash';
import Link from 'next/link';
import { Fragment, useCallback, useEffect } from 'react';
import { Box, Button, Heading, jsx } from 'theme-ui';
import Container from '../../components/Container';
import DeviceView from '../../components/new/elements/DeviceView';
import { useLocalDevice, useRemoteDevices } from '../../lib/use-digital-stage/hooks';
import useStageActions from '../../lib/use-digital-stage/useStageActions';
import enumerateDevices from '../../lib/use-digital-stage/utils/enumerateDevices';

const Index = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const remoteDevices = useRemoteDevices();

  const { updateDevice } = useStageActions();

  const refreshDevices = useCallback(() => {
    if (localDevice) {
      enumerateDevices().then((devices) => {
        if (
          !_.isEqual(localDevice.inputAudioDevices, devices.inputAudioDevices) ||
          !_.isEqual(localDevice.inputVideoDevices, devices.inputVideoDevices) ||
          !_.isEqual(localDevice.outputAudioDevices, devices.outputAudioDevices)
        ) {
          let inputAudioDeviceId;
          let outputAudioDeviceId;
          let inputVideoDeviceId = 'default';
          if (
            localDevice.inputAudioDeviceId &&
            devices.inputAudioDevices.find((d) => d.id === localDevice.inputAudioDeviceId)
          ) {
            inputAudioDeviceId = localDevice.inputAudioDeviceId;
          } else if (devices.inputAudioDevices.find((d) => d.id === 'label')) {
            inputAudioDeviceId = 'default';
          } else if (devices.inputAudioDevices.length > 0) {
            inputAudioDeviceId = devices.inputAudioDevices[0].id;
          }

          if (
            localDevice.outputAudioDeviceId &&
            devices.outputAudioDevices.find((d) => d.id === localDevice.outputAudioDeviceId)
          ) {
            outputAudioDeviceId = localDevice.outputAudioDeviceId;
          } else if (devices.outputAudioDevices.find((d) => d.id === 'label')) {
            outputAudioDeviceId = 'default';
          } else if (devices.outputAudioDevices.length > 0) {
            outputAudioDeviceId = devices.outputAudioDevices[0].id;
          }

          if (
            localDevice.inputVideoDeviceId &&
            devices.inputVideoDevices.find((d) => d.id === localDevice.inputVideoDeviceId)
          ) {
            inputVideoDeviceId = localDevice.inputVideoDeviceId;
          } else if (devices.inputVideoDevices.length === 1) {
            inputVideoDeviceId = devices.inputVideoDevices[0].id;
          }

          updateDevice(localDevice._id, {
            canAudio: devices.inputAudioDevices.length > 0,
            canVideo: devices.inputVideoDevices.length > 0,
            inputAudioDevices: devices.inputAudioDevices,
            inputVideoDevices: devices.inputVideoDevices,
            outputAudioDevices: devices.outputAudioDevices,
            inputAudioDeviceId,
            outputAudioDeviceId,
            inputVideoDeviceId,
          });
        }
      });
    }
  }, [localDevice]);

  useEffect(() => {
    if (localDevice) {
      navigator.mediaDevices.addEventListener('devicechange', () => {
        refreshDevices();
      });
    }
  }, [localDevice]);

  return (
    <Container>
      <Heading>Dieses Gerät</Heading>
      {localDevice && <DeviceView device={localDevice} />}
      <Box sx={{ my: '2rem' }}>
        <Button onClick={() => refreshDevices()}>Dieses Gerät aktualisieren</Button>
        <Link href="/test">
          <Button>Dieses Gerät testen</Button>
        </Link>
      </Box>
      {remoteDevices && remoteDevices.length > 0 && (
        <Fragment>
          <Heading>Meine anderen Geräte</Heading>
          {remoteDevices.map((remoteDevice, index) => (
            <DeviceView key={index} device={remoteDevice} />
          ))}
        </Fragment>
      )}
    </Container>
  );
};
export default Index;
