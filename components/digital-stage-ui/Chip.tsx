
import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import ChipMaterial from '@material-ui/core/Chip';
import Avatar from './Avatar';
import {Typography} from '@material-ui/core';

export interface Props {
    color?: "light" | "dark",
    withAvatar?: boolean
}

const useStyles = makeStyles<Theme, Props>((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            '& > *': {
                margin: theme.spacing(0.5),
            }
        },
        checkbox: {
            height: "24px",
            borderRadius: "16px",
            backgroundColor: ({ color }) => color === "light" ? theme.palette.common.white : theme.palette.common.black,
            fontSize: "12px",
            fontFamily: "Open sans",
            color: ({ color }) => color === "light" ? theme.palette.common.black : theme.palette.common.white,
            padding: "4px",
            "&:hover, &:focus": {
                backgroundColor: ({ color }) => color === "light" ? theme.palette.common.white : theme.palette.common.black
            }
        }
    }),
);

export default function Chip(props: Props) {
    const { withAvatar, color } = props
    const classes = useStyles(props);

    const handleClick = () => {
        console.info('You clicked the Chip.');
    };

    return (
        <div className={classes.root}>
            <ChipMaterial
                label={<Typography variant="subtitle1">
                All
              </Typography>}
                avatar={withAvatar &&
                    <Avatar
                        width="16px"
                        height="16px"
                        image={color === "light" ? "/images/chip-avatar.svg" : "/images/chip-avatar-empty.svg"}
                    />
                }
                onClick={handleClick}
                className={classes.checkbox} />
        </div>
    );
}

Chip.defaultProps = {
    color: "light",
    withAvatar: false
};