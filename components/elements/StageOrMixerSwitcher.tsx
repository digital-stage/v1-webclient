import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Link from "next/link";
import Icon2 from "../base/Icon2";
import useStageSelector from "../../lib/digitalstage/useStageSelector";
import {styled} from "styletron-react";
import IconButton from "./IconButton";
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';

const Wrapper = styled("div", {
    position: "fixed",
    bottom: "1rem",
    right: "1rem"
});

const StageOrMixerSwitcher = (props: {
    className?: string
}) => {
    const currentStageId = useStageSelector<string>(state => state.stageId);
    const {pathname} = useRouter();
    const [mixerShown, setMixerShown] = useState<boolean>(false);

    useEffect(() => {
        setMixerShown(pathname === "/mixer");
    }, [pathname])

    if (currentStageId) {
        return (
            <Wrapper className={props.className}>
                <Link href={mixerShown ? "/" : "/mixer"}>
                    <IconButton color="inherit">
                        <Icon2 size={64} name={mixerShown ? "stage" : "mixer"}/>
                    </IconButton>
                </Link>
            </Wrapper>
        )
    }

    return null;
};
export default StageOrMixerSwitcher;