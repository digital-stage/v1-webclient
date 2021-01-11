import React from 'react';
import StagesLayout from '../../components/global/layout/StagesLayout';
import SettingsPanel from '../../components/settings/SettingsPanel';

const DeviceSettings = (): JSX.Element => {
  return (
    <StagesLayout>
      <SettingsPanel />
      DEVICES
    </StagesLayout>
  );
};
export default DeviceSettings;
