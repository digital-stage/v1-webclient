import {styled} from "baseui";
import React, {useState} from "react";
import {Typography} from "@material-ui/core";
import {Button} from "baseui/button";
import VerticalSlider from "../../../theme/VerticalSlider";

export const SinglePanel = styled("div", {
    display: "flex",
    flexDirection: "column",
    width: "150px",
    height: "100%",
    padding: "1rem",
});


export const SingleSubPanel = styled(SinglePanel, ({$theme}) => ({
    backgroundColor: $theme.colors.backgroundStateDisabled
}));

export const SinglePanelTitle = styled("div", {
    flexGrow: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
})

export const SinglePanelSlider = styled("div", {
    flexGrow: 1,
    width: '100%',
    padding: "2rem",

})


