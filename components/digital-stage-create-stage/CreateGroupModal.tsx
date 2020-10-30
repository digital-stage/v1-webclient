import React from 'react';
import { Dialog, DialogContent, useMediaQuery, makeStyles, useTheme, Theme, createStyles, Typography, Grid, Box } from '@material-ui/core';
import Icon from '../base/Icon';
import { useStage } from '../stage/useStage';
import TextField from '../base/TextField';
import Button from '../base/Button';
import useStageActions from '../../lib/digitalstage/useStageActions';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    paper: {
        textTransform: 'initial',
        backgroundColor: "#2A2A2A",
        maxHeight: "unset !important",
    },
    icon: {
        textAlign: "right",
        cursor: "pointer",
        padding: theme.spacing(1)
    }
}));


export default function CreateStageModal(props: {
    openCreateGroup: boolean,
    handleCloseCreateGroup(open: boolean): void
}) {
    const theme = useTheme();
    const classes = useStyles();
    const { createGroup } = useStageActions();
    const { stage } = useStage();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [name, setName] = React.useState<string>("")
    const [nameLength, setNameLength] = React.useState<number>(0)
    const [error, setError] = React.useState<boolean>(false)

    const handleClose = () => {
        props.handleCloseCreateGroup(false);
        setName("");
        setNameLength(0);
        setError(false)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setNameLength(e.target.value.length)
    }


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.length <= 0) {
            setError(true)
        }
        else {
            createGroup(stage._id, name);
            handleClose();
        }
    };

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={props.openCreateGroup}
                aria-labelledby="responsive-dialog-title"
                classes={{
                    root: classes.root,
                    paper: classes.paper
                }}
            >
                <div className={classes.icon} onClick={handleClose}>
                    <Icon name="close" iconColor="#fff" />
                </div>
                <DialogContent>
                    <Typography variant="h5">Create a new group</Typography>
                    <form noValidate={true} onSubmit={handleSubmit}>
                        <Box my={2}>
                        <TextField
                            label="Group name"
                            maxLength={16}
                            name="name"
                            onChange={handleChange}
                            value={name}
                            valueLength={nameLength}
                            error={error}
                            errorMessage="Group name is required"
                        />
                        </Box>
                        <Grid
                            container
                            justify="center"
                        >
                            <Button
                                color="light"
                                text="Cancel"
                                onClick={handleClose}
                            />
                            <Button
                                color="primary"
                                text="Create"
                                type="submit"
                            />
                        </Grid>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}