import React from 'react';
import CheckboxMaterial from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            color: "#fff",
            width: "18px",
            height: "18px",
            margin: theme.spacing(3)
        }
    }),
);

export default function Checkbox(props: {
    values: { value: string, label?: string }[]
}) {
    const { values } = props;
    const classes = useStyles();
    const [checked, setChecked] = React.useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChecked(event.target.checked);
    };

    return (
        <FormControl component="fieldset">
            <FormGroup aria-label="position" row>
                {values.map(el => {
                    return <FormControlLabel
                        value={el.value}
                        name={el.value}
                        id={el.value}
                        control={
                            <CheckboxMaterial
                                color="secondary"
                                className={classes.root}
                                checked={checked}
                                onChange={handleChange}
                            />
                        }
                        label={
                            <Typography
                                variant="h6"
                                color="textPrimary"
                            >
                                {el.label}
                            </Typography>
                        }
                        labelPlacement="end"
                    />
                })}
            </FormGroup>
        </FormControl>
    );
}
