/* eslint-disable react/destructuring-assignment */
/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, Flex } from 'theme-ui';

interface Props {
    children: React.ReactNode,
    id:string
}

const Collapse = (props: Props) => {
    return (
        <Flex
            sx={{
                width: '100%',
                flexDirection:"column"
            }}
            id={props.id}
        >
            {props.children}
        </Flex>
    )
}


export default Collapse;
