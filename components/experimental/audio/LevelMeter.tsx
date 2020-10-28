import React, {useRef} from "react";
import {IAnalyserNode, IAudioContext} from "standardized-audio-context";
import useAnimationFrame from "../../../lib/useAnimationFrame";
import {styled} from "baseui";

const Canvas = styled("canvas", {
    width: "100%",
    height: "100%"
});

function getAverageVolume(array: Uint8Array): number {
    let values = 0;
    let average;

    const length: number = array.length;

    // get all the frequency amplitudes
    for (let i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

const LevelMeter = (
    props: {
        analyser: IAnalyserNode<IAudioContext>,
        vertical?: boolean
    }
) => {
    const canvasRef = useRef<HTMLCanvasElement>();

    useAnimationFrame(() => {
        if (props.analyser && canvasRef.current) {
            const array = new Uint8Array(props.analyser.frequencyBinCount);
            props.analyser.getByteFrequencyData(array);
            const average = getAverageVolume(array);
            const width = canvasRef.current.width;
            const height = canvasRef.current.height;

            const context: CanvasRenderingContext2D = canvasRef.current.getContext("2d");

            context.clearRect(0, 0, width, height);

            if (props.vertical) {
                const gradient = context.createLinearGradient(0, 0, width, 0);
                gradient.addColorStop(0, '#90EE90');
                gradient.addColorStop(0.75, '#ffff00');
                gradient.addColorStop(1, '#ff0000');
                context.fillStyle = gradient;
                context.fillRect(0, 0, average, height);
            } else {
                const gradient = context.createLinearGradient(0, 0, 0, height);
                gradient.addColorStop(1, '#90EE90');
                gradient.addColorStop(0.75, '#ffff00');
                gradient.addColorStop(0, '#ff0000');
                context.fillStyle = gradient;
                context.fillRect(0, height - average, width, height);
            }
        }
    });

    return (
        <Canvas ref={canvasRef}/>
    )
}
export default LevelMeter;