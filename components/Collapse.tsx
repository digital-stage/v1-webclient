/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex } from 'theme-ui';

interface Props {
  children: React.ReactNode;
  id: string;
}

const Collapse = ({ id, children }: Props): JSX.Element => (
  <Flex
    id={id}
    sx={{
      width: '100%',
      flexDirection: 'column',
    }}
  >
    {children}
  </Flex>
);

export default Collapse;
