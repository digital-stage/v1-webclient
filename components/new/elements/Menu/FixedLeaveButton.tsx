import { styled } from 'baseui';
import Link from 'next/link';
import React from 'react';
import Button from '../../../../uikit/Button';
import Icon from '../../../../uikit/Icon';
import useStageSelector from '../../../../lib/digitalstage/useStageSelector';

const Wrapper = styled('div', ({ $theme }) => ({
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
  color: $theme.colors.negative,
  currentColor: $theme.colors.negative,
}));

const RedIcon = styled(Icon, ({ $theme }) => ({
  color: $theme.colors.negative,
}));

const FixedLeaveButton = () => {
  const stageId = useStageSelector<string>((state) => state.stageId);

  if (stageId) {
    return (
      <Wrapper>
        <Link href="/leave">
          <Button
            kind="minimal"
            shape="circle"
            size="large"
          >
            <RedIcon name="leave" />
          </Button>
        </Link>
      </Wrapper>
    );
  }
  return null;
};
export default FixedLeaveButton;
