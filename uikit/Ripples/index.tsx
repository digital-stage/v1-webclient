import * as React from "react";
import {COLOR} from "../Theme";
import {useCallback, useState} from "react";
import {styled} from "styletron-react";

const RippleContainer = styled("div", {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
})
const Ripple = styled("div", (props: {
    $x: number;
    $y: number;
    $size: number;
}) => ({
    transform: "scale(0)",
    borderRadius: "100%",
    position: "absolute",
    backgroundColor: "rgba(255,255,255,0.75)",
    animationName: "ripple",
    animationDuration: "850ms",
    top: props.$x + "px",
    left: props.$y + "px",
    width: props.$size + "px",
    height: props.$size + "px",
}))

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

let bounce;

const Ripples = (
    props: {
        className?: string;
    }
) => {
    const [ripples, setRipples] = useState<{
        x: number;
        y: number;
        size: number;
    }[]>([]);

    const cleanUp = useCallback((delay: number) => {
        return function () {
            clearTimeout(bounce);
            bounce = setTimeout(() => {
                setRipples([])
            }, delay);
        }
    }, []);


    const showRipple = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        const rippleContainer = event.currentTarget;
        const size = rippleContainer.offsetWidth;
        const pos = rippleContainer.getBoundingClientRect();
        const x = event.pageX - pos.x - (size / 2);
        const y = event.pageY - pos.y - (size / 2);
        setRipples(prev => [...prev, {
            x: x,
            y: y,
            size: size
        }]);
    }, []);

    return (
        <RippleContainer
            className={props.className}
            onMouseDown={showRipple}
            onMouseUp={cleanUp(2000)}
        >
            {ripples.map((ripple, index) => <Ripple key={index} $x={ripple.x} $y={ripple.y} $size={ripple.size}/>)}
        </RippleContainer>
    )
};
export default Ripples;