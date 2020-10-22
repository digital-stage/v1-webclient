import {makeStyles} from "@material-ui/core/styles";
import {
    AppBar,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Menu,
    MenuItem,
    Toolbar,
    Typography
} from "@material-ui/core";
import React, {useState} from "react";
import MenuIcon from '@material-ui/icons/Menu';
import {useAuth} from "../../lib/digitalstage/useAuth";
import {AccountCircle} from "@material-ui/icons";
import {useRouter} from "next/router";


const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
}));


const MobileMenu = (props: {
    className: string
}) => {
    const {user} = useAuth();
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <>
            <AppBar position="static" className={props.className}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"
                                onClick={() => setMenuOpen(prev => !prev)}>
                        <MenuIcon/>
                    </IconButton>
                    <Typography className={classes.title} variant="h3" noWrap>
                        Digital Stage
                    </Typography>
                    {user && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle/>
                            </IconButton>

                            <Menu
                                id="menu-appbar"
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
                        </div>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer className={props.className} anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
                <List className={classes.list}>
                    <ListItem button onClick={() => {
                        router.push("/")
                            .then(() => setMenuOpen(false))
                    }}>
                        <ListItemText>My stage</ListItemText>
                    </ListItem>
                    <ListItem button onClick={() => {
                        router.push("/mixer")
                            .then(() => setMenuOpen(false))
                    }}>
                        <ListItemText>MIXER</ListItemText>
                    </ListItem>
                    <ListItem button onClick={() => {
                        router.push("/stages")
                            .then(() => setMenuOpen(false))
                    }}>
                        <ListItemText>STAGES</ListItemText>
                    </ListItem>
                    <ListItem button onClick={() => {
                        router.push("/devices")
                            .then(() => setMenuOpen(false))
                    }}>
                        <ListItemText>DEVICES</ListItemText>
                    </ListItem>
                </List>
            </Drawer>
        </>
    )
}
export default MobileMenu;