import React from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { createStyles, makeStyles, Theme, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: "#fff",
      width: "20px",
      height: "20px",
      margin: theme.spacing(3),
    },
  }),
);

export default function RadioButton(props: {
  values: { value: string, label?: string }[]
}) {
  const { values } = props
  const classes = useStyles();
  const [value, setValue] = React.useState('no label');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  return (
    <FormControl component="fieldset">
      <RadioGroup row aria-label="position" name="position" defaultValue="top" value={value} onChange={handleChange}>
        {values.map(el => {
          return <FormControlLabel
            value={el.value}
            control={
              <Radio
                color="secondary"
                className={classes.root}
              />
            }
            label={
              <Typography
                variant="h6"
                color="textPrimary"
              >
                {el.label ? el.label : ""}
              </Typography>
            }
          />
        })}
      </RadioGroup>
    </FormControl>
  );
}
