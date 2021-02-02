/** @jsxRuntime classic */
/** @jsx jsx */
import {jsx, Flex, Box, Button} from 'theme-ui';
import React from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {useAuth} from "../../../lib/useAuth";
import LoadingOverlay from "./../LoadingOverlay";
import ErrorPopup from "./utils/ErrorPopup";

const AuthLayout = (props: { children: React.ReactNode }): JSX.Element => {
    const {children} = props;
    const {pathname} = useRouter();
    const {loading} = useAuth();

    if (loading) {
        // Return loading screen
        return (
            <Flex
                sx={{
                    background:
                        'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
                    backgroundAttachment: 'fixed',
                    minHeight: '100vh',
                    flexDirection: 'column',
                }}
            >
                <LoadingOverlay/>
            </Flex>
        );
    }

    return (
        <Flex
            sx={{
                background:
                    'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
                backgroundAttachment: 'fixed',
                minHeight: '100vh',
                flexDirection: 'column',
            }}
        >
            <Flex
                sx={{
                    width: '100%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    px: 3,
                    py: 4,
                }}
            >
                {children}
            </Flex>
            <Flex
                sx={{
                    position: ['relative', 'fixed'],
                    top: [undefined, '1rem'],
                    right: [undefined, '1rem'],
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

            <ErrorPopup/>
        </Flex>
    );
};
export default AuthLayout;
