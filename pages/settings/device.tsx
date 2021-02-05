/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import SettingsLayout from '../../components/layout/SettingsLayout';
import SettingsNavigation from '../../components/settings/SettingsNavigation';
import SettingsPanel from '../../components/settings/SettingsPanel';
import { Box, Button, Checkbox, Divider, Grid, Heading, jsx, Label, Text } from 'theme-ui';
import useDigitalStage, {
  Device,
  useLocalDevice,
  useSelector,
  useStageActions,
} from '../../lib/use-digital-stage';
import SingleSelect from '../../digitalstage-ui/extra/SingleSelect';
import { useIntl } from 'react-intl';

const DeviceSettings = (): JSX.Element => {
  const { refreshLocalDevice } = useDigitalStage();
  const localDevice = useSelector<Device>(
    (state) => state.global.localDeviceId && state.devices.byId[state.global.localDeviceId]
  );
  const { updateDevice } = useStageActions();
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <SettingsLayout>
      <SettingsPanel sx={{ pb: 8 }}>
        <SettingsNavigation />
        {localDevice && (
          <React.Fragment>
            <Grid
              sx={{
                py: 3,
                alignItems: 'center',
              }}
              gap={6}
              columns={['1fr', '1fr 2fr']}
            >
              <Heading variant="h5">{f('videoDevice')}</Heading>
              <SingleSelect
                options={localDevice.inputVideoDevices || []}
                defaultValue={localDevice.inputVideoDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDevice(localDevice._id, {
                    inputVideoDeviceId: localDevice.inputVideoDevices[e.target.selectedIndex].id,
                  })
                }
              />
              <Heading variant="h5">{f('microphone')}</Heading>
              <SingleSelect
                options={localDevice.inputAudioDevices || []}
                defaultValue={localDevice.inputAudioDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  updateDevice(localDevice._id, {
                    inputAudioDeviceId: localDevice.inputAudioDevices[e.target.selectedIndex].id,
                  })
                }
              />

              <Heading variant="h5">{f('speaker')}</Heading>
              <SingleSelect
                options={localDevice.outputAudioDevices || []}
                defaultValue={localDevice.outputAudioDeviceId}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  updateDevice(localDevice._id, {
                    outputAudioDeviceId: localDevice.outputAudioDevices[e.target.selectedIndex].id,
                  });
                }}
              />

              <Heading variant="h5">{f('additionalOptions')}</Heading>
              <Box>
                <Label>
                  <Checkbox
                    checked={localDevice.echoCancellation || false}
                    defaultChecked={localDevice.echoCancellation || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateDevice(localDevice._id, {
                        echoCancellation: e.currentTarget.checked,
                      });
                    }}
                  />
                  {f('echoCancellation')}
                </Label>
                <Label>
                  <Checkbox
                    checked={localDevice.autoGainControl || false}
                    defaultChecked={localDevice.autoGainControl || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateDevice(localDevice._id, {
                        autoGainControl: e.currentTarget.checked,
                      });
                    }}
                  />
                  {f('autoGainControl')}
                </Label>
                <Label>
                  <Checkbox
                    checked={localDevice.noiseSuppression || false}
                    defaultChecked={localDevice.noiseSuppression || false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      updateDevice(localDevice._id, {
                        noiseSuppression: e.currentTarget.checked,
                      });
                    }}
                  />
                  {f('noiseSuppression')}
                </Label>
              </Box>
            </Grid>
          </React.Fragment>
        )}
        <Text variant="body" py={4}>
          {f('refreshDeviceDescription')}
        </Text>
        <Button variant="primary" mb={7} onClick={refreshLocalDevice}>
          {f('refreshDevice')}
        </Button>
      </SettingsPanel>
    </SettingsLayout>
  );
};
export default DeviceSettings;
