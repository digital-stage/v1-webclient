/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { Box, Heading, jsx, Text } from 'theme-ui';
import useStageActions from '../../lib/digitalstage/useStageActions';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import SingleSelect from '../new/elements/SingleSelect';

const VideoSettings = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
  }));
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={3}>Kameraeinstellungen</Heading>
      <Text mb={3}>Video device</Text>
      <SingleSelect
        options={localDevice.inputVideoDevices || []}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(localDevice._id, {
            inputVideoDeviceId: localDevice.inputVideoDevices[e.target.selectedIndex].id,
          })
        }
      />
    </Box>
  );
};

export default VideoSettings;
