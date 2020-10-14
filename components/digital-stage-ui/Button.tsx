import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import Icon from './Icon';

export interface Props {
    color?: "light" | "dark" | 'primary' | 'secondary',
    text: string,
    withIcon: boolean,
    iconName?: string,
    iconColor?: string,
}
const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
    createStyles({
        root: {
            color: ({ color }) => color === "dark" && theme.palette.neutral.light || color === "light" && theme.palette.neutral.main,
            backgroundColor: ({ color }) => color === "dark" && theme.palette.neutral.main || color === "light" && theme.palette.neutral.light,
            '&:hover': {
                backgroundColor: ({ color }) => color === "dark" && theme.palette.neutral.main || color === "light" && theme.palette.neutral.light
            },
            margin: theme.spacing(1),
            borderRadius: "21px",
            lineHeight: "initial",
            alignItems: "initial"
        }
    }),
);

export default function Button(props: Props) {
    const {
        color,
        text,
        withIcon,
        iconName,
        iconColor
    } = props
    const classes = useStyles(props);

    return (
        <div>
            <MaterialButton
                variant="contained"
                color={color}
                className={classes.root}
                startIcon={withIcon && <Icon name={iconName} iconColor={iconColor} />}
            >
                <Typography variant="button">{text}</Typography>
            </MaterialButton>
        </div>
    );
}

Button.defaultProps = {
    withIcon: false
};