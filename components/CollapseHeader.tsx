/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex, Box, IconButton } from 'theme-ui';
import { FaChevronDown, FaChevronLeft } from 'react-icons/fa'

const CollapseHeader = (props: {
    children: React.ReactNode, isOpen: boolean, onClick?(): void,
}) => {
    const { children, onClick, isOpen } = props;

    return (
        <Flex
            sx={{
                width: "100%",
                bg: "background",
                alignItems: "center",
                justifyContent: 'space-between',
                px: 3
            }}
        >
            <Box sx={{width:"100%"}}>{children}</Box>
            <IconButton onClick={onClick}>{isOpen ? <FaChevronDown /> : <FaChevronLeft />}</IconButton>
        </Flex>
    );
};

export default CollapseHeader;
