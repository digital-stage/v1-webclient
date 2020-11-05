import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Typography } from '@material-ui/core';
import { styled } from 'baseui';
import { useAuth } from '../lib/digitalstage/useAuth';
import Loading from '../components/new/elements/Loading';
import Login from './account/login';
import VerticalSlider from '../components/base/VerticalSlider';
import PanControler from '../components/base/PanControl';
import SwitchButton from '../components/base/SwitchButton';
import useStageSelector from '../lib/digitalstage/useStageSelector';

const mixers = ['Guitar', 'Strings', 'Bass', 'Cello'];

const FlexContainer = styled('div', {
  display: 'flex',
  paddingLeft: '15px',
  paddingRight: '15px',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginTop: '15px',
  flexDirection: 'row',
  justifyContent: 'space-around',
});

const MixerTest = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const stageId = useStageSelector<string | undefined>((state) => state.stageId);
  const [initialized, setInitialized] = useState<boolean>();

  const [value, setValue] = React.useState<number>(5);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, newValue: number | number[]) => {
    setValue(value as number);
  };

  useEffect(() => {
    if (initialized) {
      if (stageId) {
        router.push('/');
      }
    }
  }, [stageId]);

  useEffect(() => {
    if (router.pathname === '/mixer') {
      setInitialized(true);
    }
  }, [router.pathname]);

  if (!loading) {
    if (!user) {
      return <Login />;
    }
    return (
      <>
        <FlexContainer>
          <PanControler />
          <PanControler />
          <PanControler />
          <PanControler />
        </FlexContainer>
        <FlexContainer>
          <SwitchButton color="primary" />
          <SwitchButton color="primary" />
          <SwitchButton color="primary" />
          <SwitchButton color="primary" />
        </FlexContainer>
        <FlexContainer>
          {' '}
          {mixers.map((mixer) => (
            <div>
              <VerticalSlider
                text={mixer}
                defaultValue={value}
                max={10}
                min={0}
                step={1}
                handleChange={handleChange}
              />
            </div>
          ))}
        </FlexContainer>
      </>
    );
  }

  return (
    <Loading>
      <Typography variant="h1">Lade...</Typography>
    </Loading>
  );
};
export default MixerTest;
