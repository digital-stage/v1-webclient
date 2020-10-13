import {HeadingLarge} from "baseui/typography";
import React from "react";
import Container from "../../components/theme/layout/Container";
import {useAuth} from "../../lib/digitalstage/useAuth";
import useStageSelector from "../../lib/digitalstage/useStageSelector";

const Profile = () => {
    const {user: authUser} = useAuth();
    const {user} = useStageSelector(state => ({
        user: state.user
    }));

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