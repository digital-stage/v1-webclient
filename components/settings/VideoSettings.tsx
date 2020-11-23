/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
/** @jsxFrag React.Fragmen **/
import React from 'react';
import { Box, Heading, jsx, Text } from 'theme-ui';
import { Device } from '../../lib/digitalstage/common/model.server';
import useStageActions from '../../lib/digitalstage/useStageActions';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import SingleSelect from '../new/elements/SingleSelect';

const VideoSettings = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
  }));
  const remoteDevices = useStageSelector<Device[]>((state) =>
    state.devices.remote.map((id) => state.devices.byId[id])
  );
  const { updateDevice } = useStageActions();

  return (
    <Box>
      <Heading mb={3}>Videogeräte</Heading>
      <Text mb={3}>Lokale Geräte</Text>
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
        <>
          <Text>Remote Geräte</Text>
          {remoteDevices.map((remoteDevice, index) => (
            <div key={index}>
              <Text mb={3}>Videogerät</Text>
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
        </>
      )}
    </Box>
  );
};

export default VideoSettings;
