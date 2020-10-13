import React from "react";
import {StyleObject} from "styletron-standard";
import {
    DisplaySmall as BaseDisplaySmall,
    DisplayMedium as BaseDisplayMedium,
    DisplayLarge as BaseDisplayLarge
} from "baseui/typography";

const Display = (props: {
    overrides?: StyleObject
    size: "small" | "medium" | "large",
    children: React.ReactNode
}) => {
    switch (props.size) {
        case "small":
            return (
                <BaseDisplaySmall overrides={props.overrides && {
                    Block: {
                        style: props.overrides
                    }
                }}>{props.children}</BaseDisplaySmall>
            );
        case "medium":
            return (
                <BaseDisplayMedium overrides={props.overrides && {
                    Block: {
                        style: props.overrides
                    }
                }}>{props.children}</BaseDisplayMedium>
            );
    }
    return (
        <BaseDisplayLarge overrides={props.overrides && {
            Block: {
                style: props.overrides
            }
        }}>
            {props.children}
        </BaseDisplayLarge>
    );
}
const DisplayLarge = (props: {
    overrides?: StyleObject,
    children: React.ReactNode
}) => <Display size="large" {...props}/>;
const DisplayMedium = (props: {
    overrides?: StyleObject,
    children: React.ReactNode
}) => <Display size="medium" {...props}/>;
const DisplaySmall = (props: {
    overrides?: StyleObject,
    children: React.ReactNode
}) => <Display size="small" {...props}/>;

export {DisplayLarge, DisplayMedium, DisplaySmall};
export default Display;