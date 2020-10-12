import {StageMember} from "../../lib/digitalstage/useStageContext/model";
import {useStageState} from "../../lib/digitalstage/useStageContext";

const StageMemberView = (props: {
    stageMember: StageMember
}) => {
    const {users} = useStageState();

    const user = users.byId[props.stageMember.userId];

    return (
        <div>
            {props.stageMember._id}
            {props.stageMember.online ? " (online)" : " (offline)"}
            {user && <div>
                {user.name}
            </div>}
        </div>
    )
}
export default StageMemberView;