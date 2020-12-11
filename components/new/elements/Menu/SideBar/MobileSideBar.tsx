/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import { Box, Flex, jsx, Text } from 'theme-ui';
import { CenteredNavItems } from '../../PageWrapperWithStage/MenuItems';

interface Props {
  isOpen?: boolean;
  onSelect(selected): void;
}

const MobileSideBar = ({ isOpen, onSelect }: Props): JSX.Element => {
  return isOpen ? (
    <Box
      sx={{
        position: 'fixed',
        top: '-110px',
        left: '-25px',
        width: 'auto',
        height: 'auto',
        bg: 'gray.3',
        transition: 'background 6s ease-in-out',
        p: 4,
        boxShadow: '0px 3px 6px #000000BC',
        borderRadius: 'card',
        zIndex: 50,
      }}
    >
      <Flex sx={{ justifyContent: 'center' }}>
        {CenteredNavItems.map((item, i) => {
          return (
            <Flex
              key={i}
              sx={{
                justifyContent: 'center',
                alignContent: 'center',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                mx: 3,
              }}
              onClick={() => {
                onSelect(item.href);
              }}
            >
              {item.icon}
              <Text variant="title" sx={{ color: 'text' }}>
                {item.label}
              </Text>
            </Flex>
          );
        })}
      </Flex>
    </Box>
  ) : null;
};
export default MobileSideBar;
