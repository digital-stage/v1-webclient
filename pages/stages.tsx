import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/digitalstage/useAuth';
import Login from './account/login';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import StageDetails from '../components/stage/StageDetails';

const Stages = () => {
  const router = useRouter();
  const { user } = useAuth();
  const stageId = useStageSelector<string | undefined>(state => state.stageId);
  const [initialized, setInitialized] = useState<boolean>();

  useEffect(() => {
    if (initialized) {
      if (stageId) {
        router.push('/');
      }
    }
  }, [stageId]);

  useEffect(() => {
    if (router.pathname === '/stages') {
      setInitialized(true);
    }
  }, [router.pathname]);

  if (!user) {
    return <Login />;
  }
  return <StageDetails />;
};

export default Stages;
