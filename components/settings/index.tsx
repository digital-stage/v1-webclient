/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box, Flex, Text, Heading } from 'theme-ui';
import Modal from '../new/elements/Modal';
import { SettingsModalItems } from '../new/elements/PageWrapperWithStage/MenuItems';

const Settings = (props: { isOpen: boolean, onClose(): void }) => {

    return (
        <Modal isOpen={props.isOpen} onClose={props.onClose} variant="dark" type="settings">
            <Flex>
                <Box sx={{ width: "30%", textAlign: "center" }}>
                    <Heading>Settings</Heading>
                    {SettingsModalItems.map((item, i) => {
                        return (
                            <Flex key={i} py={2} sx={{
                                alignItems: 'center',
                                cursor: 'pointer',
                                padding: 3,
                                pl: 3,
                                ':hover': {
                                    bg: 'gray.3',
                                    borderRadius: '0 18px 18px 0'
                                }
                            }}>
                                {item.icon}
                                <Text variant="title" sx={{ color: 'text' }} ml={2}>
                                    {item.label}
                                </Text>
                            </Flex>
                        );
                    })}
                </Box>
                <Box sx={{ width: "70%" }}>Content</Box>
            </Flex>
        </Modal>
    )
}


export default Settings;
