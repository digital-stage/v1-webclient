/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragmen **/
import React from 'react';
import { Box, Heading, jsx, Text, Checkbox, Label } from 'theme-ui';
import SingleSelect from '../new/elements/SingleSelect';
import { Device } from '../../lib/use-digital-stage/types';
import { useSelector } from '../../lib/use-digital-stage/hooks';
import useStageActions from '../../lib/use-digital-stage/useStageActions';

const SingleDeviceAudioSettings = (props: {
  device: Device;
  updateDevice(id: string, device: Partial<Device>): void;
}) => {
  const { device, updateDevice } = props;

  return (
    <React.Fragment>
      <Text mb={3}>Mikrofon</Text>
      <SingleSelect
        options={device.inputAudioDevices || []}
        defaultValue={device.inputAudioDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(device._id, {
            inputAudioDeviceId: device.inputAudioDevices[e.target.selectedIndex].id,
          })
        }
      />
      <Text my={3}>Lautsprecher</Text>
      <SingleSelect
        options={device.outputAudioDevices || []}
        defaultValue={device.outputAudioDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          updateDevice(device._id, {
            outputAudioDeviceId: device.outputAudioDevices[e.target.selectedIndex].id,
          });
        }}
      />
      <Label>
        <Checkbox
          checked={device.echoCancellation || false}
          defaultChecked={device.echoCancellation || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDevice(device._id, {
              echoCancellation: e.currentTarget.checked,
            });
          }}
        />{' '}
        Feedback aktiv unterdrücken
      </Label>
      <Label>
        <Checkbox
          checked={device.autoGainControl || false}
          defaultChecked={device.autoGainControl || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDevice(device._id, {
              autoGainControl: e.currentTarget.checked,
            });
          }}
        />{' '}
        Eingangspegel automatisch festlegen
      </Label>
      <Label>
        <Checkbox
          checked={device.noiseSuppression || false}
          defaultChecked={device.noiseSuppression || false}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateDevice(device._id, {
              noiseSuppression: e.currentTarget.checked,
            });
          }}
        />{' '}
        Hintergrundgeräusche unterdrücken
      </Label>
    </React.Fragment>
  );
};

const AudioSettings = (): JSX.Element => {
  const localDevice = useSelector((state) =>
    state.global.localDeviceId ? state.devices.byId[state.global.localDeviceId] : undefined
  );
  const devices = useSelector<Device[]>((state) =>
    state.devices.allIds.map((id) => state.devices.byId[id])
  );
  const remoteDevices = devices.filter((device) => device._id !== localDevice._id);
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={3}>Audiogeräte</Heading>
      <SingleDeviceAudioSettings device={localDevice} updateDevice={updateDevice} />
      {remoteDevices && remoteDevices.length > 0 ? (
        <React.Fragment>
          <Text sx={{ my: 3 }}>Remote Audiogeräte</Text>
          {remoteDevices.map((device) => (
            <SingleDeviceAudioSettings
              key={device._id}
              device={device}
              updateDevice={updateDevice}
            />
          ))}
        </React.Fragment>
      ) : null}
    </Box>
  );
};

export default AudioSettings;
