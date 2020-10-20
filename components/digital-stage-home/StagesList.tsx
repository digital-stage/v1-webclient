import React, { useEffect } from "react";
import StageCard from "./StageCard";
import { Collapse, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import Input from "../base/Input";
import Button from "../base/Button";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import clsx from 'clsx';
import CreateStageModal from "../digital-stage-create-stage/CreateStageModal";
import { Stage } from "../../lib/digitalstage/common/model.server";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3, 3, 3, 0),
            width: "100%"
        },
        clickable: {
            cursor: "pointer"
        },
        leftBorder: {
            borderLeft: "4px solid white"
        },
        leftBorderNormal: {
            borderLeft: "4px solid $dark - gray - 01"
        },
        paddingLeft: {
            paddingLeft: theme.spacing(3),
        },
        stagesList: {
            maxHeight: "calc(100vh - 190px)",
            minHeight: "calc(100vh - 840px)",
            overflowY: "scroll",
            "&::-webkit-scrollbar": {
                width: "5px",
                backgroundColor: "transparent"
            },
            "&::-webkit-scrollbar-track": {
                borderRadius: "25px"
            },
            "&::-webkit-scrollbar-thumb": {
                background: "white",
                borderRadius: "25px"
            },
            "&::-webkit-scrollbar-thumb:hover": {
                background: "white"
            }
        }
    }),
);

const StagesList = (props: { onClick(i: number): void, stages: any }) => {
    const { stages } = props
    const classes = useStyles()
    const [list, setList] = React.useState(stages);
    const [selected, setSelected] = React.useState("");
    const [checkedMyStage, setCheckedMyStage] = React.useState(true);
    const [checkedJoindedStages, setCheckedJoinedStages] = React.useState(true);
    const [clickedId, setclickedId] = React.useState(0);
    const [openCreateStageModal, setOpenCreateStageModal] = React.useState(false);

    const handleMySatgeClick = () => {
        setCheckedMyStage((prev) => !prev);
    };

    const handleJoindeStagesClick = () => {
        setCheckedJoinedStages((prev) => !prev);
    };

    function onChangeHandler(e: any) {
        setSelected(e.target.value);
    }

    function clearInput() {
        setSelected("")
    }

    useEffect(() => {
        if (selected.length > 0) {
            let filteredList = stages.filter(el => el.title.toLowerCase().includes(selected.toLowerCase()))
            setList(filteredList)
        }
        if (selected.length === 0) {
            setList(stages)
        }

    }, [selected]);


    return (
        <div className={classes.root}>
            <CreateStageModal
                open={openCreateStageModal}
                handleClose={() => setOpenCreateStageModal(false)}
            />
            <Typography variant="h5" className={classes.paddingLeft}>Stages</Typography>
            <Input
                onChange={onChangeHandler}
                placeholder="Search stages"
                context="search"
                id="stage name"
                name="stage name"
                type="text"
            />
            <div className={classes.stagesList}>
                <Grid
                    container={true}
                    alignItems='center'
                >
                    <Typography variant="h5" className={classes.paddingLeft}>My stages</Typography>
                    <div onClick={handleMySatgeClick} >
                        {!checkedMyStage ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}
                    </div>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <div onClick={() => { props.onClick(i); setclickedId(i) }} className={clsx(classes.clickable, {
                            [classes.leftBorder]: clickedId === i,
                            [classes.leftBorderNormal]: !(clickedId === i),
                        })} key={option.title}>
                            <Collapse in={checkedMyStage}>
                                {option.mineStage &&
                                    <StageCard stage={option} />
                                }
                            </Collapse>
                        </div>
                    )
                })}</div>
                <Grid
                    container={true}
                    alignItems='center'
                >
                    <Typography variant="h5" className={classes.paddingLeft}>Joined stages</Typography>
                    <div onClick={handleJoindeStagesClick}>{!checkedJoindedStages ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}</div>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <div onClick={() => { props.onClick(i); setclickedId(i) }} className={clsx(classes.clickable, {
                            [classes.leftBorder]: clickedId === i,
                            [classes.leftBorderNormal]: !(clickedId === i),
                        })}
                            key={option.title}>
                            <Collapse in={checkedJoindedStages}>
                                {!option.mineStage && <StageCard stage={option} />}
                            </Collapse>
                        </div>
                    )
                })}</div>
            </div>
            <Button
                color="primary"
                text="Create stage"
                type="submit"
                onClick={() => setOpenCreateStageModal(true)}
            />
        </div>);
};

export default StagesList;