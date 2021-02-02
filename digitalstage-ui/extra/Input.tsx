/** @jsxRuntime classic */
/** @jsx jsx */
import React, { CSSProperties } from 'react';
import { ErrorMessage } from 'formik';
import { Box, Input as ThemeUiInput, jsx, Label, Text } from 'theme-ui';
import { BsFillEyeFill, BsEyeSlashFill } from 'react-icons/bs';

interface Props extends React.ComponentProps<'input'> {
  label: string;
  name: string;
  error?: string;
  version?: string;
  ref?: React.Ref<HTMLInputElement>;
}

const Input = ({ id, label, name, error, version, type, ...rest }: Props): JSX.Element => {
  const [inputType, setInputType] = React.useState<string>(type);

  const resetDisabledSelectOptionColor: CSSProperties = {
    WebkitTextFillColor: version === 'dark' ? 'labelDark' : '#f4f4f4',
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
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
            borderBottom: error ? '1px solid dangerUnderline' : '1px solid transparent',
            borderColor: 'primaryFocus',
          },
        }}
      >
        <Label
          htmlFor={id}
          sx={{
            position: 'absolute',
            width: 'auto',
            maxWidth: '100%',
            top: 5,
            left: 5,
            fontSize: 12,
            fontFamily: 'body',
            fontWeight: 'heading',
            color: version === 'dark' ? 'labelDark' : 'label',
            userSelect: 'none',
          }}
        >
          {label}
        </Label>

        <ThemeUiInput
          id={id}
          type={inputType}
          {...rest}
          sx={{
            color: version === 'dark' ? 'background' : 'text',
            borderColor: 'transparent',
            borderBottom: 0,
            borderRadius: 0,
            width: '100%',
            pt: 40,
            pl: 5,
            pr: type === 'password' ? 40 : 5,
            pb: 5,
            ':active,:-webkit-autofill': {
              ...resetDisabledSelectOptionColor,
              borderBottomColor: 'transparent',
              // ThemeUI color does not work on this prop thus white instead of text
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
      </Box>

      <Box
        sx={{
          color: version === 'dark' ? 'labelDark' : '#f4f4f480',
          minHeight: '2rem',
          py: 3,
        }}
      >
        {error && (
          <ErrorMessage
            name={name}
            render={(msg) => (
              <Text
                sx={{
                  width: '100%',
                  textAlign: 'right',
                  fontSize: 10,
                  fontFamily: 'body',
                  fontWeight: 'heading',
                  color: version === 'dark' ? 'labelDark' : '#f4f4f480',
                }}
              >
                {msg}
              </Text>
            )}
          />
        )}
      </Box>
    </Box>
  );
};

export default Input;
