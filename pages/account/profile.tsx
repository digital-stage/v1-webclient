import {HeadingLarge} from "baseui/typography";
import React from "react";
import Container from "../../components/theme/Container";
import {useDevices} from "../../lib/digitalstage/useDevices";
import {useAuth} from "../../lib/digitalstage/useAuth";

const Profile = () => {
    const {user: authUser} = useAuth();
    const {user} = useDevices();

    return (
        <Container>
            {user && (
                <>
                    <HeadingLarge>{user.name}</HeadingLarge>
                    <HeadingLarge>{authUser.email}</HeadingLarge>
                    <HeadingLarge>{user.avatarUrl}</HeadingLarge>
                </>
            )}

        </Container>
    );
}

export default Profile;