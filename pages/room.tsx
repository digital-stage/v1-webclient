import React, { useState } from 'react';
import {
  useIsStageAdmin,
  useStageActions,
  useCurrentStageId,
  useStage,
  useStageMembersByStage,
  useCustomStageMembers,
} from '../lib/use-digital-stage';
import debug from 'debug';
import { Button, Message, Select } from 'theme-ui';
import useImage from '../lib/useImage';
import Editor from '../components/room';
import RoomElement from '../components/room/RoomElement';

const report = debug('ThreeDAudio');

const Room = (): JSX.Element => {
  const { updateStageMember, setCustomStageMember, removeCustomStageMember } = useStageActions();
  const stageId = useCurrentStageId();
  const isStageAdmin = useIsStageAdmin();
  const stage = useStage(stageId);
  const stageMembers = useStageMembersByStage(stageId);
  const customStageMembers = useCustomStageMembers();
  const image = useImage('/static/icons/room-member.svg', 96, 96);
  const customImage = useImage('/static/icons/room-member-custom.svg', 96, 96);
  const [selected, setSelected] = useState<RoomElement>(undefined);
  const [globalMode, setGlobalMode] = useState<boolean>(isStageAdmin);

  if (stage) {
    return (
      <>
        <Editor
          sx={{
            width: '100vw',
            height: '100vh',
          }}
          elements={stageMembers.map((stageMember) => {
            if (!globalMode && customStageMembers.byStageMember[stageMember._id]) {
              const customStageMember =
                customStageMembers.byId[customStageMembers.byStageMember[stageMember._id]];
              return {
                ...stageMember,
                image: customImage,
                name: stageMember.name || stageMember._id,
                x: customStageMember.x,
                y: customStageMember.y,
                z: customStageMember.z,
                rX: customStageMember.rX,
                rY: customStageMember.rY,
                rZ: customStageMember.rZ,
                isGlobal: false,
                opacity: 0.8,
              };
            }
            return {
              ...stageMember,
              image: image,
              name: stageMember.name || stageMember._id,
              isGlobal: true,
              opacity: globalMode ? 0.8 : 0.4,
            };
          })}
          width={stage.width}
          height={stage.height}
          onChange={(element) => {
            if (globalMode && isStageAdmin) {
              report('Updating stage member');
              updateStageMember(element._id, {
                x: element.x,
                y: element.y,
                rZ: element.rZ,
              });
            } else {
              report('Updating custom stage member');
              report(element.x, element.y, element.rZ);
              setCustomStageMember(element._id, {
                x: element.x,
                y: element.y,
                rZ: element.rZ,
              });
            }
          }}
          onSelected={(element) => setSelected(element)}
          onDeselected={() => setSelected(undefined)}
        />
        <Button
          sx={{
            position: 'fixed',
            top: '2rem',
            right: '1rem',
          }}
          onClick={() => {
            if (globalMode && isStageAdmin) {
              // Also reset stage members
              stageMembers.forEach((stageMember) => {
                updateStageMember(stageMember._id, {
                  x: 0,
                  y: 0,
                  rZ: 0,
                });
              });
            } else {
              customStageMembers.allIds.forEach((id) => {
                removeCustomStageMember(id);
              });
            }
          }}
        >
          RESET ALL
        </Button>
        <Button
          sx={{
            position: 'fixed',
            top: '4rem',
            right: '1rem',
          }}
          onClick={() => {
            if (selected && !selected.isGlobal && customStageMembers.byStageMember[selected._id]) {
              const customStageMember =
                customStageMembers.byId[customStageMembers.byStageMember[selected._id]];
              console.log(customStageMember);
              if (customStageMember) {
                removeCustomStageMember(customStageMember._id);
              }
            }
          }}
          disabled={!selected}
        >
          RESET
        </Button>
        {globalMode && (
          <Message
            sx={{
              position: 'fixed',
              top: '4rem',
              left: '1rem',
            }}
          >
            MODIFYING GLOBAL VALUES
          </Message>
        )}
        {isStageAdmin ? (
          <Select
            sx={{
              position: 'fixed',
              top: '2rem',
              left: '1rem',
            }}
            defaultValue="global"
          >
            <option value="global">Global</option>
            <option value="monitor">Monitor</option>
          </Select>
        ) : null}
      </>
    );
  }

  return null;
};
export default Room;
