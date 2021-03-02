import React from 'react';
import SettingsLayout from '../../components/layout/SettingsLayout';
import SettingsNavigation from '../../components/settings/SettingsNavigation';
import useDevices from '../../lib/use-digital-stage/hooks/useDevices';
import { useSelector, useStageActions } from '../../lib/use-digital-stage';
import { Flex, Heading } from '@theme-ui/components';
import { useIntl } from 'react-intl';
import { Box, Checkbox, Grid, jsx, Label } from 'theme-ui';
import SingleSelect from '../../digitalstage-ui/extra/SingleSelect';

const DeviceSettings = (): JSX.Element => {
  const localDeviceId = useSelector<string>((state) => state.global.localDeviceId);
  const devices = useDevices();
  const { updateDevice } = useStageActions();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <SettingsLayout>
      <SettingsNavigation />
      <Flex
        sx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}
      >
        {devices.allIds
          .filter((deviceId) => deviceId !== localDeviceId)
          .map((deviceId) => devices.byId[deviceId])
          .map((device) => (
            <Flex
              sx={{
                flexDirection: 'column',
                boxShadow: 'default',
                bg: 'gray.7',
                borderRadius: 'card',
                p: 4,
                m: 4,
                width: ['100%', '100%', 'auto'],
              }}
            >
              {device.canOv ? (
                <Heading>
                  {f('nativeClient')} {device.name}
                </Heading>
              ) : (
                <Heading>
                  {f('webClient')} {device.name}
                </Heading>
              )}

              <Grid
                sx={{
                  py: 3,
                  alignItems: 'center',
                }}
                gap={6}
                columns={['1fr', '1fr 2fr']}
              ></Grid>
              {device.canVideo && (
                <React.Fragment>
                  <Heading variant="h5">{f('videoDevice')}</Heading>
                  <SingleSelect
                    options={device.inputVideoDevices || []}
                    defaultValue={device.inputVideoDeviceId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateDevice(device._id, {
                        inputVideoDeviceId: device.inputVideoDevices[e.target.selectedIndex].id,
                      })
                    }
                  />
                </React.Fragment>
              )}
              {device.canAudio && (
                <React.Fragment>
                  <Heading variant="h5">{f('microphone')}</Heading>
                  <SingleSelect
                    options={device.inputAudioDevices || []}
                    defaultValue={device.inputAudioDeviceId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      updateDevice(device._id, {
                        inputAudioDeviceId: device.inputAudioDevices[e.target.selectedIndex].id,
                      })
                    }
                  />
                  <Heading variant="h5">{f('speaker')}</Heading>
                  <SingleSelect
                    options={device.outputAudioDevices || []}
                    defaultValue={device.outputAudioDeviceId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      updateDevice(device._id, {
                        outputAudioDeviceId: device.outputAudioDevices[e.target.selectedIndex].id,
                      });
                    }}
                  />

                  <Heading variant="h5">{f('additionalOptions')}</Heading>
                  <Box>
                    <Label>
                      <Checkbox
                        checked={device.echoCancellation || false}
                        defaultChecked={device.echoCancellation || false}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          updateDevice(device._id, {
                            echoCancellation: e.currentTarget.checked,
                          });
                        }}
                      />
                      {f('echoCancellation')}
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
                      />
                      {f('autoGainControl')}
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
                      />
                      {f('noiseSuppression')}
                    </Label>
                  </Box>
                </React.Fragment>
              )}
            </Flex>
          ))}
      </Flex>
    </SettingsLayout>
  );
};
export default DeviceSettings;
