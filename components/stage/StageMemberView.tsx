import {StageMember} from "../../lib/digitalstage/useStageContext/model";
import {useStageState} from "../../lib/digitalstage/useStageContext";
import {useStyletron} from "baseui";
import React from "react";
import {Avatar} from "baseui/avatar";
import OnlineStatus from "../theme/OnlineStatus";
import CanvasPlayer from "../video/CanvasPlayer";
import {H2} from "../theme/typography/Headline";

const StageMemberView = (props: {
    stageMember: StageMember
}) => {
    const [css] = useStyletron();
    const {users, videoConsumers} = useStageState();

    const user = users.byId[props.stageMember.userId];

    return (
        <div className={css({
            position: "relative",
            display: 'flex',
            width: '50vw',
            background: 'radial-gradient(ellipse at center, rgba(125,126,125,0.2) 0%,rgba(0,0,0,1) 60%)',
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
                    <H2>{user.name}</H2>
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