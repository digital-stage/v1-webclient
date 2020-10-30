import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { Stage } from "../../lib/digitalstage/common/model.server";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            margin: theme.spacing(1, 0),
            paddingRight: theme.spacing(2),
            justifyContent: "flex-start"
        },
        stageImage: {
            width: "38px",
            height: "38px",
            borderRadius:"50%",
            margin: theme.spacing(0,1,0,3)
        },
        stageName:{
            margin:"auto 0"
        }
    }),
);

const StageCard = (props: {
    stage: Stage
}) => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img src="/images/diverse 5.svg" alt="stage" className={classes.stageImage} />
            <Typography variant="h5" className={classes.stageName}>{props.stage.name}</Typography>
        </div>
    );
};

export default StageCard;
