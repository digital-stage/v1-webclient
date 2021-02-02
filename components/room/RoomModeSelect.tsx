/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Link, Flex, SxStyleProp, Heading } from 'theme-ui';
import { useIntl } from 'react-intl';

const RoomModeSelect = (props: {
  global: boolean;
  onChange: (global: boolean) => void;
  sx?: SxStyleProp;
}): JSX.Element => {
  const { global, onChange, sx } = props;
  const { formatMessage } = useIntl();
  const f = (id) => formatMessage({ id });

  return (
    <Flex
      sx={{
        ...sx,
      }}
    >
      <Link
        variant="tab"
        sx={{
          display: 'flex',
          borderBottomColor: !global && 'primary',
          textAlign: 'center',
          minWidth: 'auto',
          px: 8,
        }}
        onClick={() => onChange(false)}
      >
        {f('monitor')}
      </Link>
      <Link
        variant="tab"
        sx={{
          borderBottomColor: global && 'primary',
          textAlign: 'center',
        }}
        onClick={() => onChange(true)}
      >
        {f('global')}
      </Link>
    </Flex>
  );
};

export default RoomModeSelect;
