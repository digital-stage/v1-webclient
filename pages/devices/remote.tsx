import React from 'react';
import Container from '../../components/Container';
import DeviceView from '../../components/new/elements/DeviceView';
import { useRemoteDevices } from '../../lib/use-digital-stage/hooks';

const Remote = (): JSX.Element => {
  const remoteDevices = useRemoteDevices();

  return (
    <Container>
      {remoteDevices && (
        <>
          <h2>Meine anderen Geräte</h2>
          {remoteDevices.map((remoteDevice, index) => (
            <DeviceView key={index} device={remoteDevice} />
          ))}
        </>
      )}
    </Container>
  );
};
export default Remote;
