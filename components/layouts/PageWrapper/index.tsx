import {Theme} from "@material-ui/core/styles";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import React from "react";
import SideDrawer from "../../navigation/SideDrawer";
import MobileMenu from "../../navigation/MobileMenu";
import {useTheme} from "@material-ui/styles";
import {useStyletron} from "styletron-react";
import LocalDeviceControl from "../LocalDeviceControl";
import {BaseProvider} from "baseui";
import StageJoiner from "../StageJoiner";




const PageWrapper = (props: {
    children: React.ReactNode
}) => {
    const {user} = useAuth();
    const {breakpoints} = useTheme<Theme>();
    const [css] = useStyletron();

    return (
        <div className={css({
            width: "100%",
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
                flexShrink: 0
            })}>
                {props.children}
            </main>

            <LocalDeviceControl/>
        </div>
    )
};
export default PageWrapper;