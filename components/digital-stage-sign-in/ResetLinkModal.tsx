import React from 'react';
import { createStyles, makeStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Button from '../base/Button';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            margin: 0,
            padding: theme.spacing(2),
            backgroundColor:"#fff"
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
    children: React.ReactNode;
    onClose: () => void;
}

const DialogTitle = withStyles(styles)((props: DialogTitleProps) => {
    const { children, classes, onClose, ...other } = props;
    return (
        <MuiDialogTitle disableTypography className={classes.root} {...other}>
            <Typography variant="h6">{children}</Typography>
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
        backgroundColor:"#fff"
    },
}))(MuiDialogContent);

const useStyles = makeStyles((theme) => ({
    paper: {
        width: '400px',
        margin: "0 auto"
    },
}));

export default function ResetLinkModal(props: {
    open: boolean,
    handleClose: () => void,
    onClick?: () => void,
    resend?: boolean
}) {
    const classes = useStyles();

    return (
        <div>
            <Dialog onClose={props.handleClose} aria-labelledby="customized-dialog-title" open={props.open} className={classes.paper}>
                <DialogTitle id="customized-dialog-title" onClose={props.handleClose}>
                </DialogTitle>
                <DialogContent >
                    <Typography variant="h5" color="textSecondary">
                        {!props.resend ? "Password reset link has been sent" : "Password reset link has been sent again!"}
                    </Typography>
                    <Typography variant="h6" color="textSecondary">
                        Click on the reset link sent to your e-mail
                     </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {!props.resend ? "Use the new password to sign in. Aftewards you will be asked to create e new password" :
                            "Your activation link has been sent to your e-mail address. If you still have not received your email check your e-mail address"}
                    </Typography>
                    {!props.resend && <Button
                        color="primary"
                        text="Resend reset link"
                        onClick={props.onClick}
                    />}
                </DialogContent>
            </Dialog>
        </div>
    );
}