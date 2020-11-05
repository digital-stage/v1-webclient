import React from 'react';
import Container from '../../components/complex/depreacted/theme/layout/Container';
import DeviceView from '../../components/new/elements/DeviceView';
import useStageSelector from '../../lib/digitalstage/useStageSelector';

const Remote = () => {
  const { remoteDevices } = useStageSelector((state) => ({
    remoteDevices: state.devices.remote.map((id) => state.devices.byId[id]),
  }));

  return (
    <Container>
      {remoteDevices && (
        <>
          <h2>Meine anderen Geräte</h2>
          {remoteDevices.map((remoteDevice) => <DeviceView device={remoteDevice} />)}
        </>
      )}
    </Container>
  );
};
export default Remote;
