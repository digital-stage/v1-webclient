/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

const CollapseBody = (props: { children: React.ReactNode, isOpen: boolean }) => {
    const { children, isOpen } = props;

    return (
        isOpen ? (<Box
            sx={{
                width: "100%",
                bg: "gray.7",
                px: 3,
                transition: "all 290ms cubic-bezier(0.4, 0, 0.2, 1)"
            }}
        >
            { children}
        </Box >) : null
    );
};

export default CollapseBody;
