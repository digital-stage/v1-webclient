import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import MaterialTextField from '@material-ui/core/TextField';
import { InputAdornment } from '@material-ui/core';
import Icon from './Icon';

export interface Props {
  error?: boolean,
  multiline?: boolean,
  maxLength: number,
  label: string,
  textColor: 'light' | "dark",
  name: string,
  onChange(e: React.ChangeEvent<HTMLInputElement>): void,
  value: string | number,
  valueLength: number,
  type?: "text" | "password" | "number",
  errorMessage?: "Something went wrong" | string
}

const useStyles = makeStyles<Theme, Props>((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '328px',
      height: '56px',
      color: theme.palette.common.white,
      borderBottomColor: ({ error }) => error ? '#FA000099' : '#FFFFFF99',
      backgroundColor: ({ error }) => error && "#9D131364",
      '& label.Mui-focused, .MuiFormLabel-root': {
        color: ({ textColor }) => textColor === "dark" ? '#FFFFFF99' : theme.palette.grey[300],
        fontSize: "12px",
        fontWeight: 600,
        fontFamily: "Open Sans"
      },
      '& .MuiFilledInput-underline:before': {
        borderBottomColor: ({ error, textColor }) => error ? '#FA000099' : textColor === "light" ? theme.palette.common.black : '#FFFFFF99',
      },
      '&:hover .MuiFilledInput-underline:before, .MuiFilledInput-underline:after': {
        borderBottomColor: ({ error }) => error ? '#FA000099' : theme.palette.secondary.main
      },
      '& .MuiFilledInput-root, .MuiFilledInput-root.Mui-focused': {
        backgroundColor: 'transparent',
      },
      '& .MuiFormHelperText-root': {
        color: ({ error }) => error ? theme.palette.grey[900] : '#FFFFFF99',
        textAlign: ({ error }) => error ? "left" : "right",
        marginLeft: theme.spacing(0),
        fontSize: "10px",
        fontWeight: "normal",
        fontFamily: "Open Sans"
      }
    },
  },
  input: {
    color: ({ textColor }) => textColor === "dark" ? theme.palette.common.white : theme.palette.common.black,
    fontSize: "15px",
    fontWeight: "normal",
    fontFamily: "Open Sans"
  }
}));

export default function TextField(props: Props) {
  const {
    error,
    multiline,
    maxLength,
    label,
    name,
    onChange,
    value,
    valueLength,
    errorMessage
  } = props
  const classes = useStyles(props);

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <MaterialTextField
        inputProps={{
          maxLength
        }}
        helperText={error ? errorMessage : `${valueLength}/${maxLength}`}
        id="standard-basic"
        label={label}
        color="secondary"
        variant="filled"
        value={value}
        InputProps={{
          className: classes.input,
          endAdornment: <InputAdornment position="end">{error && <Icon name="information" />}</InputAdornment>
        }}
        multiline={multiline}
        onChange={onChange}
        name={name}
        {...props}
      />
    </form>
  );
}

TextField.defaultProps = {
  error: false,
  multiline: false,
  maxLength: 16,
  textColor: "dark"
};