/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragmen **/
import { Box, Heading, jsx, Text } from 'theme-ui';
import SingleSelect from '../new/elements/SingleSelect';
import { Device } from '../../lib/use-digital-stage/types';
import { useSelector } from '../../lib/use-digital-stage/hooks';
import useStageActions from '../../lib/use-digital-stage/useStageActions';

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
      <Text mb={3}>Mikrofon</Text>
      <SingleSelect
        options={localDevice.inputAudioDevices || []}
        defaultValue={localDevice.inputAudioDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(localDevice._id, {
            inputAudioDeviceId: localDevice.inputAudioDevices[e.target.selectedIndex].id,
          })
        }
      />
      <Text my={3}>Lautsprecher</Text>
      <SingleSelect
        options={localDevice.outputAudioDevices || []}
        defaultValue={localDevice.outputAudioDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          updateDevice(localDevice._id, {
            outputAudioDeviceId: localDevice.outputAudioDevices[e.target.selectedIndex].id,
          });
        }}
      />
      {remoteDevices && remoteDevices.length > 0 && (
        <>
          <Text>Remote Audiogeräte</Text>
          {remoteDevices.map((remoteDevice, index) => (
            <div key={index}>
              <Text mb={3}>Mikrofon</Text>
              <SingleSelect
                options={remoteDevice.inputAudioDevices || []}
                defaultValue={remoteDevice.inputAudioDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDevice(remoteDevice._id, {
                    inputAudioDeviceId: remoteDevice.inputAudioDevices[e.target.selectedIndex].id,
                  })
                }
              />
              <Text my={3}>Lautsprecher</Text>
              <SingleSelect
                options={remoteDevice.outputAudioDevices || []}
                defaultValue={remoteDevice.outputAudioDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  updateDevice(remoteDevice._id, {
                    outputAudioDeviceId: remoteDevice.outputAudioDevices[e.target.selectedIndex].id,
                  });
                }}
              />
            </div>
          ))}
        </>
      )}
    </Box>
  );
};

export default AudioSettings;
