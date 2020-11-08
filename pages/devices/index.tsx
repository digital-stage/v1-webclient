import React, { useCallback, useEffect } from 'react';
import { Button } from 'baseui/button';
import Link from 'next/link';
import { useStyletron } from 'baseui';
import _ from 'lodash';
import DeviceView from '../../components/new/elements/DeviceView';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import { Device } from '../../lib/digitalstage/common/model.server';
import enumerateDevices from '../../lib/digitalstage/useStageContext/utils';
import useStageActions from '../../lib/digitalstage/useStageActions';
import Container from '../../components/Container';

const Index = () => {
  const localDevice = useStageSelector<Device>(state =>
    state.devices.local ? state.devices.byId[state.devices.local] : undefined
  );
  const remoteDevices = useStageSelector<Device[]>(state =>
    state.devices.remote.map(id => state.devices.byId[id])
  );
  const [css] = useStyletron();

  const { updateDevice } = useStageActions();

  const refreshDevices = useCallback(() => {
    if (localDevice) {
      enumerateDevices().then(devices => {
        if (
          !_.isEqual(
            localDevice.inputAudioDevices,
            devices.inputAudioDevices
          ) ||
          !_.isEqual(
            localDevice.inputVideoDevices,
            devices.inputVideoDevices
          ) ||
          !_.isEqual(localDevice.outputAudioDevices, devices.outputAudioDevices)
        ) {
          let inputAudioDeviceId;
          let outputAudioDeviceId;
          let inputVideoDeviceId = 'default';
          if (
            localDevice.inputAudioDeviceId &&
            devices.inputAudioDevices.find(
              d => d.id === localDevice.inputAudioDeviceId
            )
          ) {
            inputAudioDeviceId = localDevice.inputAudioDeviceId;
          } else if (devices.inputAudioDevices.find(d => d.id === 'label')) {
            inputAudioDeviceId = 'default';
          } else if (devices.inputAudioDevices.length > 0) {
            inputAudioDeviceId = devices.inputAudioDevices[0].id;
          }

          if (
            localDevice.outputAudioDeviceId &&
            devices.outputAudioDevices.find(
              d => d.id === localDevice.outputAudioDeviceId
            )
          ) {
            outputAudioDeviceId = localDevice.outputAudioDeviceId;
          } else if (devices.outputAudioDevices.find(d => d.id === 'label')) {
            outputAudioDeviceId = 'default';
          } else if (devices.outputAudioDevices.length > 0) {
            outputAudioDeviceId = devices.outputAudioDevices[0].id;
          }

          if (
            localDevice.inputVideoDeviceId &&
            devices.inputVideoDevices.find(
              d => d.id === localDevice.inputVideoDeviceId
            )
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
            inputVideoDeviceId
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
      <h2>Dieses Gerät</h2>
      {localDevice && <DeviceView device={localDevice} />}
      <div
        className={css({
          marginTop: '2rem',
          marginBottom: '2rem'
        })}
      >
        <Button onClick={() => refreshDevices()}>
          Dieses Gerät aktualisieren
        </Button>
        <Link href="/test">
          <Button>Dieses Gerät testen</Button>
        </Link>
      </div>
      {remoteDevices && remoteDevices.length > 0 && (
        <>
          <h2>Meine anderen Geräte</h2>
          {remoteDevices.map(remoteDevice => (
            <DeviceView device={remoteDevice} />
          ))}
        </>
      )}
    </Container>
  );
};
export default Index;
