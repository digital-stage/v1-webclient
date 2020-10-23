import React from "react";
import { createStyles, Box, makeStyles, Theme } from "@material-ui/core";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            background: "#181818 0% 0% no-repeat padding-box",
            boxShadow: "0px 23px 17px #00000052",
            width: "250px",
            borderRadius: "18px",
            padding: "20px 10px",
            margin:"30px auto"
        },
    }),
);

const FormContainerView = (props: {
    children: React.ReactNode
}) => {
    const classes = useStyles();

    return (
        <Box className={classes.container}>
            {props.children}
        </Box>
    );
};

export default FormContainerView;
