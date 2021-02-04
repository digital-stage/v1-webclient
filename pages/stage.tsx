import React from 'react';
import { useRouter } from 'next/router';
import { useSelector, Stage } from '../lib/use-digital-stage';
import {useAuth} from "../lib/useAuth";
import LoadingOverlay from "../components/global/LoadingOverlay";
import StageViewComp from "../components/stage/StageView";

const StageView = (): JSX.Element => {
  const router = useRouter();
  const { loading, user } = useAuth();
  const ready = useSelector<boolean>((state) => state.global.ready);
  const stage = useSelector<Stage>(state => state.global.stageId && state.stages.byId[state.global.stageId]);

  if( !loading && !user ) {
    router.replace("/account/login");
  }

  if( ready && !stage ) {
    router.replace("/stages");
  }

  if( stage ) {
    return <div>
      <StageViewComp/>
    </div>;
  }

  return <LoadingOverlay>Lade Bühne...</LoadingOverlay>
};
export default StageView;
