import React from 'react';

const SettingsPanel = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  return <div>{children}</div>;
};
export default SettingsPanel;
