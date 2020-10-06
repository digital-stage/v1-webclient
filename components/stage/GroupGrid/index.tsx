import React, {useEffect, useState} from "react";
import {styled} from "styletron-react";
import {LabelMedium} from "baseui/typography";
import {FlexGrid, FlexGridItem} from "baseui/flex-grid";
import {useStyletron} from "baseui";
import CanvasPlayer from "../../video/CanvasPlayer";
import Client from "../../../lib/digitalstage/common/model.client";
import {AudioPlayer} from "../../audio/AudioPlayer";
import VolumeSlider from "../../audio/VolumeSlider";
import {useStages} from "../../../lib/digitalstage/useStages";

const Card = styled("div", {
    position: "relative",
    backgroundColor: "black",
});

const CardConstraint = styled("div", {
    position: "relative",
    width: "100%",
    paddingTop: "75%"

})

const CardContent = styled("div", {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%"
})

const SoundjackLogo = styled("img", {
    position: "absolute",
    width: "48px",
    height: "48px",
    top: 0,
    right: 0
});

const PoweredBySoundjack = styled("div", {
    position: "absolute",
    width: "100%",
    left: 0,
    right: 0,
    top: "30px"
})

const GroupGrid = (props: {
    group?: Client.Group;
}) => {
    const {setStageMemberVolume} = useStages();
    const [numDesktopCols, setNumDesktopCols] = useState<number>(1);
    const [css] = useStyletron();

    useEffect(() => {
        if (props.group.members && props.group.members.length <= 1) {
            setNumDesktopCols(1);
        } else {
            if (props.group.members.length > 4) {
                setNumDesktopCols(4)
            } else {
                setNumDesktopCols(2)
            }
        }
    }, [props.group.members]);

    return (
        <FlexGrid
            width="100%"
            flexGridColumnCount={[
                1,
                props.group.members.length > 1 ? 2 : 1,
                props.group.members.length > 1 ? 2 : 1,
                numDesktopCols
            ]}
            flexGridColumnGap="scale800"
            flexGridRowGap="scale800"
        >
            {props.group.members && props.group.members.map(member => (
                <FlexGridItem key={member._id}>
                    <Card>
                        <CardConstraint/>
                        <CardContent>
                            {member.ovTracks.length > 0 && (
                                <>
                                    <SoundjackLogo src={"soundjack.png"}/>
                                    <PoweredBySoundjack>
                                        <LabelMedium>
                                            Powered by ovbox
                                        </LabelMedium>
                                    </PoweredBySoundjack>
                                </>
                            )}
                            <CanvasPlayer
                                className={css({
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%"
                                })}
                                consumers={member.videoConsumers}/>
                            <div className={css({
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: "100%",
                                display: 'flex',
                                alignItems: 'center'
                            })}>
                                <div className={css({
                                    width: "1rem",
                                    height: "1rem",
                                    backgroundColor: member.online ? "green" : "red",
                                    borderRadius: "50%",
                                    marginRight: ".5rem"
                                })}>
                                </div>
                                <LabelMedium $style={{
                                    textShadow: "rgb(0, 0, 0) 0px 0px 4px"
                                }}>
                                    {member.name}
                                </LabelMedium>
                            </div>
                            <div
                                className={css({
                                    position: "absolute",
                                    bottom: 0,
                                    left: 0,
                                    width: "100%",
                                })}
                            >

                                <VolumeSlider
                                    min={0}
                                    max={1}
                                    step={0.1}
                                    color="green"
                                    value={member.volume}
                                    onChange={(volume) => setStageMemberVolume(member._id, volume)}
                                />
                            </div>
                            {member.audioConsumers.map(audioConsumer => (
                                <AudioPlayer
                                    key={audioConsumer.remoteProducer._id}
                                    track={audioConsumer.msConsumer.track}
                                    groupVolume={props.group.volume}
                                    customGroupVolume={props.group.customVolume}
                                    stageMemberVolume={member.volume}
                                    customStageMemberVolume={member.customVolume}
                                />
                            ))}
                        </CardContent>
                    </Card>
                </FlexGridItem>
            ))}
        </FlexGrid>
    )
}
export default GroupGrid;