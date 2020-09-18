import {StyledLink} from "baseui/link";
import React from "react";
import Link from "next/link";
import {UrlObject} from "url";

declare type Url = string | UrlObject;
const TextLink = (props: {
    href: Url;
    animateUnderline?: boolean;
    children: React.ReactNode;
}) => {
    return (
        <Link href={props.href}>
            <StyledLink
                $style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    ':hover': {color: 'inherit'},
                    ':visited': {color: 'inherit'},
                }}
                animateUnderline={props.animateUnderline}
            >
                {props.children}
            </StyledLink>
        </Link>
    );
};
export default TextLink;