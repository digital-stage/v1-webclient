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
        mt: 4,
        height: '60px',
        bg: error ? 'dangerBg' : version === 'dark' ? 'text' : 'textfield',
        borderBottom: '1px solid transparent',
        borderBottomColor: error ? 'dangerUnderline' : version === 'dark' ? 'background' : 'text',
        ':hover': {
          bg: error ? 'dangerBg' : version === 'dark' ? 'textfieldDark' : 'gray.6',
          borderBottomColor: error ? 'dangerUnderline' : 'primaryHover',
        },
        ':focus': {
          borderBottom: error ? '1px solid dangerUnderline' : '1px solid primary1',
        },
        ':active': {
          borderBottom: error ? '3px solid dangerUnderline' : '3px solid #3737F7',
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
          pl: 2,
          pt: 2,
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
          borderBottom: '1px solid transparent',
          borderRadius: 0,
          width: type === 'password' ? 'calc(100% - 24px)' : '100%',
          pl: 2,
          ':active,:-webkit-autofill': {
            borderBottomColor: 'transparent',
            // ThemeUI color does not work on this prop thus white instead of text
            WebkitTextFillColor: version === 'dark' ? 'labelDark' : '#f4f4f4',
            boxShadow:
              version === 'dark'
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
                color: '#f4f4f480',
                pt: 1,
                float: 'right',
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
