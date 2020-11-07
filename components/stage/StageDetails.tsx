/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useEffect, useState } from "react";
import { createStyles, Grid, IconButton, makeStyles, Theme, Typography, withStyles } from "@material-ui/core";
import {jsx, Box, Button, IconButton as IB} from "theme-ui";
import { useStage } from "./useStage";
import { useSelector } from "react-redux";
import { Groups, NormalizedState } from "../../lib/digitalstage/useStageContext/schema";
import { useRequest } from "../../lib/useRequest";
import CreateStageModal from "../digital-stage-create-stage/CreateStageModal";
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import InputOutlinedIcon from '@material-ui/icons/InputOutlined';
import useStageActions from "../../lib/digitalstage/useStageActions";
import CreateGroupModal from "../digital-stage-create-stage/CreateGroupModal";
import EditGroupModal from "../digital-stage-create-stage/EditGroupModal";
import { Client } from "../../lib/digitalstage/common/model.client";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign: "left",
            width: "100vw",
            margin: theme.spacing(6, 0, 0, 15)
        },
        block: {
            display: "block !important"
        },
        groupColorSpan: {
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            display: "block",
            margin: "0 auto"
        },
        group: {
            textAlign: "center",
            margin: theme.spacing(1, 3, 1, 0),
        },
        groupContainer: {
            maxWidth: "70vw",
            overflowX: "auto"
        },
        img: {
            borderRadius: "50%",
            margin: theme.spacing(0, 3)
        },
    })
);

const DeviceIcon = withStyles((theme: Theme) => ({
    root: {
        padding: "0.5rem",
        color: theme.palette.common.white,
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
        '&:active': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
    },
}))(IconButton);

const colors: string[] = [
    "#F20544",
    "#FF7D26",
    "#31BF1D",
    "#2667FC",
    "#FF36CA",
    "#D9486F",
    "#F279BC",
    "#F2BBBB",
    "#52C5F2",
    "#5780F2",
    "#4EBFAB",
    "#A7E566",
    "#FBD366",
    "#EEF26C",
    "#E59D66",
    "#F65353",
    "#0B2D71",
    "#BFBFBF",
    "#F61D1D",
    "#4D4D4D",
]

const StageDetails = () => {
    const classes = useStyles();
    const { stage, handleSetContext } = useStage();
    const groups = useSelector<NormalizedState, Groups>(state => state.groups);
    const [stageGroupsById, setStageGroupsById] = React.useState<string[]>();
    const { setRequest } = useRequest();
    const [link, setLink] = useState<string>();
    const [openCreateStageModal, setOpenCreateStageModal] = React.useState(false);
    const [openCreateGroupModal, setOpenCreateGroupModal] = React.useState(false);
    const [openEditGroupModal, setOpenEditGroupModal] = React.useState(false);
    const { removeStage, removeGroup, leaveStageForGood } = useStageActions();
    const [currentGroup, setCurrentGroup] = useState<Client.Group>();


    const copyLink = (groupId: string) => {
        if (stage && groupId) {
            const port: string = window.location.port ? ":" + window.location.port : "";
            let link: string = window.location.protocol + "//" + window.location.hostname + port + "/join/" + stage._id + "/" + groupId;
            // if (props.usePassword && stage.password && includePassword) {
            //     link += "?password=" + stage.password;
            // }
            setLink(link);
        }
        if (link) {
            navigator.clipboard.writeText(link);
        }
    }

    useEffect(() => {
        const groupsById = stage && groups.byStage[stage._id]
        setStageGroupsById(groupsById);
    }, [groups, stage])

    return (
        <Grid
            container
            className={classes.root}
        >
            <CreateStageModal
                open={openCreateStageModal}
                handleClose={() => setOpenCreateStageModal(false)}
            />
            <CreateGroupModal
                openCreateGroup={openCreateGroupModal}
                handleCloseCreateGroup={() => setOpenCreateGroupModal(false)}
            />
            <EditGroupModal
                openEditGroup={openEditGroupModal}
                handleCloseEditGroup={() => setOpenEditGroupModal(false)}
                group={currentGroup}
            />
            <Grid item>
                <img width="120" height="120" src="/images/diverse 5.svg" alt="stage-image" className={classes.img} />
                <Box my={2}>
                    <Typography variant="subtitle1" color="textPrimary">Stage</Typography>
                    <Typography variant="h2" color="textPrimary">{stage && stage.name}</Typography>
                </Box>
                {stageGroupsById && <Typography variant="h6" color="textPrimary">Groups</Typography>}
                <Grid
                    container
                    justify="flex-start"
                    direction="row"
                    className={classes.groupContainer}
                >
                    {stageGroupsById && stageGroupsById.map((id, i) => {
                        const group = groups.byId[id]
                        return (
                            <Grid item className={classes.group} key={i}>
                                <span style={{ backgroundColor: colors[i] }} className={classes.groupColorSpan}></span>
                                <Typography variant="body2" color="textPrimary" className={classes.block}>{group && group.name}</Typography>
                                <Grid container>
                                    <DeviceIcon
                                        color="inherit"
                                        size="medium"
                                        title="Edit group"
                                        onClick={() => { setOpenEditGroupModal(true); setCurrentGroup(group) }}
                                    >
                                        <EditOutlinedIcon style={{ color: "#F20544", fontSize: "18px" }} />
                                    </DeviceIcon>
                                    <DeviceIcon
                                        color="inherit"
                                        size="medium"
                                        title="Delete group"
                                        onClick={() => removeGroup(group._id)}
                                    >
                                        <DeleteOutlinedIcon style={{ color: "#F20544", fontSize: "18px" }} />
                                    </DeviceIcon>
                                    <DeviceIcon
                                        color="inherit"
                                        size="medium"
                                        title="Copy link"
                                        onClick={() => copyLink(group._id)}
                                    >
                                        <FileCopyOutlinedIcon style={{ color: "#F20544", fontSize: "18px" }} />
                                    </DeviceIcon>
                                    <DeviceIcon
                                        color="inherit"
                                        size="medium"
                                        title="Enter group"
                                        onClick={() => setRequest(stage._id, group._id, stage.password)}
                                    >
                                        <InputOutlinedIcon style={{ color: "#F20544", fontSize: "18px" }} />
                                    </DeviceIcon>
                                </Grid>
                            </Grid>
                        )
                    })}
                </Grid>
                <Grid
                    container
                    justify="flex-start"
                >
                    <Button variant="white" type="submit" onClick={() => { setOpenCreateStageModal(true); handleSetContext("edit") }}>Edit stage</Button>
                    {/** // TODO: Check for a real icon button
                    <IconButton variant="white" type="submit" onClick={() => { setOpenCreateStageModal(true); handleSetContext("edit") }}>Edit stage</IconButton>
                    */}
                    <Button type="submit" onClick={() => { setOpenCreateGroupModal(true); }}>Create group</Button>

                    <Button type="submit" onClick={() => {
                            if (stage.isAdmin)
                                removeStage(stage.id)
                            else
                                leaveStageForGood(stage.id)
                        }}>Delete stage</Button>
                    
                   
                </Grid>
            </Grid>
        </Grid>
    );
};

export default StageDetails;
