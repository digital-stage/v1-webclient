import {Theme} from "@material-ui/core/styles";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import React from "react";
import SideDrawer from "../../navigation/SideDrawer";
import MobileMenu from "../../navigation/MobileMenu";
import {useTheme} from "@material-ui/styles";
import {useStyletron} from "styletron-react";
import LocalDeviceControl from "../LocalDeviceControl";
import StageOrMixerSwitcher from "../../elements/sticky/StageOrMixerSwitcher";
import AudioPlaybackStarter from "../../elements/sticky/AudioPlaybackStarter";
import ProfileIcon from "../../elements/sticky/ProfileIcon";

const PageWrapper = (props: {
    children: React.ReactNode
}) => {
    const {user} = useAuth();
    const {breakpoints} = useTheme<Theme>();
    const [css] = useStyletron();

    return (
        <div className={css({
            width: "100%",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            [breakpoints.up('md')]: {
                flexDirection: user ? "row" : "column"
            }
        })}>
            {user && (
                <>
                    <div className={css({
                        display: "none",
                        [breakpoints.up('md')]: {
                            display: "flex"
                        }
                    })}>
                        <SideDrawer/>
                    </div>
                    <div className={css({
                        display: "block",
                        width: "100%",
                        [breakpoints.up('md')]: {
                            display: "none"
                        }
                    })}>
                        <MobileMenu/>
                    </div>
                </>
            )}
            <main className={css({
                flexGrow: 1,
                flexShrink: 0,
                position: "relative",
                display: "flex",
                flexDirection: "column"
            })}>
                {props.children}
            </main>

            <LocalDeviceControl/>

            <StageOrMixerSwitcher/>

            <AudioPlaybackStarter/>

            <ProfileIcon/>
        </div>
    )
};
export default PageWrapper;