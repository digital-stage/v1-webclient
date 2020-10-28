import {IconButton as MaterialIconButton, Theme, withStyles} from "@material-ui/core";

const IconButton = withStyles((theme: Theme) => ({
    root: {
        padding: "1rem",
        color: theme.palette.common.white,
        backgroundColor: theme.palette.background.default,
        '&:hover': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
        '&:active': {
            color: theme.palette.common.black,
            backgroundColor: theme.palette.common.white,
        },
    },
}))(MaterialIconButton);

export default IconButton;