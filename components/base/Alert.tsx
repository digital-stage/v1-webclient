import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MaterialAlert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        width: '70%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
        margin: theme.spacing(2,0, 0),
    },
}));

export default function Alert(props: {
    severity: "error" | "warning" | "info" | "success",
    text: string,
}) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <MaterialAlert severity={props.severity}>{props.text}</MaterialAlert>
        </div>
    );
}