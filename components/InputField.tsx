/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { ErrorMessage } from 'formik';
import { Box, Input, jsx, Label, Text } from 'theme-ui';
import { BsFillEyeFill, BsEyeSlashFill } from 'react-icons/bs';

interface Props {
  id: string;
  label: string;
  name: string;
  type: string;
  error?: string;
  version?: string;
  value?: string;
  ref?: React.MutableRefObject<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputField = ({ id, label, name, error, version, type, ...rest }: Props): JSX.Element => {
  const [inputType, setInputType] = React.useState<string>(type);

  return (
    <Box
      sx={{
        position: 'relative',
        my: 5,
        height: '64px',
        bg: error ? 'dangerBg' : version === 'dark' ? 'text' : 'textfield',
        borderBottom: '1px solid transparent',
        borderBottomColor: error ? 'dangerUnderline' : version === 'dark' ? 'background' : 'text',
        ':hover': {
          bg: error ? 'dangerBg' : version === 'dark' ? 'textfieldDark' : 'gray.6',
          borderBottomColor: error ? 'dangerUnderline' : 'primaryHover',
        },
        ':focus': {
          borderBottom: error ? '1px solid dangerUnderline' : '1px solid primaryActive',
        },
        ':active': {
          borderBottom: error ? '3px solid dangerUnderline' : '3px solid transparent',
          borderColor: 'primaryFocus',
        },
      }}
    >
      <Label
        htmlFor={id}
        sx={{
          fontSize: 12,
          fontFamily: 'body',
          fontWeight: 'heading',
          color: version === 'dark' ? 'labelDark' : 'label',
          pl: 5,
          pt: 5,
        }}
      >
        {label}
      </Label>
      <Input
        id={id}
        name={name}
        type={inputType}
        {...rest}
        sx={{
          color: version === 'dark' ? 'background' : 'text',
          border: 'transparent',
          borderBottom: 0,
          borderRadius: 0,
          width: type === 'password' ? 'calc(100% - 24px)' : '100%',
          pl: 5,
          ':active,:-webkit-autofill': {
            borderBottomColor: 'transparent',
            // ThemeUI color does not work on this prop thus white instead of text
            WebkitTextFillColor: version === 'dark' ? 'labelDark' : '#f4f4f4',
            boxShadow: error
              ? '0 0 0px 1000px #4a1313 inset'
              : version === 'dark'
              ? '0 0 0px 1000px #12121226 inset'
              : '0 0 0px 1000px #282828 inset',
          },
          'input:-internal-autofill-selected': {
            bg: error ? 'dangerBg' : version === 'dark' ? 'textfieldDark' : 'gray.6',
          },
          ':focus': {
            outline: 0,
          },
          ':active': {
            borderBottom: 'transparent',
            outline: 0,
          },
        }}
      />
      {type === 'password' && (
        <Box
          sx={{
            position: 'absolute',
            right: '2px',
            top: '33px',
            color: version === 'dark' ? 'labelDark' : 'label',
            width: '24px',
            height: '16px',
          }}
        >
          {inputType === 'password' ? (
            <BsFillEyeFill onClick={() => setInputType('text')} />
          ) : (
            <BsEyeSlashFill onClick={() => setInputType('password')} />
          )}
        </Box>
      )}
      {error ? (
        <ErrorMessage
          name={name}
          render={(msg) => (
            <Text
              sx={{
                fontSize: 10,
                fontFamily: 'body',
                fontWeight: 'heading',
                color: version === 'dark' ? 'labelDark' : '#f4f4f480',
                py: 3,
                float: 'right',
                height: 'auto',
              }}
            >
              {msg}
            </Text>
          )}
        />
      ) : null}
    </Box>
  );
};

export default InputField;
