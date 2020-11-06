/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

const CollapseTitle = (props: { children?: React.ReactNode, isOpen:boolean, onClick():void }) => {
    const { children, onClick, isOpen } = props;

    return (
        <Flex
            sx={{
                justifyContent: "space-between"
            }}
            onClick={onClick}
        >
            {children}
            {isOpen ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
        </Flex>
    );
};

export default CollapseTitle;
