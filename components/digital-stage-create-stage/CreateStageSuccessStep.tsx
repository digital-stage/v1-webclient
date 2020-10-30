import { Box, createStyles, Grid, Grow, makeStyles, Theme, Typography } from '@material-ui/core';
import { CheckCircleOutline } from '@material-ui/icons';
import React from 'react';
import { useStage } from '../stage/useStage';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        textAlign: 'center',
    },
}));

const CreateStageSuccessStep = () => {
    const classes = useStyles()
    const { info } = useStage()
    const [checked] = React.useState(true);

    return (
        <Grid
            container
            direction="column"
            justify="center"
            alignContent="center"
            className={classes.root}
        >
            <Box my={2}>
                <Typography variant="h3">{info.name}</Typography>
            </Box>
            <Box my={2}>
                <Typography variant="h5">Stage "{info.name}" <br />
                has been succssesfully created!</Typography>
            </Box>
            <Grow
                in={checked}
                style={{ transformOrigin: '0 0 0' }}
                {...(checked ? { timeout: 1000 } : {})}
            >
                <CheckCircleOutline style={{ fontSize: 40, margin: "10px auto" }} />
            </Grow>
        </Grid>
    )
}

export default CreateStageSuccessStep