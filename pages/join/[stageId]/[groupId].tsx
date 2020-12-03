/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Flex, Heading, jsx } from 'theme-ui';
import Layout from '../../../components/Layout';
import useStageJoiner from '../../../lib/useStageJoiner';

const Join = (): JSX.Element => {
  const router = useRouter();

  const { requestJoin } = useStageJoiner();

  useEffect(() => {
    router.prefetch('/');
  }, []);

  useEffect(() => {
    if (router.query) {
      const { stageId, groupId, password } = router.query;
      if (stageId && groupId && !Array.isArray(stageId) && !Array.isArray(groupId)) {
        if (password && !Array.isArray(password)) {
          requestJoin(stageId, groupId, password);
        } else {
          requestJoin(stageId, groupId);
        }
        router.push('/');
      }
    }
  }, [router.query]);

  return (
    <Layout>
      <Flex sx={{ width: '100%', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <Heading>Lade ...</Heading>
      </Flex>
    </Layout>
  );
};

export default Join;
