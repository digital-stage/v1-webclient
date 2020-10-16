import React, { useEffect } from "react";
import StageCard from "./StageCard";
import { Collapse, createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import Input from "../digital-stage-ui/Input";
import Button from "../digital-stage-ui/Button";
import Icon from "../digital-stage-ui/Icon";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(3),
            width: "100%"
        }
    }),
);

const stages = [
    { title: 'Bulshemier Theatre', mineStage: true, image: "/images/stage-icon.png", online: true, users: [{ userPhoto: "/images/stage-icon.png", username: "username" }] },
    { title: 'National Theatre', mineStage: false, image: "/images/stage-icon.png", online: true, users: [{ userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }] },
    { title: 'Theatre National Royal', mineStage: true, image: "/images/stage-icon.png", online: false, users: [{ userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }] },
    { title: 'The Old Theatre', mineStage: false, image: "/images/stage-icon.png", online: false, users: [{ userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }] },
    { title: 'Lyceum Theatre', mineStage: true, image: "/images/stage-icon.png", online: true, users: [{ userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }, { userPhoto: "/images/stage-icon.png", username: "username" }] },
];

const StagesList = (props: { onClick(i: number): void, handleOpen(open: boolean): void }) => {
    const classes = useStyles()
    const [list, setList] = React.useState(stages);
    const [selected, setSelected] = React.useState("");
    const [checkedMyStage, setCheckedMyStage] = React.useState(true);
    const [checkedJoindedStages, setCheckedJoinedStages] = React.useState(true);
    const [clickedId, setclickedId] = React.useState(0);



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
            <Typography variant="h5">Stages</Typography>
            <Grid
                container={true}
                alignItems="flex-end"
                justify='space-between'
            >
                <Input
                    onChange={onChangeHandler}
                    clear={clearInput}
                    selected={selected}
                    placeholder="Search stages"
                />
                <Icon
                    name="search"
                    iconColor="#fff"
                    width={32}
                    height={32}
                />
            </Grid>
            <div className="stages-list">
                <Grid
                    container={true}
                    alignItems="flex-end"
                    justify='flex-start'
                >
                    <Typography variant="h5">My stages</Typography>
                    <span onClick={handleMySatgeClick} >
                        {!checkedMyStage ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}
                    </span>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <div onClick={() => { props.onClick(i); setclickedId(i) }} className={`clickable ${clickedId === i ? 'left-border' : 'left-border-normal'}`} key={option.title}>
                            <Collapse in={checkedMyStage}>
                                {option.mineStage &&
                                    <StageCard stage={option} />
                                }</Collapse>
                        </div>
                    )
                })}</div>
                <Grid
                    container={true}
                    alignItems="flex-end"
                    justify='flex-start'
                >
                    <Typography variant="h5">Joined stages</Typography>
                    <span onClick={handleJoindeStagesClick}>{!checkedJoindedStages ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}</span>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <div onClick={() => { props.onClick(i); setclickedId(i) }} className={`clickable ${clickedId === i ? 'left-border' : 'left-border-normal'}`} key={option.title}>
                            <Collapse in={checkedJoindedStages}>
                                {!option.mineStage && <StageCard stage={option} />}
                            </Collapse>
                        </div>
                    )
                })}</div>
            </div>
            <div className="float-right mb-2 mr-4">
                <Button
                    color="primary"
                    text="Create stage"
                    type="submit"
                // onClick={()=>props.handleOpen(true)}
                // startIcon={<AddIcon />}
                />
                {/* <ButtonStyled
                className="button-white ml-3"
                text="Enter link"
                type="submit"
                startIcon={<EditOutlinedIcon />}
            /> */}
            </div>
        </div>);
};

export default StagesList;