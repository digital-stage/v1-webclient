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

const CollapseBody = (props: Props) : JSX.Element => {
    const { children, isOpen, id, collapseId } = props;

    return (
        (isOpen && id === collapseId) ? (<Box
            sx={{
                width: "100%",
                bg: "gray.7",
                px: 3
            }}
        >
            { children}
        </Box >) : null
    );
};

export default CollapseBody;
