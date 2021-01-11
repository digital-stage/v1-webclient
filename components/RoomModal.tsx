/** @jsxRuntime classic */
/** @jsx jsx */
import {
  useCurrentStageId,
  useCustomStageMembers,
  useIsStageAdmin,
  useStage,
  useStageActions,
  useStageMembersByStage,
} from '../lib/use-digital-stage';
import useImage from '../lib/useImage';
import React, { useState } from 'react';
import RoomElement from './room/RoomElement';
import Editor from './room';
import { Box, Button, Flex, jsx, Message, Select, Text } from 'theme-ui';
import SingleSelect from './old/ui/SingleSelect';
import digitalStageTheme from '../digitalstage-ui/theme/DigitalStageTheme';
import Modal from '../digitalstage-ui/elements/surface/Modal';

const RoomModal = (props: { isOpen: boolean; onClose(): void }): JSX.Element => {
  const { isOpen, onClose } = props;
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
      <Modal size="full" open={isOpen} onClose={onClose} closable={true}>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            paddingTop: '3rem',
            paddingLeft: '2rem',
            paddingRight: '2rem',
            paddingBottom: '2rem',
          }}
        >
          <Flex
            sx={{
              position: 'relative',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
          >
            {isStageAdmin ? (
              <>
                <SingleSelect
                  options={[
                    {
                      id: 'global',
                      label: 'Global',
                    },
                    {
                      id: 'monitor',
                      label: 'Monitor',
                    },
                  ]}
                  onChange={(e) => {
                    console.log(e.currentTarget.value);
                    setGlobalMode(e.target.value === 'global');
                  }}
                />
                <Text
                  sx={{
                    paddingTop: '1rem',
                  }}
                >
                  {globalMode ? (
                    <>
                      Deine Einstellungen werden für alle Nutzer in dieser Bühne verwendet und
                      synchronisiert.
                    </>
                  ) : (
                    <>Deine Einstellungen gelten nur für Dich persönlich.</>
                  )}
                </Text>
              </>
            ) : null}

            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Button
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
                ALLE LÖSCHEN
              </Button>
              <Button
                onClick={() => {
                  if (
                    selected &&
                    !selected.isGlobal &&
                    customStageMembers.byStageMember[selected._id]
                  ) {
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
                AUSGEWÄHLTES LÖSCHEN
              </Button>
            </Box>
            <Editor
              sx={{
                position: 'relative',
                flexGrow: 1,
                width: '100%',
                borderRadius: '18px',
                backgroundColor: digitalStageTheme.colors.modalBg,
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
          </Flex>
        </Box>
      </Modal>
    );
  }

  return null;
};

export default RoomModal;
