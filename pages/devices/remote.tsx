import React from 'react';
import Container from '../../components/Container';
import DeviceView from '../../components/new/elements/DeviceView';
import useStageSelector from '../../lib/digitalstage/useStageSelector';

const Remote = (): JSX.Element => {
  const { remoteDevices } = useStageSelector((state) => ({
    remoteDevices: state.devices.remote.map((id) => state.devices.byId[id]),
  }));

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
