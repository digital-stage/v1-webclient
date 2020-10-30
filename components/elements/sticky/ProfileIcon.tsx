import {Menu, MenuItem} from "@material-ui/core";
import React, {useState} from "react";
import {useRouter} from "next/router";
import {AccountCircle} from "@material-ui/icons";
import {styled, useStyletron} from "styletron-react";
import {useAuth} from "../../../lib/digitalstage/useAuth";
import useTheme from "@material-ui/core/styles/useTheme";

const Wrapper = styled("div", {
    position: "absolute",
    top: "1rem",
    right: "1rem"
})

const ProfileIcon = () => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const {user} = useAuth();
    const {palette} = useTheme();
    const [css] = useStyletron();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    if (user) {

        return (
            <Wrapper>
                <div
                    className={css({
                        color: palette.text.primary,
                        cursor: "pointer",
                        ":hover": {
                            color: palette.text.secondary
                        }
                    })}
                    aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
                    <AccountCircle color="inherit" fontSize="large"/>
                </div>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem onClick={() =>
                        router.push("/account/profile")
                            .then(handleClose)
                    }>
                        Profile
                    </MenuItem>
                    <MenuItem onClick={() =>
                        router.push("/account/logout")
                            .then(handleClose)
                    }>Logout</MenuItem>
                </Menu>
            </Wrapper>
        );
    }
    return null;
};
export default ProfileIcon;