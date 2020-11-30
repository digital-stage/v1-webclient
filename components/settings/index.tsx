/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React, { useCallback } from 'react';
import { jsx, Box, Flex, Text, Heading, Button } from 'theme-ui';
import Modal from '../new/elements/Modal';
import { SettingsModalItems } from '../new/elements/PageWrapperWithStage/MenuItems';
import useDigitalStage from '../../lib/use-digital-stage';

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
    <Modal isOpen={props.isOpen} onClose={props.onClose} variant="dark" type="settings">
      <Flex>
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
            ml: 3,
            mr: 4,
            maxHeight: 'calc(100vh - 230px)',
            overflowY: 'auto',
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
          {SettingsModalItems.map((item) => {
            return item.href === selected ? item.content : null;
          })}
        </Box>
      </Flex>
    </Modal>
  );
};

export default SettingsModal;
