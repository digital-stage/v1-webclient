import React from 'react';
import MaterialCheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: "#fff",
            width: "18px",
            height: "18px",
            margin: theme.spacing(2)
        }
    }),
);

export default function Checkbox(props: {
    value: string,
    label?: string,
    checked:boolean,
    handleChange(event: React.ChangeEvent<HTMLInputElement>):void
}) {
    const { value, label, checked, handleChange } = props;
    const classes = useStyles();

    return (
        <FormControlLabel
            value={value}
            name={value}
            id={value}
            control={
                <MaterialCheckbox
                    color="secondary"
                    className={classes.root}
                    checked={checked}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleChange(event)}
                />
            }
            label={
                <Typography
                    variant="h6"
                    color="textPrimary"
                >
                    {label}
                </Typography>
            }
            labelPlacement="end"
        />

    );
}
