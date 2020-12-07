/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Flex, Button, IconButton, Heading } from 'theme-ui';
import { FaPlus, FaPen, FaTrash } from 'react-icons/fa';
import InviteModal from './InviteModal';
import ModifyGroupModal from './ModifyGroupModal';
import CreateGroupModal from './CreateGroupModal';
import {
  useCurrentGroupId,
  useCurrentStageId,
  useCurrentUser,
  useGroups,
} from '../../../../lib/use-digital-stage/hooks';
import { Group, Stage } from '../../../../lib/use-digital-stage/types';
import useStageActions from '../../../../lib/use-digital-stage/useStageActions';
import useStageJoiner from '../../../../lib/useStageJoiner';
import useAudioContext from '../../../../lib/useAudioContext';
import ConfirmationModal from '../../../ConfirmationModal';

const StageGroupList = (props: { stage: Stage }): JSX.Element => {
  const groups = useGroups();
  const currentStageId = useCurrentStageId();
  const currentGroupId = useCurrentGroupId();
  const { _id: userId } = useCurrentUser();
  const { removeGroup, leaveStage } = useStageActions();
  const { requestJoin } = useStageJoiner();
  const [currentStage, setCurrentStage] = React.useState<Stage>();
  const [currentGroup, setCurrentGroup] = React.useState<Group>();
  const [isCreateGroupOpen, setCreateGroupIsOpen] = React.useState<boolean>(false);
  const [isModifyGroupOpen, setModifyGroupIsOpen] = React.useState<boolean>(false);
  const [isCopyLinkOpen, setCopyLinkOpen] = React.useState<boolean>();
  const { audioContext, started } = useAudioContext();
  const [openConfirmationModal, setConfirmationModalOpen] = React.useState<boolean>(false);
  const [groupId, setGroupId] = React.useState<string>();

  const { stage } = props;

  const isAdmin = stage.admins.indexOf(userId) !== -1;

  return (
    <Box sx={{ bg: 'gray.5', mx: '-32px', px: '38px', py: 3 }}>
      {groups.byStage[stage._id] &&
        groups.byStage[stage._id].map((groupId) => {
          const group = groups.byId[groupId];

          return (
            <React.Fragment key={group._id}>
              <Flex sx={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                <Flex sx={{ alignItems: 'center', my: 2 }}>
                  <Box
                    bg="primary"
                    sx={{
                      minWidth: 'group.width',
                      minHeight: 'group.height',
                      borderRadius: '50%',
                      mr: 3,
                    }}
                  />
                  <Heading as="h3" sx={{ color: 'gray.0', flexBasis: 'max-content' }}>
                    {group.name}
                  </Heading>
                </Flex>

                <Flex sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                  {isAdmin && (
                    <Box>
                      <IconButton
                        aria-label="Gruppe bearbeiten"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setModifyGroupIsOpen((prevState) => !prevState);
                        }}
                      >
                        <FaPen />
                      </IconButton>
                      <IconButton
                        aria-label="Gruppe entfernen"
                        onClick={() => {
                          setGroupId(group._id);
                          setConfirmationModalOpen(true);
                        }}
                      >
                        <FaTrash />
                      </IconButton>
                    </Box>
                  )}

                  <Box>
                    {isAdmin && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setCopyLinkOpen((prevState) => !prevState);
                        }}
                      >
                        Einladen
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (audioContext && !started) audioContext.resume();
                        if (
                          currentStageId &&
                          stage._id === currentStageId &&
                          group._id === currentGroupId
                        ) {
                          leaveStage();
                        } else {
                          requestJoin(stage._id, group._id, stage.password);
                        }
                      }}
                    >
                      {currentStageId &&
                        stage._id === currentStageId &&
                        group._id === currentGroupId
                        ? 'Verlassen'
                        : 'Betreten'}
                    </Button>
                  </Box>
                </Flex>
              </Flex>
            </React.Fragment>
          );
        })}

      {isAdmin && (
        <Flex my={2}>
          <Button
            variant="text"
            onClick={() => {
              setCurrentStage(stage);
              setCreateGroupIsOpen(true);
            }}
          >
            <Box
              as="span"
              sx={{
                color: 'secondary',
                textAlign: 'center',
                pt: 2,
                mr: [2, null, 3],
              }}
            >
              <FaPlus />
            </Box>{' '}
            Neue Gruppe erstellen
          </Button>
        </Flex>
      )}
      <CreateGroupModal
        stage={currentStage}
        isOpen={isCreateGroupOpen}
        onClose={() => setCreateGroupIsOpen(false)}
      />
      <ModifyGroupModal
        group={currentGroup}
        isOpen={isModifyGroupOpen}
        onClose={() => setModifyGroupIsOpen(false)}
      />
      <InviteModal
        stage={currentStage}
        group={currentGroup}
        onClose={() => setCopyLinkOpen(false)}
        isOpen={isCopyLinkOpen}
      />
      <ConfirmationModal
        isOpen={openConfirmationModal}
        onClose={() => setConfirmationModalOpen(false)}
        onConfirm={() => {
          removeGroup(groupId);
          setConfirmationModalOpen(false);
        }}
      />
    </Box>
  );
};

export default StageGroupList;
