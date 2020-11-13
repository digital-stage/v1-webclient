/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Flex } from 'theme-ui';
import { useStyletron } from 'styletron-react';
import { StyledAction, StyledBody } from 'baseui/card/index';
import { Checkbox } from 'baseui/checkbox/index';
import { Check, Delete } from 'baseui/icon/index';
import SingleSelect from './SingleSelect';
import Card from '../../Card';
import { Device } from '../../../lib/digitalstage/common/model.server';
import useStageActions from '../../../lib/digitalstage/useStageActions';

const DeviceView = ({ device }: { device?: Device }): JSX.Element => {
  const { updateDevice } = useStageActions();
  const [css] = useStyletron();

  if (!device) return null;

  return (
    <Card>
      <Flex sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {device.name} ({device._id}){device.online ? <Check size={32} /> : <Delete size={32} />}
      </Flex>
      <StyledBody>
        <Checkbox checked={device.canVideo} disabled>
          canVideo
        </Checkbox>
        <Checkbox checked={device.canAudio} disabled>
          canAudio
        </Checkbox>
      </StyledBody>
      <StyledAction>
        <Flex sx={{ width: '100%' }}>
          <Button
            variant={device.sendVideo ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(device._id, {
                sendVideo: !device.sendVideo,
              });
            }}
          >
            Send video
          </Button>
          <Button
            variant={device.sendAudio ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(device._id, {
                sendAudio: !device.sendAudio,
              });
            }}
          >
            Send Audio
          </Button>
          <Button
            variant={device.receiveVideo ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(device._id, {
                receiveVideo: !device.receiveVideo,
              });
            }}
          >
            Receive Video
          </Button>
          <Button
            variant={device.receiveAudio ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(device._id, {
                receiveAudio: !device.receiveAudio,
              });
            }}
          >
            Receive Audio
          </Button>
        </Flex>
        <Flex sx={{ flexWrap: 'wrap', width: '100%' }}>
          <SingleSelect
            className={css({
              flexBasis: 0,
              maxWidth: '100%',
              flexGrow: 1,
            })}
            options={device.inputAudioDevices || []}
            id={device.inputAudioDeviceId}
            onSelect={(id) =>
              updateDevice(device._id, {
                inputAudioDeviceId: id,
              })
            }
          />
          <SingleSelect
            className={css({
              flexBasis: 0,
              maxWidth: '100%',
              flexGrow: 1,
            })}
            options={device.outputAudioDevices || []}
            id={device.outputAudioDeviceId}
            onSelect={(id) =>
              updateDevice(device._id, {
                outputAudioDeviceId: id,
              })
            }
          />
          <SingleSelect
            className={css({
              flexBasis: 0,
              maxWidth: '100%',
              flexGrow: 1,
            })}
            options={device.inputVideoDevices || []}
            id={device.inputVideoDeviceId}
            onSelect={(id) =>
              updateDevice(device._id, {
                inputVideoDeviceId: id,
              })
            }
          />
        </Flex>
      </StyledAction>
    </Card>
  );
};

export default DeviceView;
