/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Input, Label } from 'theme-ui';

const InputField = ({ id, label, ...rest }) => (
  <React.Fragment>
    <Label for id={id} sx={{ fontSize: 12, color: 'muted', pl: 2 }}>
      {label}
    </Label>
    <Input
      id={id}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      sx={{
        bg: 'transparent',
        border: 'transparent',
        borderBottom: '1px solid transparent',
        borderBottomColor: 'text',
        borderRadius: 0,
        width: '100%',
        mb: 4,
        ':active': {
          border: 'transparent',
          borderBottomColor: 'secondary',
        },
      }}
    />
  </React.Fragment>
);

export default InputField;
