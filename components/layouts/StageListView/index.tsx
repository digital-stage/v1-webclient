import {styled} from "baseui";
import React, {useState} from "react";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import CreateGroupModal from "./CreateGroupModal";
import CreateStageModal from "./CreateStageModal";
import ModifyGroupModal from "./ModifyGroupModal";
import ModifyStageModal from "./ModifyStageModal";
import InviteModal from "./InviteModal";
import {useRequest} from "../../../lib/useRequest";
import {Client} from "../../../lib/digitalstage/common/model.client";
import useStageActions from "../../../lib/digitalstage/useStageActions";
import {useSelector} from "../../../lib/digitalstage/useStageContext/redux";
import {Groups, NormalizedState} from "../../../lib/digitalstage/useStageContext/schema";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from "@material-ui/core/List";
import ListItemAvatar from "@material-ui/core/ListItemAvatar/ListItemAvatar";
import ListItem from "@material-ui/core/ListItem";
import Icon2 from "../../base/Icon2";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Button from "@material-ui/core/Button";
import {withStyles} from "@material-ui/core/styles";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import useStageSelector, {useStages} from "../../../lib/digitalstage/useStageSelector";

const GlobalActions = styled("div", {
    width: '100%',
    display: 'flex',
    paddingTop: "1rem",
    paddingBottom: "1rem",
    alignItems: 'center',
    justifyContent: 'flex-end'
})

const AccordionContent = withStyles({
    root: {
        display: "flex",
        flexDirection: "column"
    }
})(AccordionDetails);

const AccordionTitle = styled("div", {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center'
})
const AccordionTitleActions = styled("div", {
    flexGrow: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
})

const StageListView = () => {

    const stages = useStages();
    const groups = useStageSelector<Groups>(state => state.groups);
    const currentStageId = useSelector<NormalizedState, string | undefined>(state => state.stageId);
    const currentGroupId = useSelector<NormalizedState, string | undefined>(state => state.groupId);
    const {removeStage, removeGroup, leaveStage, leaveStageForGood} = useStageActions();
    const {setRequest} = useRequest();
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
            <GlobalActions>
                <Button
                    size="large"
                    color="primary"
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => setCreateStageIsOpen(prevState => !prevState)}>
                    Bühne hinzufügen
                </Button>
            </GlobalActions>
            <div>
                {stages.map(stage => {
                    return (
                        <Accordion
                            expanded={expanded === `panel-${stage._id}`}
                            onChange={handleChange(`panel-${stage._id}`)}
                            key={stage._id}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon color="primary"/>}
                                aria-controls={`panel-${stage._id}-content`}
                                id={`panel-${stage._id}-header`}
                            >
                                <AccordionTitle>
                                    <Typography variant="h4">{stage.name}</Typography>
                                </AccordionTitle>
                                <AccordionTitleActions>
                                    {stage.isAdmin && (
                                        <>
                                            <IconButton aria-label={"Gruppe hinzufügen"}
                                                        color="secondary"
                                                        edge="start"
                                                        onClick={() => {
                                                            setCurrentStage(stage);
                                                            setCreateGroupIsOpen(true)
                                                        }}>
                                                <AddIcon/>
                                            </IconButton>
                                            <IconButton color="primary" aria-label="edit"
                                                        onClick={() => {
                                                            setCurrentStage(stage);
                                                            setModifyStageIsOpen(true);
                                                        }}>
                                                <EditIcon/>
                                            </IconButton>
                                        </>
                                    )}
                                    <IconButton aria-label={stage.isAdmin ? "Bühne entfernen" : "Bühne verlassen"}
                                                color="primary" edge="end"
                                                onClick={() => {
                                                    if (stage.isAdmin)
                                                        removeStage(stage._id)
                                                    else
                                                        leaveStageForGood(stage._id)
                                                }}>
                                        <DeleteIcon/>
                                    </IconButton>
                                </AccordionTitleActions>
                            </AccordionSummary>
                            <AccordionContent>
                                <List>
                                    {groups.byStage[stage._id] && groups.byStage[stage._id].map(groupId => {
                                        const group = groups.byId[groupId];
                                        return (
                                            <ListItem key={group._id} dense>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <Icon2 name="group-preset"/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText primary={group.name} secondary={stage.isAdmin && (
                                                    <ButtonGroup size="small" color="secondary" variant="text">
                                                        <IconButton
                                                            size="small"
                                                            edge="start"
                                                            aria-label={"Gruppe wechseln"}
                                                            onClick={() => {
                                                                setCurrentGroup(group);
                                                                setModifyGroupIsOpen(true);
                                                            }}
                                                        >
                                                            <EditIcon/>
                                                        </IconButton>
                                                        <IconButton
                                                            size="small"
                                                            edge="end"
                                                            aria-label={"Gruppe entfernen"}
                                                            onClick={() => removeGroup(group._id)}
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </ButtonGroup>
                                                )}/>

                                                <ListItemSecondaryAction>
                                                    <ButtonGroup>
                                                        <Button
                                                            variant={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? "contained" : "outlined"}
                                                            color={currentStageId && stage._id === currentStageId && group._id === currentGroupId ? "primary" : "inherit"}
                                                            onClick={() => {
                                                                if (currentStageId && stage._id === currentStageId && group._id === currentGroupId) {
                                                                    leaveStage();
                                                                } else {
                                                                    setRequest(stage._id, group._id, stage.password);
                                                                }
                                                            }}
                                                        >
                                                            {currentStageId && stage._id === currentStageId && group._id === currentGroupId ? "Verlassen" : "Beitreten"}
                                                        </Button>
                                                        <Button
                                                            variant="outlined"
                                                            color="inherit"
                                                            onClick={() => {
                                                                setCurrentStage(stage);
                                                                setCurrentGroup(group);
                                                                setCopyLinkOpen(prevState => !prevState);
                                                            }}
                                                        >
                                                            Einladen
                                                        </Button>
                                                    </ButtonGroup>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        )
                                    })}
                                </List>

                            </AccordionContent>
                        </Accordion>
                    )
                })}
            </div>
            <CreateStageModal isOpen={isCreateStageOpen}
                              onClose={() => setCreateStageIsOpen(false)}/>
            <CreateGroupModal stage={currentStage} isOpen={isCreateGroupOpen}
                              onClose={() => setCreateGroupIsOpen(false)}/>
            <ModifyGroupModal group={currentGroup} isOpen={isModifyGroupOpen}
                              onClose={() => setModifyGroupIsOpen(false)}/>
            <ModifyStageModal stage={currentStage} isOpen={isModifyStageOpen}
                              onClose={() => setModifyStageIsOpen(false)}/>
            <InviteModal stage={currentStage} group={currentGroup} onClose={() => setCopyLinkOpen(false)}
                         isOpen={isCopyLinkOpen}/>
        </>
    )
}
export default StageListView;