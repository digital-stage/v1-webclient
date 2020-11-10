/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Input, Label, Box, Text } from 'theme-ui';
import { ErrorMessage } from 'formik';

// TODO: add TS interface / type
export interface Props {
  id: string,
  label: string,
  name: string,
  error?: string,
  version?: string,
  type: string,
  value?: any
}
const InputField = ({
  id, label, name, error, version, ...rest
}: Props) => (
  <Box sx={{ mt: 4 }}>
    <Label
      htmlFor={id}
      sx={{
        fontSize: 12,
        color: version === 'dark' ? '#00000099' : 'muted',
        pl: 2,
        bg: error && '#9D131364',
      }}
    >
      {label}
    </Label>
    <Input
      id={id}
      name={name}
        // eslint-disable-next-line react/jsx-props-no-spreading
      {...rest}
      sx={{
        bg: error ? 'dangerBg' : 'transparent',
        color: version === 'dark' ? 'background' : 'text',
        border: 'transparent',
        borderBottom: '1px solid transparent',
        // eslint-disable-next-line no-nested-ternary
        borderBottomColor: error ? 'dangerUnderline' : version === 'dark' ? 'background' : 'text',
        borderRadius: 0,
        width: '100%',
        ':active,:-webkit-autofill': {
          borderBottomColor: 'text',
          // ThemeUI color does not work on this prop thus white instead of text
          WebkitTextFillColor: 'white',
          boxShadow: '0 0 0px 1000px #1c1c1c inset',
        },
      }}
    />
    {error ? (
      <ErrorMessage
        name={name}
        render={(msg) => (
          <Text
            sx={{
              fontSize: 10,
              color: '#707070',
              pt: 1,
            }}
          >
            {msg}
          </Text>
        )}
      />
    ) : null}
  </Box>
);

export default InputField;
