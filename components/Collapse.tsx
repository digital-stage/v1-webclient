/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

interface Props {
    children: React.ReactNode
}

const Collapse = (props: Props) => {
    return (
        <Flex
            sx={{
                width: '100%',
                flexDirection:"column"
            }}
        >
            {props.children}
        </Flex>
    )
}


export default Collapse;
