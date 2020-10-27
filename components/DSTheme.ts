import { createMuiTheme } from "@material-ui/core/styles";

const BaseTheme = createMuiTheme({
  palette: {
    primary: {
      main: "#F20544",
      light: "#A7A7A7",
    },
    secondary: {
      main: "#2452CE",
      light: "#fff",
    },
    info: {
      main: "#fff",
      light: "#000",
    },
    error: {
      main: "#FA000099",
      light: "#9D131364",
      dark: "#A61010",
    },
    success: {
      main: "#24A312",
    },
    grey: {
      100: "#D1D1D1",
      200: "#B3B3B3",
      300: "#828282",
      400: "#535353",
      500: "#282828",
      600: "#181818",
      700: "#101010",
      800: "#000000",
      900: "#707070",
    },
    text: {
      primary: "#D1D1D1",
      secondary: "#707070",
      hint: "#777777",
    },
    background: {
      default: "#343434",
      paper: "#000000",
    },
  },

  typography: {
    fontFamily: ["Open Sans", "sans-serif"].join(","),
    h1: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "2.5rem",
    },
    h2: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "2rem",
    },
    h3: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "1.5rem",
    },
    h4: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "1.125rem",
    },
    h5: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "0.875rem",
    },
    h6: {
      fontFamily: "'Poppins', 'sans-serif'",
      fontWeight: 600,
      fontSize: "0.8125rem",
    },
    body1: {
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    body2: {
      fontWeight: "normal",
      fontSize: "0.875rem",
    },
    subtitle1: {
      fontWeight: "normal",
      fontSize: "0.75rem",
    },
    subtitle2: {
      fontWeight: "normal",
      fontSize: "0.625rem",
    },
    caption: {
      // fontFamily: "Source Sans Pro", - TODO: clarification required: What is the background for this font family?
      fontWeight: "normal",
      fontSize: "0.875rem",
    },
    overline: {
      fontStyle: "italic",
      fontWeight: "normal",
      fontSize: "0.875rem",
      textTransform: "initial",
    },
    button: {
      fontFamily: "'Poppins', 'sans-serif'",
      textTransform: "none",
      height: "2rem",
      borderRadius: "1.3125rem",
      fontSize: "0.8125rem",
      fontWeight: 600,
      lineHeight: "initial",
    },
  },
  shape: {
    borderRadius: 14,
  },
});

export const DSDarkTheme = {
  ...BaseTheme,
  overrides: {
    MuiListItem: {
      root: {
        color: BaseTheme.palette.grey[300],
        "&$selected": {
          color: BaseTheme.palette.common.white,
          "&:hover": {
            color: BaseTheme.palette.common.white,
          },
        },
        "&:hover": {
          color: BaseTheme.palette.grey[100],
        },
      },
    },
  },
};

export const DSLightTheme = DSDarkTheme;
