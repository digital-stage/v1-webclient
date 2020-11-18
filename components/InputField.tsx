/** @jsxRuntime classic */
/** @jsx jsx */
import { ErrorMessage } from 'formik';
import { Box, Input, jsx, Label, Text } from 'theme-ui';

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
const InputField = ({ id, label, name, error, version, ...rest }: Props): JSX.Element => (
  <Box sx={{ mt: 4 }}>
    <Label
      htmlFor={id}
      sx={{
        fontSize: 12,
        color: version === 'dark' ? 'gray.3' : 'muted',
        pl: 2,
        bg: error && '#9D131364',
      }}
    >
      {label}
    </Label>
    <Input
      id={id}
      name={name}
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
