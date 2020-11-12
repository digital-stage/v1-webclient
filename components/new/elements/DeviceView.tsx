import React from 'react';
import { useStyletron } from 'styletron-react';
import { styled } from 'baseui';
import { Card, StyledAction, StyledBody } from 'baseui/card/index';
import { Checkbox } from 'baseui/checkbox/index';
import { Check, Delete } from 'baseui/icon/index';
import { Button, KIND, SIZE } from 'baseui/button/index';
import SingleSelect from './SingleSelect';
import { Device } from '../../../lib/digitalstage/common/model.server';
import useStageActions from '../../../lib/digitalstage/useStageActions';

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
            size={SIZE.compact}
            kind={device.sendVideo ? KIND.primary : KIND.secondary}
            onClick={() => {
              updateDevice(props.device._id, {
                sendVideo: !props.device.sendVideo,
              });
            }}
          >
            Send video
          </Button>
          <Button
            size={SIZE.compact}
            isSelected={device.sendAudio}
            kind={device.sendAudio ? KIND.primary : KIND.secondary}
            onClick={() => {
              updateDevice(props.device._id, {
                sendAudio: !props.device.sendAudio,
              });
            }}
          >
            Send Audio
          </Button>
          <Button
            size={SIZE.compact}
            kind={device.receiveVideo ? KIND.primary : KIND.secondary}
            onClick={() => {
              updateDevice(props.device._id, {
                receiveVideo: !props.device.receiveVideo,
              });
            }}
          >
            Receive Video
          </Button>
          <Button
            size={SIZE.compact}
            kind={device.receiveAudio ? KIND.primary : KIND.secondary}
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
        </div>
      </StyledAction>
    </Card>
  );
};

export default DeviceView;
