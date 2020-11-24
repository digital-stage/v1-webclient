/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx, Flex } from 'theme-ui';
import { useRouter } from 'next/router';
import { DisplayMedium } from 'baseui/typography';
import Loading from '../../../components/new/elements/Loading';
import useStageHandling from '../../../lib/use-digital-stage/useStageHandling';

const Join = (): JSX.Element => {
  const router = useRouter();

  const { requestJoin } = useStageHandling();

  React.useEffect(() => {
    router.prefetch('/');
  }, []);

  React.useEffect(() => {
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
    <Loading>
      <DisplayMedium>Lade...</DisplayMedium>
    </Loading>
  );
};

export default Join;
