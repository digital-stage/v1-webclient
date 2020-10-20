import {styled} from "styletron-react";
import {useEffect, useRef, useState} from "react";

const Slider = styled("div", {
    width: "2.125rem",
    height: "100%",
    display: "block",
    position: "relative",
    cursor: "default",
    background: "transparent",
    marginLeft: "auto",
    marginRight: "auto"
});
const Input = styled("input", {
    position: "absolute",
    width: "1px",
    height: "1px",
    top: "0",
    left: "0",
    opacity: "0",
});
const Backside = styled("div", {
    position: "absolute",
    height: "100%",
    width: "0.5rem",
    top: "auto",
    bottom: "0",
    left: "50%",
    transform: "translateY(0) translateX(-50%)"
})
const Complete = styled("div", (props: { $height, $color }) => ({
    position: "absolute",
    height: `${props.$height}%`,
    width: "0.5rem",
    bottom: "0",
    top: "auto",
    left: "50%",
    transform: "translateY(0) translateX(-50%)",
    backgroundColor: props.$color
}));
const Marker = styled("button", (props: { $value }) => ({
    position: "absolute",
    marginTop: "0px",
    marginLeft: "0px",
    top: `${props.$value}%`,
    transform: "translateY(-100%) translateX(-50%)",
    left: "50%",
    width: "1rem",
    height: "1rem",
    backgroundColor: "#1d1d1d",
    outline: "none",
    overflow: "visible",
    cursor: "pointer"
}));
const Hint = styled("div", (props: { $active, $value }) => ({
    display: "none",
    position: "absolute",
    width: "auto",
    height: "auto",
    padding: "0.25rem 0.5rem",
    color: "white",
    backgroundColor: "grey",
    whiteSpace: "nowrap",
    marginTop: "-8px",
    transform: "translateY(-100%) translateX(-50%)",
    "::after": props.$active ? {
        display: "block",
        content: "",
        position: "absolute",
        width: "3.125rem",
        height: "3.125rem",
        borderRadius: "50%",
        backgroundColor: "rgba(187, 187, 187, 1)",
        opacity: "0.3",
        top: "50%",
        left: "50%",
        marginTop: "-1.5625rem",
        marginLeft: "-1.5625rem"
    } : undefined
}));


const VerticalSlider = (
    props: {
        value: number;
        onEnd: (value: number) => any;
        min?: number;
        max?: number;
        steps?: number;
    }
) => {
    const sliderRef = useRef<HTMLDivElement>();
    const markerRef = useRef<HTMLButtonElement>();
    const [active, setActive] = useState<boolean>();
    const [value, setValue] = useState<number>(props.value);

    useEffect(() => {
        setValue(props.value)
    }, [props.value]);

    const percentage: number = 100 / (props.max / props.value);
    const color: string = percentage > 80 ? "red" : percentage > 50 ? "yellow" : "green";

    return (
        <Slider ref={sliderRef}>
            <Input/>
            <Backside/>
            <Complete $height={percentage} $color={color}/>
            <Marker $value={value} ref={markerRef}
                    onMouseMove={event => {
                        const percentage =  Math.round(100 / (sliderRef.current.offsetHeight / Math.min(event.clientY)));
                        console.log(sliderRef.current.offsetHeight);
                        console.log(markerRef.current.offsetTop);
                        console.log(event.clientY);
                        console.log(percentage + "%")
                        setValue(percentage);

                        setActive(true);
                        event.preventDefault();
                    }}
                    onMouseUp={event => {
                        setActive(false);
                        event.preventDefault();
                    }}
            >
                <Hint $value={value} $active={active}>
                    {props.value}
                </Hint>
            </Marker>
        </Slider>
    )
}
export default VerticalSlider;