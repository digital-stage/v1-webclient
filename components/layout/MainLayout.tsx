/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx, Flex, Button} from 'theme-ui';
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import DeviceController from '../global/DeviceController';
import Logo from '../../digitalstage-ui/extra/Logo';
import ProfileMenu from '../navigation/ProfileMenu';
import useDigitalStage, {useSelector} from "../../lib/use-digital-stage";
import {useAuth} from "../../lib/useAuth";
import LoadingOverlay from "../global/LoadingOverlay";
import ErrorPopup from "./utils/ErrorPopup";
import SideBar from "../navigation/SideBar";

const StageLayout = (props: { children: React.ReactNode; projectName?: string }): JSX.Element => {
    const {children, projectName} = props;
    const {pathname} = useRouter();
    const isInsideStage = useSelector<boolean>((state) => !!state.global.stageId);
    const {loading} = useAuth();
    const {ready} = useDigitalStage();

    return (
        <Flex
            sx={{
                position: 'relative',
                background:
                    'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
                backgroundAttachment: 'fixed',
                width: '100vw',
                height: '100vh',
                flexDirection: 'column',
                zIndex: '1',
                "::before": {
                    display: 'block',
                    position: 'absolute',
                    content: '""',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    height: '100%',
                    background: 'transparent linear-gradient(221deg, #343434 0%, #141414 100%) 0% 0% no-repeat padding-box',
                    transitionProperty: 'opacity',
                    transitionDuration: '200ms',
                    transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
                    zIndex: "-1",
                    opacity: isInsideStage ? '1' : '0'
                }
            }}
        >
            {loading || !ready ? (
                <LoadingOverlay/>
            ) : (
                <React.Fragment>
                    <Flex
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            width: '100%',
                            height: '100%',
                            flexDirection: 'row',
                        }}
                    >
                        <Flex
                            sx={{
                                flexDirection: 'column',
                                height: '100vh',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: isInsideStage ? ['0', '80px'] : '0',
                                transform: isInsideStage ? undefined : 'translateX(-200%)',
                                transitionProperty: 'width, transform',
                                transitionDuration: '200ms',
                                transitionTimingFunction: 'cubic-bezier(0.2, 0.8, 0.4, 1)',
                                overflow: 'hidden',
                                flexGrow: 0,
                                flexShrink: 0,
                                border: '1px solid red'
                            }}
                        >
                            <SideBar/>
                        </Flex>
                        <Flex
                            sx={{
                                flexDirection: 'column',
                                minHeight: '100vh',
                                overflowX: 'hidden',
                                overflowY: 'auto',
                                flexGrow: 1
                            }}
                        >
                            {!isInsideStage && (
                                <Flex
                                    sx={{
                                        width: '100%',
                                        alignItems: 'center',
                                        mb: [5, null, 6],
                                        py: 4,
                                        px: [5, 7],
                                    }}
                                >
                                    <Logo alt={projectName} width={110} full/>
                                </Flex>
                            )}
                            {children}
                        </Flex>
                    </Flex>

                    {!isInsideStage && (
                        <Flex
                            sx={{
                                position: ['relative', 'fixed'],
                                top: [undefined, '1rem'],
                                right: [undefined, '4rem'],
                                width: ['100%', 'auto'],
                                justifyContent: ['center', undefined],
                                pb: [5, undefined],
                            }}
                        >
                            <Link href={pathname} locale="de">
                                <Button variant="white" as="a">DE</Button>
                            </Link>
                            <Link href={pathname} locale="en">
                                <Button variant="white" as="a">EN</Button>
                            </Link>
                        </Flex>
                    )}

                    <ProfileMenu/>

                    <DeviceController/>

                    <ErrorPopup/>
                </React.Fragment>
            )}
        </Flex>
    );
};
export default StageLayout;
