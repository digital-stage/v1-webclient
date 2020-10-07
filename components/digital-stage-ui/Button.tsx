import React from "react";

export const Button = (props: {
    type: 'submit' | 'reset' | 'button',
    children: React.ReactNode,
    disabled: boolean
}) => {

    return (
        <button disabled={props.disabled} type={props.type}>
            {props.children}
        </button>
    )
}