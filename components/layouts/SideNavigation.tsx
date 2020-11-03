import React, { useRef } from 'react';
import { styled } from 'baseui';
import Sidebar, { NavItem } from '../../uikit/Sidebar';
import Button from '../../uikit/Button';
import Icon from '../../uikit/Icon';
import useHover from '../../lib/useHover';

const Caption = styled('div', ({ $theme }) => ({
  position: 'absolute',
  top: '25%',
  left: '90%',
  width: '200px',
  height: '50%',
  backgroundColor: $theme.colors.accent,
}));

const NavIcon = (props: {
  iconName: string,
  label: string
}) => {
  const { iconName, label } = props;
  const ref = useRef();
  const hover = useHover<HTMLButtonElement>(ref);
  return (
    <Button
      style={{
        position: 'relative',
      }}
      ref={ref}
      kind="minimal"
    >
      <Icon name={iconName} />
      <Caption>{label}</Caption>
      {hover && <Caption>{label}</Caption>}
    </Button>
  );
};

const SideNavigation = () => {
  const upperItems: NavItem[] = [{
    label: '',
    icon: <NavIcon label="Stage" iconName="stage" />,
  }];
  return (
    <Sidebar
      upperItems={upperItems}
    />
  );
};
export default SideNavigation;
