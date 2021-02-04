import React from 'react';
import {jsx, Flex} from 'theme-ui';
import {useRouter} from 'next/router';
import useDigitalStage, {useSelector} from '../lib/use-digital-stage';
import RoomManager from '../components/room/RoomManager';
import {useAuth} from "../lib/useAuth";

const Room = (): JSX.Element => {
    const router = useRouter();
    const {ready} = useDigitalStage();
    const stageId = useSelector<string>((state) => state.global.stageId);
    const {loading, user} = useAuth();

    if (!loading && !user) {
        router.replace("/account/login");
    }

    if (ready && !stageId) {
        router.replace("/stages");
    }

    return (
        <Flex
            sx={{
                width: '100%',
                height: '100%',
                p: [0, 4],
                pb: [0, 10],
            }}
        >
            <Flex
                sx={{
                    boxShadow: ['none', 'default'],
                    borderRadius: ['none', 'card'],
                    bg: 'gray.4',
                    py: [0, 4],
                    px: [0, 4],
                    width: '100%',
                    height: '100%',
                    flexDirection: 'column',
                }}
            >
                <RoomManager/>
            </Flex>
        </Flex>
    );
};
export default Room;
