/** @jsxRuntime classic */
/** @jsx jsx */
import { useRouter } from 'next/router';
import { Fragment, useEffect } from 'react';
import { Heading, jsx } from 'theme-ui';
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
    <Fragment>
      <Heading>Lade ...</Heading>
    </Fragment>
  );
};

export default Join;
