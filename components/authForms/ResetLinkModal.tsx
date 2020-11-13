// TODO: We need a new modal, which is free of Material and related components
/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Button, Text, Heading, Box, IconButton } from 'theme-ui';
import CloseIcon from '@material-ui/icons/Close';

interface DialogTitleProps {
  id: string;
  children?: React.ReactNode;
  onClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props;
  return (
    <Box
      sx={{
        m: 0,
        p: 2,
        bg: 'text',
      }}
      {...other}
    >
      <Heading as="h6">{children}</Heading>
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 0,
            top: 0,
            color: 'gray.3',
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </Box>
  );
};

const ResetLinkModal = ({
  resend,
  handleClose,
  onClick,
}: {
  open: boolean;
  resend?: boolean;
  handleClose: () => void;
  onClick: () => void;
}): JSX.Element => (
  <React.Fragment>
    <Box />
    <div>
      <Box
        aria-labelledby="customized-dialog-title"
        sx={{
          width: '400px',
          m: '0 auto',
        }}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Zurücksetzen
        </DialogTitle>
        <Box
          sx={{
            p: 3,
            bg: '#text',
          }}
        >
          <Heading as="h5">
            {!resend
              ? 'Password reset link has been sent'
              : 'Password reset link has been sent again!'}
          </Heading>
          <Text>Click on the reset link sent to your e-mail</Text>

          <Text as="p" sx={{ color: 'gray.2' }}>
            {!resend
              ? 'Use the new password to sign in. Aftewards you will be asked to create e new password'
              : 'Your activation link has been sent to your e-mail address. If you still have not received your email check your e-mail address'}
          </Text>

          {!resend && <Button onClick={onClick}>Resend reset link</Button>}
        </Box>
      </Box>
    </div>
  </React.Fragment>
);

export default ResetLinkModal;
