import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import { Groups, NormalizedState } from '../../../../lib/digitalstage/useStageContext/schema';
import { useSelector } from '../../../../lib/digitalstage/useStageContext/redux';
import useStageActions from '../../../../lib/digitalstage/useStageActions';
import { Client } from '../../../../lib/digitalstage/common/model.client';
import { useRequest } from '../../../../lib/useRequest';
import InviteModal from './InviteModal';
import ModifyStageModal from './ModifyStageModal';
import ModifyGroupModal from './ModifyGroupModal';
import CreateStageModal from './CreateStageModal';
import CreateGroupModal from './CreateGroupModal';
import useStageSelector, { useStages } from '../../../../lib/digitalstage/useStageSelector';
import { IconButton, Button, Flex, Avatar, Heading, Box } from 'theme-ui';
import Icon from '../../../base/Icon';
import Collapse from '../../../collapse/Collapse';
import CollapseTitle from '../../../collapse/CollapseTitle';

const StageListView = () => {
  const stages = useStages();
  const groups = useStageSelector<Groups>((state) => state.groups);
  const currentStageId = useSelector<NormalizedState, string | undefined>((state) => state.stageId);
  const currentGroupId = useSelector<NormalizedState, string | undefined>((state) => state.groupId);
  const {
    removeStage, removeGroup, leaveStage, leaveStageForGood,
  } = useStageActions();
  const { setRequest } = useRequest();
  const [currentStage, setCurrentStage] = useState<Client.Stage>();
  const [currentGroup, setCurrentGroup] = useState<Client.Group>();
  const [isCreateGroupOpen, setCreateGroupIsOpen] = useState<boolean>(false);
  const [isModifyGroupOpen, setModifyGroupIsOpen] = useState<boolean>(false);
  const [isCreateStageOpen, setCreateStageIsOpen] = useState<boolean>(false);
  const [isModifyStageOpen, setModifyStageIsOpen] = useState<boolean>(false);
  const [isCopyLinkOpen, setCopyLinkOpen] = useState<boolean>();

  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.ChangeEvent<{}>, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <Collapse/>
      <Flex
        sx={{
          justifyContent: "flex-end",
        }}
      >
        <IconButton
          variant="primary"
          onClick={() => setCreateStageIsOpen((prevState) => !prevState)}
        >
          <AddIcon /> Bühne hinzufügen
        </IconButton>
      </Flex>
      <div>
        {stages.map((stage) => (
          <Accordion
            expanded={expanded === `panel-${stage._id}`}
            onChange={handleChange(`panel-${stage._id}`)}
            key={stage._id}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon color="primary" />}
              aria-controls={`panel-${stage._id}-content`}
              id={`panel-${stage._id}-header`}
            >
              <Flex
                sx={{
                  justifyContent: 'space-between',
                  minWidth: "100%"
                }}
              >
                <Heading variant="h4">{stage.name}</Heading>
                <div>
                  {stage.isAdmin && (
                    <>
                      <IconButton
                        aria-label="Gruppe hinzufügen"
                        color="secondary"
                        edge="start"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCreateGroupIsOpen(true);
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        color="primary"
                        aria-label="edit"
                        onClick={() => {
                          setCurrentStage(stage);
                          setModifyStageIsOpen(true);
                        }}
                      >
                        <Icon name="edit" />
                      </IconButton>
                    </>
                  )}
                  <IconButton
                    aria-label={stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'}
                    color="primary"
                    onClick={() => {
                      if (stage.isAdmin) removeStage(stage._id);
                      else leaveStageForGood(stage._id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </div>
              </Flex>

            </AccordionSummary>
            <ul>
              {groups.byStage[stage._id] && groups.byStage[stage._id].map((groupId) => {
                const group = groups.byId[groupId];
                return (
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between"
                    }}
                    key={group._id}>
                    <Flex>
                      <Avatar src='/images/diverse 5.svg' />
                      <Flex
                        sx={{
                          flexDirection: "column"
                        }}
                      >
                        <Heading variant="h6">{group.name}</Heading>
                        {stage.isAdmin && (
                          <Flex>
                            <IconButton
                              size="small"
                              edge="start"
                              aria-label="Gruppe wechseln"
                              onClick={() => {
                                setCurrentGroup(group);
                                setModifyGroupIsOpen(true);
                              }}
                            >
                              <Icon name="edit" />
                            </IconButton>
                            <IconButton
                              size="small"
                              edge="end"
                              aria-label="Gruppe entfernen"
                              onClick={() => removeGroup(group._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Flex>
                        )}
                      </Flex>
                    </Flex>
                    <Box>
                      <Button
                        variant={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'primary' : 'secondary'}
                        // color={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'primary' : 'inherit'}
                        onClick={() => {
                          if (
                            currentStageId
                            && stage._id === currentStageId
                            && group._id === currentGroupId
                          ) {
                            leaveStage();
                          } else {
                            setRequest(stage._id, group._id, stage.password);
                          }
                        }}
                      >
                        {currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'Verlassen' : 'Beitreten'}
                      </Button>
                      <Button
                        variant="primary"
                        // color="inherit"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setCopyLinkOpen((prevState) => !prevState);
                        }}
                      >
                        Einladen
                          </Button>
                    </Box>
                  </li>
                );
              })}
            </ul>
          </Accordion>
        ))}
      </div>
      <CreateStageModal
        isOpen={isCreateStageOpen}
        onClose={() => setCreateStageIsOpen(false)}
      />
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
      <ModifyStageModal
        stage={currentStage}
        isOpen={isModifyStageOpen}
        onClose={() => setModifyStageIsOpen(false)}
      />
      <InviteModal
        stage={currentStage}
        group={currentGroup}
        onClose={() => setCopyLinkOpen(false)}
        isOpen={isCopyLinkOpen}
      />
    </>
  );
};
export default StageListView;
