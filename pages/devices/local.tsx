/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box, Button, Heading } from 'theme-ui';
import Link from 'next/link';
import DeviceView from '../../components/new/elements/DeviceView';
import useStageSelector from '../../lib/digitalstage/useStageSelector';
import Container from '../../components/Container';

const Local = (): JSX.Element => {
  const { localDevice } = useStageSelector((state) => ({
    localDevice: state.devices.local ? state.devices.byId[state.devices.local] : undefined,
  }));

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
