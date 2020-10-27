import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        path: {
            fill: "#fff",
            opacity: 0
        }
    }),
);

const Loader = () => {
    const classes = useStyles();

    return (
        <svg
            id="Layer_1"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"
            width="100vw"
            height="100vh"
        >
            <path className={classes.path} d="M89.76,98.31A80.46,80.46,0,0,0,34.35,86.65a50.72,50.72,0,0,0-1.85,13.52c0,1.49.08,3,.21,4.44A63.31,63.31,0,0,1,106,145.2a50.67,50.67,0,0,0,14.39-10.95A80.22,80.22,0,0,0,89.76,98.31Z">
                <animate attributeName="opacity" dur="6s" keyTimes="0;0.1;0.5;0.6;1" values="0;1;1;0;0" repeatCount="indefinite" begin="1s" />
            </path>
            <path className={classes.path} d="M98.53,84.55A96,96,0,0,1,130.36,118a50.4,50.4,0,0,0,3.23-17.78V29.29H83.05V49.63a50.46,50.46,0,0,0-40.2,19.91A96.07,96.07,0,0,1,98.53,84.55Z" fill="#fff">
                <animate attributeName="opacity" dur="6s" keyTimes="0;0.1;0.5;0.6;1" values="0;1;1;0;0" repeatCount="indefinite" begin="2s" />
            </path>
            <path className={classes.path} d="M71.6,126.81a47.36,47.36,0,0,0-34.89-6.46,50.68,50.68,0,0,0,15.17,19.59,13.19,13.19,0,0,1,10.71,2.3h0A13.14,13.14,0,0,1,67,148.11a50.55,50.55,0,0,0,16,2.6,51.08,51.08,0,0,0,7.46-.55A47.23,47.23,0,0,0,71.6,126.81Z" fill="#fff">
                <animate attributeName="opacity" dur="6s" keyTimes="0;0.1;0.5;0.6;1" values="0;1;1;0;0" repeatCount="indefinite" />
            </path>
        </svg >
    );
};
export default Loader;
