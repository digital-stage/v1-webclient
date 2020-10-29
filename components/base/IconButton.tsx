import {default as MaterialIconButton} from "@material-ui/core/IconButton/IconButton";
import * as React from "react";
import {MouseEventHandler} from "react";
import withStyles from "@material-ui/core/styles/withStyles";

const StyledMaterialIconButton = withStyles(({palette}) => ({
    root: {
        color: palette.text.primary,
        "&:hover": {
            color: palette.text.secondary
        }
    },
    colorPrimary: {
        color: palette.text.primary,
        backgroundColor: palette.primary.main,
        "&:hover": {
            color: palette.text.secondary,
            backgroundColor: palette.primary.dark,
        }
    },
    colorSecondary: {
        color: palette.text.primary,
        backgroundColor: palette.secondary.main,
        "&:hover": {
            color: palette.text.secondary,
            backgroundColor: palette.secondary.dark,
        }
    }
}))(MaterialIconButton);

const IconButton = (props: {
    color?: "primary" | "secondary" | "inherit"
    children: React.ReactNode,
    onClick?: MouseEventHandler<HTMLButtonElement>;
    size?: "small" | "medium";
}) => {
    return <StyledMaterialIconButton
        {...props}
    />
}
export default IconButton;