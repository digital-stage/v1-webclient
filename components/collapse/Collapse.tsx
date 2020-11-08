/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Box } from 'theme-ui';
import CollapseContent from './CollapseContent';
import CollapseTitle from './CollapseTitle';

const Collapse = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [isOpen, setOpen] = React.useState<boolean>(false);

  return (
    <Box
      sx={{
        background: '#181818 0% 0% no-repeat padding-box',
        minWidth: '60vw'
      }}
    >
      <CollapseTitle onClick={() => setOpen(!isOpen)} isOpen={isOpen} />
      <CollapseContent isOpen={isOpen} />
    </Box>
  );
};

export default Collapse;
