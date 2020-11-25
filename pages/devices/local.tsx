/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Heading } from 'theme-ui';
import Link from 'next/link';
import DeviceView from '../../components/new/elements/DeviceView';
import Container from '../../components/Container';
import { useLocalDevice } from '../../lib/use-digital-stage/hooks';

const Local = (): JSX.Element => {
  const localDevice = useLocalDevice();

  return (
    <Container>
      <Heading>Dieses Gerät</Heading>
      {localDevice && <DeviceView device={localDevice} />}
      <Box sx={{ my: '2rem' }}>
        <Link href="/test">
          <Button>Dieses Gerät testen</Button>
        </Link>
      </Box>
    </Container>
  );
};
export default Local;
