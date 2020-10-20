
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ChipMaterial from '@material-ui/core/Chip';
import Avatar from './Avatar';
import { Typography } from '@material-ui/core';

export interface Props {
    chipcolor?: "light" | "dark",
    withavatar?: boolean,
    onClick?: () => void,
    label: string,
    style?:{}
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
    createStyles({
        root: {
            justifyContent: 'center',
            flexWrap: 'wrap',
            display:"inline-block",
            '& > *': {
                margin: theme.spacing(0.5),
            }
        },
        checkbox: {
            height: "24px",
            borderRadius: "16px",
            backgroundColor: ({ chipcolor }) => chipcolor === "light" ? theme.palette.common.white : theme.palette.common.black,
            fontSize: "12px",
            fontFamily: "Open sans",
            color: ({ chipcolor }) => chipcolor === "light" ? theme.palette.common.black : theme.palette.common.white,
            padding: "4px",
            "&:hover, &:focus": {
                backgroundColor: ({ chipcolor }) => chipcolor === "light" ? theme.palette.common.white : theme.palette.common.black
            }
        }
    }),
);

export default function Chip(props: Props) {
    const { withavatar, chipcolor, onClick, label, style } = props
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <ChipMaterial
                label={<Typography variant="subtitle1">
                    {label}
                </Typography>}
                avatar={withavatar ?
                    <Avatar
                        width="16px"
                        height="16px"
                        image={chipcolor === "light" ? "/images/chip-avatar.svg" : "/images/chip-avatar-empty.svg"}
                    />
                : undefined}
                onClick={onClick}
                className={classes.checkbox}
                {...props} />
        </div>
    );
}

Chip.defaultProps = {
    chipcolor: "light",
    withavatar: false
};