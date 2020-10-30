import {Button as BaseButton} from "baseui/button";
import * as React from "react";
import {COLOR} from "../Theme";
import Ripples from "../Ripples";
import {CSSProperties} from "react";

export interface SHAPE {
    default: 'default';
    pill: 'pill';
    round: 'round';
    circle: 'circle';
    square: 'square';
}

export interface KIND extends COLOR {
    minimal: 'minimal';
}

const Button = (
    props: {
        children: React.ReactNode,
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => any;
        shape?: SHAPE[keyof SHAPE];
        kind?: KIND[keyof KIND];
        style?: CSSProperties;
        startEnhancer?: React.ReactNode;
        endEnhancer?: React.ReactNode;
    }
) => {
    return (
        <BaseButton
            startEnhancer={props.startEnhancer}
            endEnhancer={props.endEnhancer}
            onClick={props.onClick}
            overrides={{
                Root: {
                    style: {
                        position: "relative",
                        overflow: "hidden",
                        ...props.style
                    }
                }
            }}
            kind={props.kind}
            shape={props.shape}
        >
            {props.children}
            <Ripples/>
        </BaseButton>
    )
};
export default Button;