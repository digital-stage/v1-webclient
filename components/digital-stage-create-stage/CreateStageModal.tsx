import React from 'react';
import { Dialog, DialogContent, useMediaQuery, makeStyles, useTheme, Theme, createStyles } from '@material-ui/core';
import CreateStageStepper from './CreateStageStepper';
import Icon from '../digital-stage-ui/Icon';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    },
    paper: {
        textTransform: 'initial',
        backgroundColor: "#2A2A2A"
    },
    icon: {
        textAlign: "right",
        cursor: "pointer",
        padding: theme.spacing(1)
    }
}));


export default function CreateStageModal(props: {
    open: boolean,
    handleClose(open: boolean): void
}) {
    const theme = useTheme();
    const classes = useStyles();
    const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

    const handleClose = () => {
        props.handleClose(false)
    }

    return (
        <div>
            <Dialog
                fullScreen={fullScreen}
                open={props.open}
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
                    <CreateStageStepper />
                </DialogContent>
            </Dialog>
        </div>
    );
}