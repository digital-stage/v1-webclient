import {makeStyles} from "@material-ui/core/styles";
import clsx from 'clsx';


const useStyles = makeStyles((theme) => ({
    root: {
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "72px",
        backgroundColor: "#272727",
    }
}));


const MobileMenu = (props: {
    className: string
}) => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, props.className)}>
            MOBILE MENU TO COME
        </div>
    )
}
export default MobileMenu;