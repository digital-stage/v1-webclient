/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx, Box, Flex, Text, Heading, Button } from 'theme-ui';
import { SettingsModalItems } from '../new/elements/PageWrapperWithStage/MenuItems';
import useDigitalStage from '../../lib/use-digital-stage';
import Modal from '../ui/Modal';

const SettingsModal = (props: {
  isOpen: boolean;
  onClose(): void;
  selected: string;
}): JSX.Element => {
  const [selected, setSelected] = React.useState(props.selected);
  const { refreshLocalDevice: refreshLocalDeviceInt } = useDigitalStage();

  React.useEffect(() => {
    setSelected(props.selected);
  }, [props.selected]);

  React.useEffect(() => {
    setSelected(selected);
  }, [selected]);

  const refreshLocalDevice = useCallback(() => {
    if (refreshLocalDeviceInt) refreshLocalDeviceInt();
  }, [refreshLocalDeviceInt]);

  return (
    <Modal open={props.isOpen} onClose={props.onClose} closeOnBackdropClicked={true}>
      <Flex
        sx={{
          position: 'relative',
          paddingTop: '2rem',
          paddingBottom: '2rem',
          width: '100%',
          height: '100%',
        }}
      >
        <Box sx={{ width: '30%', display: ['none', 'block'] }}>
          <Heading ml={3} mb={3}>
            Settings
          </Heading>
          <Button onClick={refreshLocalDevice}>Refresh</Button>
          {SettingsModalItems.map((item, i) => {
            return (
              <Flex
                key={i}
                py={2}
                sx={{
                  alignItems: 'center',
                  cursor: 'pointer',
                  mr: 3,
                  padding: 2,
                  pl: 3,
                  bg: selected === item.href && 'gray.3',
                  borderRadius: selected === item.href && '0px 24px 24px 0px',
                  ':hover': {
                    bg: 'gray.2',
                    borderRadius: '0px 24px 24px 0px',
                  },
                }}
                onClick={() => setSelected(item.href)}
              >
                {item.icon}
                <Text variant="title" sx={{ color: 'text' }} ml={2}>
                  {item.label}
                </Text>
              </Flex>
            );
          })}
        </Box>
        <Box
          sx={{
            width: ['100%', '70%'],
            height: '100%',
            ml: 3,
            mr: 4,
            position: 'relative',
            overflowY: 'scroll',
            '::-webkit-scrollbar': {
              width: '15px',
              bg: 'transparent',
            },
            '::-webkit-scrollbar-track': {
              bg: 'transparent',
            },
            '::-webkit-scrollbar-thumb': {
              bg: 'gray.3',
              borderRadius: 'card',
              border: 'solid 3px #282828',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
            }}
          >
            {SettingsModalItems.map((item) => {
              return item.href === selected ? item.content : null;
            })}
          </Box>
        </Box>
      </Flex>
    </Modal>
  );
};

export default SettingsModal;
