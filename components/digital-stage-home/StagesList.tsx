/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import {
  jsx, Box, Button, Grid, Heading, Text,
} from 'theme-ui';
import StageCard from "./StageCard";
import { Collapse, createStyles, makeStyles, Theme } from "@material-ui/core";
import InputField from "../InputField";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CreateStageModal from "../digital-stage-create-stage/CreateStageModal";
import { Stage } from "../../lib/digitalstage/common/model.server";



const StagesList = (props: { onClick(i: number): void, stages: any }) => {
    const { stages } = props
    
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

    React.useEffect(() => {
        if (selected.length > 0) {
            let filteredList = stages.filter(el => el.title.toLowerCase().includes(selected.toLowerCase()))
            setList(filteredList)
        }
        if (selected.length === 0) {
            setList(stages)
        }

    }, [selected]);


    return (
        <Box>
            <CreateStageModal
                open={openCreateStageModal}
                handleClose={() => setOpenCreateStageModal(false)}
            />
            <Heading as="h5" sx={{pl:3}}>Stages</Heading>
            
            <InputField
                onChange={onChangeHandler}
                placeholder="Search stages"
                context="search"
                id="stage name"
                name="stage name"
                type="text"
            />
            <Box sx={{
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
        }}>
                <Grid
                    container={true}
                    alignItems='center'
                >
                    <Heading as="h5" sx={{pl: 3}}>My Stages</Heading>
                    
                    <div onClick={handleMySatgeClick} >
                        {!checkedMyStage ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}
                    </div>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <Box onClick={() => { props.onClick(i); setclickedId(i) }} 

                        sx={{borderLeft: clickedId ? "4px solid white" : "4px solid $dark - gray - 01"}}

                    

                         key={option.title}>
                            <Collapse in={checkedMyStage}>
                                {option.mineStage &&
                                    <StageCard stage={option} />
                                }
                            </Collapse>
                        </Box>
                    )
                })}</div>
                <Grid
                    container={true}
                    alignItems='center'
                >
                    <Heading as="h5" sx={{pl: 3}}>Joined Stages</Heading>
                    <div onClick={handleJoindeStagesClick}>{!checkedJoindedStages ? <ExpandMoreIcon style={{ color: "#fff" }} /> : <ExpandLessIcon style={{ color: "#fff" }} />}</div>
                </Grid>
                <div> {list.map((option, i) => {
                    return (
                        <Box onClick={() => { props.onClick(i); setclickedId(i) }} 
                        sx={{borderLeft: clickedId ? "4px solid white" : "4px solid $dark - gray - 01"}}
                        
                       
                            key={option.title}>
                            <Collapse in={checkedJoindedStages}>
                                {!option.mineStage && <StageCard stage={option} />}
                            </Collapse>
                        </Box>
                    )
                })}</div>
            </Box>
            <Button  type="submit"
                onClick={() => setOpenCreateStageModal(true)}>Create stage</Button>
           
        </Box>);
};

export default StagesList;