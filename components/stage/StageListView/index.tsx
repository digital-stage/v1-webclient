import {styled} from "baseui";
import React, {useState} from "react";
import {Button} from "baseui/button/index";
import {Accordion, Panel} from "baseui/accordion/index";
import {useStages} from "../../../lib/digitalstage/useStages";
import Server from "../../../lib/digitalstage/common/model.client";
import {ButtonGroup} from "baseui/button-group/index";
import {Delete, Overflow, Plus} from "baseui/icon/index";
import CreateGroupModal from "./CreateGroupModal";
import CreateStageModal from "./CreateStageModal";
import ModifyGroupModal from "./ModifyGroupModal";
import ModifyStageModal from "./ModifyStageModal";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import {useDevices} from "../../../lib/digitalstage/useDevices";

const Label = styled("div", {})
const GlobalActions = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
})
const StageActions = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
});
const GroupRow = styled("div", {});
const GroupActions = styled("div", {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
});

const StageListView = () => {
    const {stages, removeStage, removeGroup, joinStage} = useStages();
    const [currentStage, setCurrentStage] = useState<Server.Stage>();
    const [currentGroup, setCurrentGroup] = useState<Server.Group>();
    const [isCreateGroupOpen, setCreateGroupIsOpen] = React.useState(false);
    const [isModifyGroupOpen, setModifyGroupIsOpen] = React.useState(false);
    const [isCreateStageOpen, setCreateStageIsOpen] = React.useState(false);
    const [isModifyStageOpen, setModifyStageIsOpen] = React.useState(false);

    return (
        <>
            <Accordion>
                {stages.map(stage => (
                    <Panel title={stage.name}>
                        {stage.groups.map(group => (
                            <GroupRow>
                                <Label>{group.name}</Label>
                                <GroupActions>
                                    <ButtonGroup kind="primary" size="compact">
                                        <Button startEnhancer={<Overflow/>} onClick={() => {
                                            joinStage(stage._id, group._id, stage.password);
                                        }}>
                                            Beitreten
                                        </Button>
                                        {stage.isAdmin && (
                                            <>
                                                <Button startEnhancer={<Overflow/>} onClick={() => {
                                                    setCurrentGroup(group);
                                                    setModifyGroupIsOpen(true);
                                                }}>
                                                    Ändern
                                                </Button>
                                                <Button startEnhancer={<Delete/>}
                                                        onClick={() => removeGroup(group._id)}>
                                                    Entfernen
                                                </Button>
                                            </>
                                        )}
                                    </ButtonGroup>
                                </GroupActions>
                            </GroupRow>
                        ))}
                        {stage.isAdmin && (
                            <StageActions>
                                <ButtonGroup kind="primary" size="compact">
                                    <Button
                                        startEnhancer={<Plus/>}
                                        onClick={() => {
                                            setCurrentStage(stage);
                                            setCreateGroupIsOpen(true)
                                        }}>
                                        Neue Gruppe hinzufügen
                                    </Button>
                                    <Button startEnhancer={<Overflow/>} onClick={() => {
                                        setCurrentStage(stage);
                                        setModifyStageIsOpen(true)
                                    }}>
                                        Bühne ändern
                                    </Button>
                                    <Button startEnhancer={<Delete/>} onClick={() => removeStage(stage._id)}>
                                        Bühne entfernen
                                    </Button>
                                </ButtonGroup>
                            </StageActions>
                        )}
                    </Panel>
                ))}
            </Accordion>
            <GlobalActions>
                <ButtonGroup kind="primary" size="compact">
                    <Button startEnhancer={<Plus/>} onClick={() => setCreateStageIsOpen(prevState => !prevState)}>
                        Neue Bühne hinzufügen
                    </Button>
                </ButtonGroup>
            </GlobalActions>
            <CreateStageModal isOpen={isCreateStageOpen}
                              onClose={() => setCreateStageIsOpen(false)}/>
            <CreateGroupModal stage={currentStage} isOpen={isCreateGroupOpen}
                              onClose={() => setCreateGroupIsOpen(false)}/>
            <ModifyGroupModal group={currentGroup} isOpen={isModifyGroupOpen}
                              onClose={() => setModifyGroupIsOpen(false)}/>
            <ModifyStageModal stage={currentStage} isOpen={isModifyStageOpen}
                              onClose={() => setModifyStageIsOpen(false)}/>
        </>
    )
}
export default StageListView;