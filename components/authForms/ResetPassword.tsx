import React from 'react';
import {
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import Card from '../Card';
import ResetPasswordForm from './ResetPasswordForm';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      background:
        'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box;',
      minHeight: '100vh',
      color: theme.palette.common.white,
      paddingTop: theme.spacing(4),
      paddingBottom: theme.spacing(4),
    },
    text: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
    },
  })
);

const ResetPassword = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        alignContent="center"
        alignItems="center"
      >
        <img
          src="/images/welcome_icon.png"
          width="180"
          height="auto"
          alt="logo"
        />
      </Grid>
      <Card>
        <ResetPasswordForm {...props} />
      </Card>
    </div>
  );
};

export default ResetPassword;
