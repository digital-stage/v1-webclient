import {createMuiTheme} from "@material-ui/core/styles";

const BaseTheme = createMuiTheme({
    palette: {
        "common": {"black": "#000", "white": "#fff"},
        "background": {"paper": "rgba(16, 16, 16, 1)", "default": "rgba(37, 37, 37, 1)"},
        "primary": {
            "light": "rgba(255, 89, 110, 1)",
            "main": "rgba(242, 4, 67, 1)",
            "dark": "rgba(183, 0, 29, 1)",
            "contrastText": "#fff"
        },
        "secondary": {
            "light": "rgba(105, 125, 255, 1)",
            "main": "rgba(37, 81, 205, 1)",
            "dark": "rgba(0, 42, 155, 1)",
            "contrastText": "#fff"
        },
        "error": {"light": "#e57373", "main": "#f44336", "dark": "#d32f2f", "contrastText": "#fff"},
        "text": {
            "primary": "rgba(209, 209, 209, 1)",
            "secondary": "rgba(255, 255, 255, 1)",
            "disabled": "rgba(173, 173, 173, 1)",
            "hint": "rgba(209, 209, 209, 1)"
        }
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
    }
});

/*
const OldBaseTheme = createMuiTheme({
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
});*/

export const DSDarkTheme = {
    ...BaseTheme,
    overrides: {
        MuiButton: {
            textPrimary: {
                color: "red",
            }
        },
        MuiToggleButton: {
            root: {
                color: BaseTheme.palette.getContrastText(BaseTheme.palette.text.primary),
                backgroundColor: BaseTheme.palette.text.primary
            },
            colorPrimary: {
                color: BaseTheme.palette.text.primary,
                backgroundColor: BaseTheme.palette.primary.main
            },
        },
        /*
        MuiIconButton: {
            root: {
                color: BaseTheme.palette.background.default,
                backgroundColor: BaseTheme.palette.text.primary,
                "&:hover": {
                    color: BaseTheme.palette.background.default,
                    backgroundColor: BaseTheme.palette.text.secondary,
                }
            },
            colorPrimary: {
                color: BaseTheme.palette.text.primary,
                backgroundColor: BaseTheme.palette.primary.main,
                "&:hover": {
                    color: BaseTheme.palette.text.secondary,
                    backgroundColor: BaseTheme.palette.primary.dark,
                }
            },
            colorSecondary: {
                color: BaseTheme.palette.text.primary,
                backgroundColor: BaseTheme.palette.secondary.main,
                "&:hover": {
                    color: BaseTheme.palette.text.secondary,
                    backgroundColor: BaseTheme.palette.secondary.dark,
                }
            },
        },*/
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
        }
    },
};

export const DSLightTheme = DSDarkTheme;
