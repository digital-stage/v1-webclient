import React, {useState} from "react";
import {Cell, Grid} from "baseui/layout-grid";
import {StyleObject} from "styletron-react";
import {styled, useStyletron} from "baseui";
import {Menu} from "baseui/icon";
import {ANCHOR, Drawer} from "baseui/drawer";
import {ARTWORK_SIZES, ListItem, ListItemLabel} from "baseui/list";

export interface NavItem {
    label: string;
    path?: string;
    icon?: React.ComponentType<any>;
    navExitIcon?: React.ComponentType<any>;
    children?: NavItem[];
    active?: boolean;
}

const Burger = styled("div", ({$theme}) => ({
    cursor: "pointer",
    padding: $theme.sizing.scale100,
    marginRight: $theme.sizing.scale600,
    alignItems: "center",
    display: "flex",
    flexDirection: "row"
}));
const Logo = styled("div", ({$theme}) => ({
    ...$theme.typography.HeadingSmall
}));

const Bar = styled("div", ({$theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingTop: $theme.sizing.scale700,
    paddingBottom: $theme.sizing.scale700
}));
const DesktopMenu = styled("div", ({$theme}) => ({
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
}));
const DesktopMenuItem = styled<{
    $active?: boolean,
    $isFocusVisible?: boolean,
    $kind: "primary" | "secondary"
}, "div">("div", ({$isFocusVisible, $active, $kind, $theme}) => ({
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    color: $active ? $theme.colors.contentPrimary : $theme.colors.contentTertiary,
    marginLeft: $theme.sizing.scale700,
    marginRight: $theme.sizing.scale700,
    paddingTop: $kind === "secondary" ? $theme.sizing.scale750 : '0',
    paddingBottom: $kind === "secondary" ? $theme.sizing.scale750 : '0',
    outline: $isFocusVisible ? `3px solid ${$theme.colors.accent}` : 'none',
    outlineOffset: '-3px',
    borderBottomWidth: '2px',
    borderBottomStyle: 'solid',
    borderBottomColor: $active && !$isFocusVisible ? $theme.colors.primary : 'transparent',
    cursor: $active ? 'default' : 'pointer',
    whiteSpace: $kind === "secondary" ? 'nowrap' : 'initial',
    ':first-child': {
        marginLeft: '0'
    },
    ':last-child': {
        marginRight: '0'
    },
    ':hover': {
        color: $theme.colors.primary,
    },
}));

const AppNav = (
    props: {
        title: React.ReactNode,
        overrides?: StyleObject,
        mainItems?: NavItem[],
        userItems?: NavItem[],
        onMainItemSelect?: (item: NavItem) => any;
        onUserItemSelect?: (item: NavItem) => any;
    }
) => {
    const [css, theme] = useStyletron();
    const [isMobileOpen, setMobileOpen] = useState<boolean>(false);
    const [isUserOpen, setUserOpen] = useState<boolean>(false);

    const activeMainItem = props.mainItems.find(item => item.active);

    return (
        <Grid overrides={{
            Grid: {
                style: {
                    backgroundColor: theme.colors.background,
                    ...props.overrides
                }
            }
        }}>
            <Cell span={12}>
                <Bar>
                    <Burger onClick={() => setMobileOpen(prev => !prev)}>
                        <Menu size={24}/>
                    </Burger>
                    <Logo>
                        {props.title}
                    </Logo>
                    <DesktopMenu>
                        {props.mainItems.map(item => (
                            <DesktopMenuItem
                                $kind="primary"
                                $active={item.active}
                                onClick={() => {
                                    if (!item.children) {
                                        if (props.onMainItemSelect)
                                            props.onMainItemSelect(item)
                                    }
                                }}
                            >
                                {item.label}
                            </DesktopMenuItem>
                        ))}
                    </DesktopMenu>
                    {activeMainItem && activeMainItem.children && activeMainItem.children.length > 0 && (
                        <div>
                            CHILDREN
                        </div>
                    )}
                    <Drawer
                        anchor={ANCHOR.left}
                        isOpen={isMobileOpen}
                        autoFocus
                        renderAll
                        showBackdrop
                        closeable={false}
                        onBackdropClick={() => setMobileOpen(false)}
                        onClose={() => setMobileOpen(false)}
                        overrides={{
                            Root: {
                                style: {
                                    [theme.mediaQuery.large]: {
                                        display: "none"
                                    }
                                }
                            },
                            DrawerBody: {
                                style: {
                                    margin: 0,
                                    backgroundColor: theme.colors.backgroundAlt
                                }
                            }
                        }}
                    >
                        {props.mainItems.map(item => (
                            <div
                                className={css({
                                    cursor: 'pointer'
                                })}
                                onClick={() => {
                                    if (!item.children) {
                                        if (props.onMainItemSelect)
                                            props.onMainItemSelect(item)
                                    }
                                }}>
                                <ListItem
                                    overrides={{
                                        Root: {
                                            style: {
                                                backgroundColor: theme.colors.backgroundAlt,
                                                ":hover": {
                                                    backgroundColor: theme.colors.backgroundOverlayDark
                                                }
                                            }
                                        }
                                    }}
                                    artwork={item.icon}
                                    artworkSize={ARTWORK_SIZES.LARGE}
                                >
                                    <ListItemLabel>
                                        {item.label}
                                    </ListItemLabel>
                                </ListItem>
                            </div>
                        ))}
                    </Drawer>
                </Bar>
            </Cell>


        </Grid>
    )
}

export default AppNav;