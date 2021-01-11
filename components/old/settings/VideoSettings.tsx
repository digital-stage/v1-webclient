/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragmen **/
import React from 'react';
import { Box, Heading, jsx, Text } from 'theme-ui';
import SingleSelect from '../ui/SingleSelect';
import { useLocalDevice, useRemoteDevices } from '../../../lib/use-digital-stage/hooks';
import useStageActions from '../../../lib/use-digital-stage/useStageActions';

const VideoSettings = (): JSX.Element => {
  const localDevice = useLocalDevice();
  const remoteDevices = useRemoteDevices();
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={5}>Videogeräte</Heading>
      <Text mb={3} variant="h5">
        Lokale Geräte
      </Text>
      <SingleSelect
        options={localDevice.inputVideoDevices || []}
        defaultValue={localDevice.inputVideoDeviceId}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateDevice(localDevice._id, {
            inputVideoDeviceId: localDevice.inputVideoDevices[e.target.selectedIndex].id,
          })
        }
      />
      {remoteDevices && remoteDevices.length > 0 && (
        <React.Fragment>
          <Text sx={{ my: 4 }} variant="h4">
            Remote Geräte
          </Text>
          {remoteDevices.map((remoteDevice, index) => (
            <div key={index}>
              <Text mb={3} variant="h5">
                Videogerät
              </Text>
              <SingleSelect
                options={remoteDevice.inputVideoDevices || []}
                defaultValue={remoteDevice.inputVideoDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDevice(remoteDevice._id, {
                    inputVideoDeviceId: remoteDevice.inputVideoDevices[e.target.selectedIndex].id,
                  })
                }
              />
            </div>
          ))}
        </React.Fragment>
      )}
    </Box>
  );
};

export default VideoSettings;
