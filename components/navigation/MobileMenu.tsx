import {makeStyles} from "@material-ui/core/styles";
import {
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemText,
} from "@material-ui/core";
import React, {useState} from "react";
import MenuIcon from '@material-ui/icons/Menu';
import {useAuth} from "../../lib/digitalstage/useAuth";
import {useRouter} from "next/router";
import useStageSelector from "../../lib/digitalstage/useStageSelector";
import {Stage} from "../../lib/digitalstage/common/model.server";

const useStyles = makeStyles((theme) => ({
    menuButton: {
    },
    title: {
        flexGrow: 1,
    },
    list: {
        width: 250,
    },
}));


const MobileMenu = (props: {
    className?: string
}) => {
    const classes = useStyles();
    const [menuOpen, setMenuOpen] = useState<boolean>(false);
    const router = useRouter();

    const {user} = useAuth();

    const stage = useStageSelector<Stage>(state => state.stageId ? state.stages.byId[state.stageId] : undefined);

    return (
        <>
            <IconButton className={classes.menuButton} color="inherit" aria-label="menu"
                        onClick={() => setMenuOpen(prev => !prev)}>
                <MenuIcon/>
            </IconButton>
            {user && (
                <Drawer className={props.className} anchor="left" open={menuOpen} onClose={() => setMenuOpen(false)}>
                    <List className={classes.list}>
                        {stage && (
                            <>
                                <ListItem button onClick={() => {
                                    router.push("/")
                                        .then(() => setMenuOpen(false))
                                }}>
                                    <ListItemText>{stage.name}</ListItemText>
                                </ListItem>
                                <ListItem button onClick={() => {
                                    router.push("/mixer")
                                        .then(() => setMenuOpen(false))
                                }}>
                                    <ListItemText>Mischpult</ListItemText>
                                </ListItem>
                                <ListItem button onClick={() => {
                                    router.push("/leave")
                                        .then(() => setMenuOpen(false))
                                }}>
                                    <ListItemText>Bühne verlassen</ListItemText>
                                </ListItem>
                            </>
                        )}
                        <ListItem button onClick={() => {
                            router.push("/stages")
                                .then(() => setMenuOpen(false))
                        }}>
                            <ListItemText>Meine Bühnen</ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => {
                            router.push("/devices")
                                .then(() => setMenuOpen(false))
                        }}>
                            <ListItemText>Meine Geräte</ListItemText>
                        </ListItem>
                    </List>
                </Drawer>
            )}
        </>
    )
}
export default MobileMenu;