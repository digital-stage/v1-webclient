import { useStyletron } from 'baseui';
import React from 'react';
import { useSelector } from '../lib/digitalstage/useStageContext/redux';
import { NormalizedState } from '../lib/digitalstage/useStageContext/schema';

const Debug = () => {
  const [css] = useStyletron();
  const state = useSelector<NormalizedState>((state) => state);

  return (
    <div className={css({
      width: '100%',
    })}
    >
      <pre>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  );
};
export default Debug;
