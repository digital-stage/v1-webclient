/** @jsxRuntime classic */
/** @jsx jsx */
import * as React from 'react';
import { jsx } from 'theme-ui';
import { useRouter } from 'next/router';
import { DisplayMedium } from 'baseui/typography';
import Loading from '../../../components/new/elements/Loading';
import useStageJoiner from '../../../lib/useStageJoiner';

const Join = (): JSX.Element => {
  const router = useRouter();

  const { requestJoin } = useStageJoiner();

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
