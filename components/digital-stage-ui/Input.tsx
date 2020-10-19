import React from "react";
import { MuiThemeProvider, createMuiTheme, makeStyles, TextField, InputAdornment } from "@material-ui/core";
import Icon from "./Icon";

const theme = createMuiTheme({});

theme.overrides = {
  MuiOutlinedInput: {
    root: {
      "&$focused $notchedOutline": {
        borderColor: "#707070",
        borderWidth: 1,
      },
    },
  },
};


type Props = {
  onChange?:  (e: any) => void,
  placeholder: string,
  required?: boolean,
  type: string,
  id: string,
  name: string,
  InputProps?: object,
  value?: string,
  error?: string
  context?: string,
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
}

const Input = (props: Props) => {
  const useStyles = makeStyles(() => ({
    root: {
      width: "100%",
      padding: props.context === "search" && theme.spacing(3, 0, 3, 2),
    },
    input: {
      background: `${props.error ? "rgb(240, 212, 209)" : "white"}`,
      borderRadius: "24px",
      color: "black",
      height: "36px",
      width: `${props.context === "search" ? "100%" : props.context === "group" ? "auto" : "199px"}`,
      fontFamily: "Poppins",
      fontSize: "14px",
      // boxShadow: "0px 5px 30px #0B2140",
      marginTop: `${props.context === "search" ? "0px" : "20px"}`,
      fontWeight: 600,
      borderBottom: `${props.error && "1px solid #F20544"}`
    },
    p: {
      color: "white",
      marginLeft: "0 !important",
      fontFamily: "Poppins",
      fontSize: "12px",
      fontWeight: 600,
      paddingLeft: "20px",
      marginTop: "5px",
      marginBottom: "0 !important"
    }
  }));

  const classes = useStyles();
  const { context } = props

  return (
    <MuiThemeProvider theme={theme}>
      <TextField
        className={classes.root}
        variant="outlined"
        InputProps={{
          className: classes.input,
          ...props.InputProps,
          endAdornment: context === "search" && <InputAdornment position="end">
            <Icon
              name="search"
              iconColor="#3B3B3B"
              width={24}
              height={24}
            />
          </InputAdornment>
        }}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
        placeholder={props.placeholder}
        required={props.required}
        type={props.type}
        id={props.id}
        name={props.name}
        value={props.value}
      />
      {props.error && <p className={classes.p}>{props.error}</p>}
    </MuiThemeProvider>
  );
};



export default Input;
