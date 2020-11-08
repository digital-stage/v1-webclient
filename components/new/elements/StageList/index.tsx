import { styled } from 'baseui';
import React, { useState } from 'react';
import { Button } from 'baseui/button';
import { Accordion, Panel } from 'baseui/accordion';
import { ListItem, ListItemLabel } from 'baseui/list';
import { Delete, Overflow, Plus } from 'baseui/icon';
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

const GlobalActions = styled('div', {
  width: '100%',
  display: 'flex',
  paddingTop: '1rem',
  paddingBottom: '1rem',
  alignItems: 'center',
  justifyContent: 'flex-end',
});

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

  return (
    <>
      <GlobalActions>
        <Button
          size="large"
          kind="primary"
          startEnhancer={<Plus />}
          onClick={() => setCreateStageIsOpen((prevState) => !prevState)}
        >
          Bühne hinzufügen
        </Button>
      </GlobalActions>
      <div>
        <Accordion>
          {stages.map((stage) => (
            <Panel
              title={stage.name}
              key={stage._id}
            >
              {stage.isAdmin && (
                <>
                  <Button
                    aria-label="Gruppe hinzufügen"
                    shape="circle"
                    kind="secondary"
                    onClick={() => {
                      setCurrentStage(stage);
                      setCreateGroupIsOpen(true);
                    }}
                  >
                    <Plus />
                  </Button>
                  <Button
                    kind="primary"
                    shape="circle"
                    aria-label="edit"
                    onClick={() => {
                      setCurrentStage(stage);
                      setModifyStageIsOpen(true);
                    }}
                  >
                    <Overflow />
                  </Button>
                </>
              )}

              {groups.byStage[stage._id] && groups.byStage[stage._id].map((groupId) => {
                const group = groups.byId[groupId];
                return (
                  <ListItem>
                    <ListItemLabel>
                      {group.name}
                      <Button
                        kind={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? 'primary' : 'minimal'}
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
                        kind="minimal"
                        onClick={() => {
                          setCurrentStage(stage);
                          setCurrentGroup(group);
                          setCopyLinkOpen((prevState) => !prevState);
                        }}
                      >
                        Einladen
                      </Button>
                      {stage.isAdmin && (
                        <>
                          <Button
                            kind="minimal"
                            onClick={() => {
                              setCurrentStage(stage);
                              setCurrentGroup(group);
                              setModifyGroupIsOpen((prevState) => !prevState);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            kind="minimal"
                            onClick={() => {
                              removeGroup(group._id);
                            }}
                          >
                            Entfernen
                          </Button>
                        </>
                      )}
                    </ListItemLabel>
                  </ListItem>
                );
              })}

              <Button
                aria-label={stage.isAdmin ? 'Bühne entfernen' : 'Bühne verlassen'}
                kind="primary"
                shape="circle"
                onClick={() => {
                  if (stage.isAdmin) removeStage(stage._id);
                  else leaveStageForGood(stage._id);
                }}
              >
                <Delete />
              </Button>
            </Panel>
          ))}
        </Accordion>

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
