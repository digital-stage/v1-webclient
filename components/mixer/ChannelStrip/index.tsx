/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx, Text, Flex, SxStyleProp, IconButton} from 'theme-ui';
import {IAnalyserNode, IAudioContext} from 'standardized-audio-context';
import HSLColor from '../../../lib/useColors/HSLColor';
import VolumeSlider from "../VolumeSlider";
import {useCallback, useEffect, useState} from "react";
import {BiReset, BiVolumeMute} from "react-icons/bi";

const ChannelStrip = (props: {
    volume: number;
    muted: boolean;
    onVolumeChanged: (volume: number, muted: boolean) => void;

    resettable?: boolean;
    global?: boolean;
    onReset?: () => void;

    analyserL?: IAnalyserNode<IAudioContext>;
    analyserR?: IAnalyserNode<IAudioContext>;

    sx?: SxStyleProp;
}): JSX.Element => {
    const {volume, muted, onVolumeChanged, resettable, onReset, sx, analyserL, analyserR, global} = props;
    const [value, setValue] = useState<number>();

    useEffect(() => {
        setValue(volume);
    }, [volume])

    const handleChange = useCallback((value) => {
        setValue(value);
    }, []);

    const handleFinalChange = useCallback((value) => {
        setValue(value);
        onVolumeChanged(value, muted);
    }, [onVolumeChanged, muted])

    const handleMute = useCallback(() => {
        onVolumeChanged(value, !muted);
    }, [onVolumeChanged, muted, value]);

    return (
        <Flex
            sx={{
                width: '100%',
                flexDirection: 'column',
                alignItems: 'center',
                ...sx
            }}
        >
            <VolumeSlider
                min={0}
                middle={1}
                max={4}
                value={value}
                onChange={handleChange}
                onFinalChange={handleFinalChange}
                analyserL={analyserL}
                analyserR={analyserR}
                color={resettable
                    ? global
                        ? '#9A9A9A'
                        : '#6f92f8'
                    : '#393939'}
            />
            <Flex
            sx={{

            }}
            >
                <IconButton
                    sx={{
                        flexGrow: 0
                    }}
                    variant={muted ? "iconPrimary" : "iconTertiary"}
                    onClick={handleMute}
                >
                    <BiVolumeMute/>
                </IconButton>

                <IconButton
                    sx={{
                        flexGrow: 0
                    }}
                    variant="iconTertiary"
                    onClick={onReset}
                    disabled={!resettable}
                >
                    <BiReset/>
                </IconButton>
            </Flex>
        </Flex>
    );
};
export default ChannelStrip;
