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
    type?:"submit",
    onClick?: () => void
}
const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
    createStyles({
        root: {
            color: ({ color }) => color === "dark" && theme.palette.common.white || color === "light" && theme.palette.common.black,
            backgroundColor: ({ color }) => color === "dark" && theme.palette.common.black || color === "light" && theme.palette.common.white,
            '&:hover': {
                backgroundColor: ({ color }) => color === "dark" && theme.palette.common.black || color === "light" && theme.palette.common.white
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
        type,
        withIcon,
        iconName,
        iconColor,
        onClick
    } = props
    const classes = useStyles(props);

    return (
        <div>
            <MaterialButton
                variant="contained"
                color={color}
                className={classes.root}
                type={type}
                startIcon={withIcon && <Icon name={iconName} iconColor={iconColor} />}
                onClick={onClick}
            >
                <Typography variant="button">{text}</Typography>
            </MaterialButton>
        </div>
    );
}

Button.defaultProps = {
    withIcon: false
};