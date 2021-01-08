/** @jsxRuntime classic */
/** @jsx jsx */
import { jsx, Flex } from 'theme-ui';

const StageLayout = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;

  return (
    <Flex
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
      }}
    >
      {children}
    </Flex>
  );
};
export default StageLayout;
