/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragmen **/
import { Box, Heading, jsx, Text } from 'theme-ui';
import { Device } from '../../lib/digitalstage/common/model.server';
import useStageActions from '../../lib/digitalstage/useStageActions';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import SingleSelect from '../new/elements/SingleSelect';

const AudioSettings = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
  }));
  const remoteDevices = useStageSelector<Device[]>((state) =>
    state.devices.remote.map((id) => state.devices.byId[id])
  );
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={3}>Lautstärkeregler</Heading>
      <Text mb={3}>Microphone</Text>
      <SingleSelect
        options={localDevice.inputAudioDevices || []}
        defaultValue={localDevice.inputAudioDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(localDevice._id, {
            inputAudioDeviceId: localDevice.inputAudioDevices[e.target.selectedIndex].id,
          })
        }
      />
      <Text my={3}>Speaker</Text>
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
          <Text>Remote audio devices</Text>
          {remoteDevices.map((remoteDevice, index) => (
            <div key={index}>
              <Text mb={3}>Microphone</Text>
              <SingleSelect
                options={remoteDevice.inputAudioDevices || []}
                defaultValue={remoteDevice.inputAudioDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDevice(remoteDevice._id, {
                    inputAudioDeviceId: remoteDevice.inputAudioDevices[e.target.selectedIndex].id,
                  })
                }
              />
              <Text my={3}>Speaker</Text>
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
