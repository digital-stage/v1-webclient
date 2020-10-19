import { createStyles, Grid, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: "100%",
            display: "flex",
            margin: theme.spacing(1, 0),
            paddingRight: theme.spacing(2),
            justifyContent: "space-between"
        },
        stageImage: {
            width: "48px",
            height: "48px"
        },
        online: {
            width: "8px",
            height: "8px",
            backgroundColor: "#00FF08",
            borderRadius: "25px",
            marginTop: theme.spacing(0)
        },
        users: {
            textAlign: "right"
        }
    }),
);

const StageCard = (props: {
    stage: {
        title: string,
        image: string,
        online: boolean,
        users: { userPhoto: string }[],
        description: string
    }
}) => {
    const {
        title,
        image,
        online,
        users,
        description
    } = props.stage;
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <img src={image} alt="stage" className={classes.stageImage} />
            <div>
                <Grid container justify="space-between">
                    <Typography variant="h5">{title}</Typography>
                    {online && <div className={classes.online}></div>}
                </Grid>
                <Typography variant="subtitle1">{description}</Typography>
                <div className={classes.users}>
                    <Typography variant="subtitle1">{users.length} users</Typography>
                </div>
            </div>
        </div>
    );
};

export default StageCard;
