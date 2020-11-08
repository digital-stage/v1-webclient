import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Heading } from 'theme-ui';
import { useAuth } from '../lib/digitalstage/useAuth';
import Loading from '../components/new/elements/Loading';
import Login from './account/login';
import StageListView from '../components/new/elements/StageList';
import useStageSelector from '../lib/digitalstage/useStageSelector';
import Container from '../components/Container';

const Stages2 = () => {
  const router = useRouter();
  const { loading, user } = useAuth();
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

  if (!loading) {
    if (!user) {
      return <Login />;
    }
    return (
      <Container>
        <Heading variant="h1">Meine Bühnen</Heading>
        <StageListView />
      </Container>
    );
  }

  return (
    <Loading>
      <Heading variant="h1">Lade ...</Heading>
    </Loading>
  );
};
export default Stages2;
