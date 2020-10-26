import {StageMember} from "../../../lib/digitalstage/useStageContext/model";
import {useStyletron} from "baseui";
import React from "react";
import {Avatar} from "baseui/avatar";
import OnlineStatus from "../../complex/depreacted/theme/OnlineStatus";
import CanvasPlayer from "../../experimental/CanvasPlayer";
import {Users, VideoConsumers} from "../../../lib/digitalstage/useStageContext/schema";
import {Typography} from "@material-ui/core";
import useStageSelector from "../../../lib/digitalstage/useStageSelector";

const StageMemberView = (props: {
    stageMember: StageMember
}) => {
    const [css] = useStyletron();
    const users = useStageSelector<Users>(state => state.users);
    const videoConsumers = useStageSelector<VideoConsumers>(state => state.videoConsumers);

    const user = users.byId[props.stageMember.userId];

    return (
        <div className={css({
            position: "relative",
            display: 'flex',
            width: '50vw',
            backgroundImage: 'url("/images/white_logo.png")',
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "20%",
            "@media screen and (min-width: 800px)": {
                width: '25vw',
            },
        })}>
            <div className={css({
                paddingTop: '100%'
            })}/>
            {videoConsumers.byStageMember[props.stageMember._id] && videoConsumers.byStageMember[props.stageMember._id].length > 0 &&
            <CanvasPlayer className={css({
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%"
            })} consumers={videoConsumers.byStageMember[props.stageMember._id]
                .map(id => videoConsumers.byId[id])}/>
            }
            <div className={css({
                position: "absolute",
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            })}>
                <div className={css({
                    display: 'flex',
                    width: 'calc(100% - 2rem)',
                    alignItems: 'center'
                })}>
                    <div className={css({
                        margin: '.5rem'
                    })}>
                        <Avatar name={user.name}/>
                    </div>
                    <Typography variant="h5">{user.name}</Typography>
                </div>
                <OnlineStatus overrides={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                }} online={props.stageMember.online}/>
            </div>
        </div>
    )
}
export default StageMemberView;