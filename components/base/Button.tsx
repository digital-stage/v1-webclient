import React from 'react';
import MaterialButton from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import {PropTypes, Typography} from '@material-ui/core';
import Icon from './Icon';

export interface Props {
    color?: PropTypes.Color | "light" | "dark",
    text: string,
    withIcon?: boolean,
    iconName?: string,
    iconColor?: string,
    type?:"submit",
    onClick?: () => void
}
const useStyles = makeStyles<Theme, Props>((theme: Theme & Props) =>
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
        },
        wrapper: {
            color: theme.color,
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

    const buttonColor: PropTypes.Color = props.color === "dark" || props.color === "light" ? "inherit" : props.color;

    return (
        <div className={classes.wrapper}>
            <MaterialButton
                variant="contained"
                color={buttonColor}
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