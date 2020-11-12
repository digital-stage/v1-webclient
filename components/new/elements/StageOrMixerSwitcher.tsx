import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IconButton } from 'theme-ui'
import Link from 'next/link';
import { styled } from 'styletron-react';
import { CgScreen } from "react-icons/cg";
import { RiSoundModuleLine } from "react-icons/ri";
import useStageSelector from '../../../lib/digitalstage/useStageSelector';

const Wrapper = styled('div', {
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
});

const StageOrMixerSwitcher = (props: { className?: string }) => {
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
          <IconButton>
            {mixerShown ? <CgScreen/> : <RiSoundModuleLine/>}
          </IconButton>
        </Link>
      </Wrapper>
    );
  }

  return null;
};
export default StageOrMixerSwitcher;
