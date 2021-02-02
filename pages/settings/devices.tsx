import React from 'react';
import SettingsLayout from '../../components/layout/SettingsLayout';
import SettingsNavigation from '../../components/settings/SettingsNavigation';

const DeviceSettings = (): JSX.Element => {
  return (
    <SettingsLayout>
      <SettingsNavigation />
      DEVICES
    </SettingsLayout>
  );
};
export default DeviceSettings;
