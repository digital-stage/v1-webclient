import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import StagesList from './StagesList';
import { useRouter } from 'next/router';
import { useAuth } from '../../lib/digitalstage/useAuth';
import Loader from '../Loader';


const useStyles = makeStyles((theme) => ({
    drawerContent: {
        width: "100%"
    }
}));

export default function DrawerContent() {
    const classes = useStyles();
    const router = useRouter();
    const { loading } = useAuth();
    const [content, setContent] = React.useState<React.ReactNode>();

    useEffect(() => {
        if (router.pathname === "/stages") {
            setContent(<StagesList />)
        }
        else {
            setContent(null)
        }
    }, [router.pathname]);

    if (!loading) {
        return (
            <span className={classes.drawerContent}>
                {content}
            </span>
        );
    }

    return <Loader />
}
