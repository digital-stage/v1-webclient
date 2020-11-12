// TODO: We need a new modal, which is free of Material and related components
/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Text, Heading, Box } from 'theme-ui';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';

const styles = (theme: Theme) =>
  createStyles({
    root: {
      margin: 0,
      padding: theme.spacing(2),
      backgroundColor: '#fff',
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

export interface DialogTitleProps extends WithStyles<typeof styles> {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Heading as="h6">{children}</Heading>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: '#fff',
  },
}))(MuiDialogContent);

const useStyles = makeStyles(() => ({
  paper: {
    width: '400px',
    margin: '0 auto',
  },
}));

const ResetLinkModal = ({
  open,
  resend,
  handleClose,
  onClick,
}: {
  open: boolean;
  resend?: boolean;
  handleClose: () => void;
  onClick: () => void;
}): JSX.Element => {
  const classes = useStyles();

  return (
    <React.Fragment>
      <Box />
      <div>
        <Dialog
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          open={open}
          className={classes.paper}
        >
          <DialogTitle id="customized-dialog-title" onClose={handleClose} />
          <DialogContent>
            <Heading as="h5">
              {!resend
                ? 'Password reset link has been sent'
                : 'Password reset link has been sent again!'}
            </Heading>
            <Text>Click on the reset link sent to your e-mail</Text>

            <Typography variant="subtitle1" color="textSecondary">
              {!resend
                ? 'Use the new password to sign in. Aftewards you will be asked to create e new password'
                : 'Your activation link has been sent to your e-mail address. If you still have not received your email check your e-mail address'}
            </Typography>

            {!resend && <Button onClick={onClick}>Resend reset link</Button>}
          </DialogContent>
        </Dialog>
      </div>
    </React.Fragment>
  );
};

export default ResetLinkModal;
