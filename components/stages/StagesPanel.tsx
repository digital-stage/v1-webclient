/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import Panel from '../../digitalstage-ui/elements/surface/Panel';

const StagesPanel = (props: React.ComponentProps<'div'>): JSX.Element => {
  const { children } = props;

  return (
    <Panel
      sx={{
        width: '100%',
        flexDirection: 'column',
        alignItems: 'stretch',
        px: [0, 0],
        py: [0, 0],
        my: 4,
        padding: 0,
      }}
    >
      {children}
    </Panel>
  );
};

export default StagesPanel;
