/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Box } from 'theme-ui';

interface Props {
    children: React.ReactNode,
    isOpen: boolean,
    id: string;
    collapseId: string
}

const CollapseBody = (props: Props) => {
    const { children, isOpen, id, collapseId } = props;

    return (
        (isOpen && id === collapseId) ? (<Box
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
