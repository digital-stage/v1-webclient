import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { styled } from 'styletron-react';
import Icon from '../../../uikit/Icon';
import useStageSelector from '../../../lib/digitalstage/useStageSelector';
import IconButton from '../../base/IconButton';

const Wrapper = styled('div', {
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
});

const StageOrMixerSwitcher = (props: {
  className?: string
}) => {
  const currentStageId = useStageSelector<string>((state) => state.stageId);
  const { pathname } = useRouter();
  const [mixerShown, setMixerShown] = useState<boolean>(false);

  useEffect(() => {
    setMixerShown(pathname === '/mixer');
  }, [pathname]);

  if (currentStageId) {
    return (
      <Wrapper className={props.className}>
        <Link href={mixerShown ? '/' : '/mixer'}>
          <IconButton color="secondary">
            <Icon size={64} name={mixerShown ? 'stage' : 'mixer'} />
          </IconButton>
        </Link>
      </Wrapper>
    );
  }

  return null;
};
export default StageOrMixerSwitcher;
