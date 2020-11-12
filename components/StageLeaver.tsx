/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import Link from 'next/link';
import { jsx, Button, Flex } from 'theme-ui';
import { BiExit } from 'react-icons/bi';

const StageLeaver = (): JSX.Element => (
  <Flex
    sx={{
      position: 'fixed',
      bottom: 0,
      right: '1rem',
      pb: '1rem',
      zIndex: 100,
    }}
  >
    <Link href="/leave">
      <Button
        variant="circle"
        title="Bühne verlassen"
        sx={{ bg: 'primary', color: 'text' }}
      >
        <BiExit size="24px" />
      </Button>
    </Link>
  </Flex>
);

export default StageLeaver;
