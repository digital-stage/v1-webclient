import React from 'react';
import StagesLayout from '../../components/global/layout/StagesLayout';
import SettingsPanel from '../../components/settings/SettingsPanel';

const ProfileSettings = (): JSX.Element => {
  return (
    <StagesLayout>
      <SettingsPanel />
      PROFILE
    </StagesLayout>
  );
};
export default ProfileSettings;
