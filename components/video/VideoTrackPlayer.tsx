import React, {useEffect, useRef} from "react";
import {styled} from "baseui";

const Video = styled('video', {
    backgroundColor: 'black'
});

export default (props: {
    track: MediaStreamTrack
}) => {
    const videoRef = useRef<HTMLVideoElement>();

    useEffect(() => {
        if (props.track) {

            videoRef.current.srcObject = new MediaStream([props.track]);

            console.log(videoRef.current.srcObject);

            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise.then(_ => {
                    // Automatic playback started!
                    // Show playing UI.
                })
                    .catch(error => {
                        // Auto-play was prevented
                        // Show paused UI.
                    });
            }
        } else {
            videoRef.current.srcObject = null;
        }
    }, [props.track]);

    return (
        <Video ref={videoRef} autoPlay={true} muted={true} playsInline={true}/>
    )
};

