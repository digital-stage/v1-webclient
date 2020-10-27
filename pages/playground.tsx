import React, {useState} from "react";
import {calculateDbMeasurement, formatDbMeasurement} from "../components/experimental/VolumeFader/util";
import {styled, useStyletron} from "styletron-react";
import LogSlider from "../components/experimental/LogSlider";

const Wrapper = styled("div", {
    height: "200px"
});

const Playground = () => {
    const [css] = useStyletron();
    const [volume, setVolume] = useState<number>(1);

    return (
        <div className={css({
            width: "200px"
        })}>
            <LogSlider
                color={[255, 255, 255]}
                volume={volume}
                min={0}
                middle={1}
                max={4}
                onChange={volume => setVolume(volume)}
                width={20}
            />
            <p>
                {formatDbMeasurement(calculateDbMeasurement(volume))} dB
            </p>
            <Wrapper>
                <LogSlider
                    vertical={true}
                    color={[255, 255, 255]}
                    volume={volume}
                    min={0}
                    middle={1}
                    max={4}
                    onChange={volume => setVolume(volume)}
                    width={20}
                />
            </Wrapper>
        </div>
    )
}
export default Playground;