import iconPath from "./IconsList";
import React, {MouseEventHandler} from "react";
import {styled, useStyletron} from "styletron-react";

const Svg = styled('svg', {
    fill: "currentColor"
})

const Icon2 = (props: {
    name: string,
    size?: number,
    onClick?: MouseEventHandler<HTMLOrSVGElement>,
    circled?: boolean
}) => {
    const [css] = useStyletron();

    return (
        <Svg
            className={css({
                width: `${props.size || 24}px`,
                height: `${props.size || 24}px`,
            })}
            viewBox={`0 0 ${props.size || 24} ${props.size || 24}`}
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            onClick={props.onClick}
        >
            <title id={props.name}>{props.name}</title>
            <g className={css({
                fill: "currentColor"
            })}>
                {props.circled && <circle cx="16" cy="16" r="16" fill="currentColor"/>}
                {iconPath(props.name, "currentColor")}
            </g>
        </Svg>
    );
};
export default Icon2;