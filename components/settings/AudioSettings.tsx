/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Heading, jsx, Text } from 'theme-ui';
import useStageActions from '../../lib/digitalstage/useStageActions';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import SingleSelect from '../new/elements/SingleSelect';

const AudioSettings = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
  }));
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={3}>Lautstärkeregler</Heading>
      <Text mb={3}>Microphone</Text>
      <SingleSelect
        options={localDevice.inputAudioDevices || []}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(localDevice._id, {
            inputAudioDeviceId: localDevice.inputAudioDevices[e.target.selectedIndex].id,
          })
        }
      />
      <Text my={3}>Speaker</Text>
      <SingleSelect
        options={localDevice.outputAudioDevices || []}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          updateDevice(localDevice._id, {
            outputAudioDeviceId: localDevice.outputAudioDevices[e.target.selectedIndex].id,
          });
        }}
      />
    </Box>
  );
};

export default AudioSettings;
