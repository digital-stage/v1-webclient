import {
  useCurrentStageId, useCustomStageMemberPositions,
  useCustomStageMemberVolumes,
  useIsStageAdmin,
  useStage,
  useStageActions,
  useStageMembersByStage,
} from '../../../lib/use-digital-stage';
import useImage from '../../../lib/useImage';
import RoomEditor, { RoomElement } from '../RoomEditor';
import React, { useState } from 'react';
import { Box, Button, Flex, Select, Text } from 'theme-ui';
import { useIntl } from 'react-intl';
import GlobalModeSelect from '../../../digitalstage-ui/extra/GlobalModeSelect';

const RoomManager = (): JSX.Element => {
  const { updateStageMember, setCustomStageMemberPosition, removeCustomStageMemberPosition } = useStageActions();
  const stageId = useCurrentStageId();
  const isStageAdmin = useIsStageAdmin();
  const stage = useStage(stageId);
  const stageMembers = useStageMembersByStage(stageId);
  const customStageMembers = useCustomStageMemberPositions();
  const image = useImage('/static/icons/room-member.svg', 96, 96);
  const customImage = useImage('/static/icons/room-member-custom.svg', 96, 96);
  const [selected, setSelected] = useState<RoomElement>(undefined);
  const [globalMode, setGlobalMode] = useState<boolean>(false);
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  if (stage) {
    return (
      <Flex
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          alignItems: 'flex-start',
        }}
      >
        {isStageAdmin ? (
          <React.Fragment>
            <GlobalModeSelect
              sx={{
                display: ['none', 'flex'],
                flexGrow: 0,
                width: 'auto',
              }}
              onChange={(globalMode) => setGlobalMode(globalMode)}
              global={globalMode}
            />
            <Text
              sx={{
                display: ['none', 'block'],
                px: 4,
                pb: 4,
              }}
              variant="micro"
            >
              {f(globalMode ? 'globalDescription' : 'monitorDescription')}
            </Text>
          </React.Fragment>
        ) : null}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
        >
          <RoomEditor
            sx={{
              position: 'relative',
              width: '100%',
              borderRadius: ['none', 'card'],
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
                updateStageMember(element._id, {
                  x: element.x,
                  y: element.y,
                  rZ: element.rZ,
                });
              } else {
                setCustomStageMemberPosition(element._id, {
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
              position: 'absolute',
              top: ['5rem', '2rem'],
              right: '1rem',
            }}
            onClick={() => {
              if (globalMode && isStageAdmin) {
                // Also reset stage members
                stageMembers.forEach((stageMember) => {
                  updateStageMember(stageMember._id, {
                    x: 0,
                    y: -1,
                    rZ: 180,
                  });
                });
              } else {
                customStageMembers.allIds.forEach((id) => {
                  removeCustomStageMemberPosition(id);
                });
              }
            }}
          >
            {f('resetAll')}
          </Button>
          {selected && (
            <Button
              sx={{
                position: 'absolute',
                top: ['8rem', '4rem'],
                right: '1rem',
              }}
              onClick={() => {
                if (selected) {
                  if (globalMode && isStageAdmin) {
                    updateStageMember(selected._id, {
                      x: 0,
                      y: -1,
                      rZ: 180,
                    });
                  } else {
                    if (customStageMembers.byStageMember[selected._id]) {
                      const customStageMember =
                        customStageMembers.byId[customStageMembers.byStageMember[selected._id]];
                      removeCustomStageMemberPosition(customStageMember._id);
                    }
                  }
                }
              }}
            >
              {f('reset')}
            </Button>
          )}
        </Box>

        {/* Mobile extra */}
        {isStageAdmin ? (
          <Box
            sx={{
              position: 'absolute',
              top: '0',
              left: '1rem',
              display: ['flex', 'none'],
            }}
          >
            <Select
              sx={{
                flexGrow: 0,
              }}
              onChange={(e) => setGlobalMode(e.target.value === 'global')}
              value={globalMode ? 'global' : 'monitor'}
            >
              <option value="global">{f('global')}</option>
              <option value="monitor">{f('monitor')}</option>
            </Select>
          </Box>
        ) : null}
      </Flex>
    );
  }

  if (stage) {
    return (
      <Flex
        sx={{
          width: '100%',
          height: '100%',
          flexDirection: 'column',
        }}
      >
        {isStageAdmin ? (
          <Select
            sx={{
              width: '100%',
              flexGrow: 0,
            }}
            onChange={(e) => setGlobalMode(e.target.value === 'global')}
            defaultValue="global"
          >
            <option value="global">{f('global')}</option>
            <option value="monitor">{f('monitor')}</option>
          </Select>
        ) : null}
        <Flex
          sx={{
            position: 'relative',
            width: '100%',
            flexGrow: 1,
            border: '1px solid red',
            borderRadius: ['none', '20px'],
          }}
        >
          <RoomEditor
            sx={{
              width: '100%',
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
                updateStageMember(element._id, {
                  x: element.x,
                  y: element.y,
                  rZ: element.rZ,
                });
              } else {
                setCustomStageMemberPosition(element._id, {
                  x: element.x,
                  y: element.y,
                  rZ: element.rZ,
                });
              }
            }}
            onSelected={(element) => setSelected(element)}
            onDeselected={() => setSelected(undefined)}
          />
        </Flex>
      </Flex>
    );
  }

  return null;
};
export default RoomManager;
