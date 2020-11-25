/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button } from 'theme-ui';
import { useStyletron } from 'styletron-react';
import { styled } from 'baseui';
import { Card, StyledAction, StyledBody } from 'baseui/card/index';
import { Checkbox } from 'baseui/checkbox/index';
import { Check, Delete } from 'baseui/icon/index';
import SingleSelect from './SingleSelect';
import { Device } from '../../../lib/use-digital-stage';
import useStageActions from '../../../lib/use-digital-stage/useStageActions';

const CardTitle = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const DeviceView = (props: { device?: Device }) => {
  const { device } = props;
  const { updateDevice } = useStageActions();
  const [css] = useStyletron();

  if (!device) return null;

  return (
    <Card
      title={
        <CardTitle>
          {device.name} ({device._id}){device.online ? <Check size={32} /> : <Delete size={32} />}
        </CardTitle>
      }
    >
      <StyledBody>
        <Checkbox checked={device.canVideo} disabled>
          canVideo
        </Checkbox>
        <Checkbox checked={device.canAudio} disabled>
          canAudio
        </Checkbox>
      </StyledBody>
      <StyledAction>
        <div
          className={css({
            width: '100%',
            display: 'flex',
          })}
        >
          <Button
            variant={device.sendVideo ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(props.device._id, {
                sendVideo: !props.device.sendVideo,
              });
            }}
          >
            Send video
          </Button>
          <Button
            variant={device.sendAudio ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(props.device._id, {
                sendAudio: !props.device.sendAudio,
              });
            }}
          >
            Send Audio
          </Button>
          <Button
            variant={device.receiveVideo ? 'primary' : 'secondary'}
            onClick={() => {
              updateDevice(props.device._id, {
                receiveVideo: !props.device.receiveVideo,
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
        </div>
        <div
          className={css({
            width: '100%',
            display: 'flex',
            flexWrap: 'wrap',
          })}
        >
          <SingleSelect
            options={device.inputAudioDevices || []}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateDevice(device._id, {
                inputAudioDeviceId: e.target.id,
              })
            }
          />
          <SingleSelect
            options={device.outputAudioDevices || []}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateDevice(device._id, {
                inputAudioDeviceId: e.target.id,
              })
            }
          />
          <SingleSelect
            options={device.inputVideoDevices || []}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              updateDevice(device._id, {
                inputAudioDeviceId: e.target.id,
              })
            }
            // onSelect={(id) =>
            //   updateDevice(device._id, {
            //     inputVideoDeviceId: id,
            //   })
            // }
          />
        </div>
      </StyledAction>
    </Card>
  );
};

export default DeviceView;
