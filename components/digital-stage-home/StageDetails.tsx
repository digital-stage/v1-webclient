import React from "react";
import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import Icon from "../base/Icon";
import Button from "../base/Button";
import Chip from "../base/Chip";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            textAlign: "left",
            '& .MuiBadge-anchorOriginTopRightCircle': {
                backgroundColor: "#272727 !important",
                color: "white !important",
                boxShadow: "0px 1px 10px #464747"
            }
        },
        block:{
            display:"block !important"
        }
    })
);

const StageDetails = (props: {
    stage: {
        title: string,
        image: string,
        online: boolean,
        users: {
            userPhoto: string
        }[]
    }
}) => {
    const classes = useStyles();
    return (
        <Grid
            container
            className={classes.root}
        >
            <Grid item>
                <img width="160" height="160" src={props.stage.image} alt={props.stage.image} />
                <Typography variant="subtitle1" color="textPrimary">Stage</Typography>
                <Typography variant="h2" color="textPrimary">{props.stage.title}</Typography>
                <Typography variant="subtitle1" color="textPrimary">Created by info@digital-stage.org</Typography>
                <Chip label="Favourite" />
                <Typography variant="h6" color="textPrimary">Groups</Typography>
                <Grid
                    container
                    justify="space-between"
                >
                    <Icon name="choir-bass" width={32} height={32} circled iconColor="#fff" className={classes.block}/>
                    <Typography variant="subtitle2" color="textPrimary" className={classes.block}>Bass</Typography>

                    <Icon name="choir-alto" width={32} height={32} circled iconColor="#fff" />
                    <Icon name="choir-sopran" width={32} height={32} circled iconColor="#fff" />
                    <Icon name="choir-tenor" width={32} height={32} circled iconColor="#fff" />
                    <Icon name="orchestra-conductor" width={32} height={32} circled iconColor="#fff" />
                </Grid>
                <Grid
                    container
                    justify="space-between"
                >
                    <Button
                        color="primary"
                        text="Start"
                        type="submit"
                    />
                    <Button
                        color="light"
                        text="Copy invitation"
                        type="submit"
                    />
                    <Button
                        color="light"
                        text="Edit"
                        type="submit"
                    />
                </Grid>
            </Grid>
            <Grid item>
                <Typography variant="h3" color="textPrimary">Users</Typography>
                <Typography variant="subtitle2" color="textPrimary">{props.stage.users.length} users</Typography>
                {props.stage.users.map((el, i) => {
                    return (
                        <img key={i} src={el.userPhoto} alt={el.userPhoto} width="40px" height="40px" />
                    )
                })}
            </Grid>
        </Grid>
    );
};

export default StageDetails;
