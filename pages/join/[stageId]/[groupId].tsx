/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { Flex, Heading, jsx } from 'theme-ui';
import useStageJoiner from '../../../lib/useStageJoiner';
import LoadingOverlay from '../../../components/global/LoadingOverlay';

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
    <Flex
      sx={{
        background:
          'transparent linear-gradient(221deg, #F20544 0%, #F00544 2%, #F20544 2%, #F20544 10%, #721542 50%, #012340 100%) 0% 0% no-repeat padding-box',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <LoadingOverlay>
        <Heading>Lade ...</Heading>
      </LoadingOverlay>
    </Flex>
  );
};

export default Join;
