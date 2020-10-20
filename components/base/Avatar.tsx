import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AvatarMaterial from '@material-ui/core/Avatar';

export interface Props {
    height?: string,
    width?: string,
    image?: string,
}

const useStyles = makeStyles<Theme,
    Props>((theme: Theme) => ({
        root: {
            display: 'flex',
            '& > *': {
                margin: theme.spacing(1)
            }
        },
        small: {
            width: ({ width }) => width,
            height: ({ height }) => height,
            margin: theme.spacing(0)
        }
    }));

export default function Avatar(props: Props) {
    const { image } = props
    const classes = useStyles(props);

    return (
        <div className={classes.root}>
            <AvatarMaterial
                alt="avatar"
                src={image}
                className={classes.small}
            />
        </div>
    );
}

Avatar.defaultProps = {
    width: "16px",
    height: "16px"
};
