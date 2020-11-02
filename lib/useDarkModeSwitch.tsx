import React, { useEffect, useState } from 'react';
import { useSelector } from './digitalstage/useStageContext/redux';
import { NormalizedState } from './digitalstage/useStageContext/schema';

const DarkModeContext = React.createContext<boolean>(false);

export const useDarkModeSwitch = () => React.useContext(DarkModeContext);

export const DarkModeConsumer = DarkModeContext.Consumer;

export const DarkModeProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const stageId = useSelector<NormalizedState, string | undefined>(
    (state) => state.stageId,
  );

  useEffect(() => {
    setDarkMode(stageId !== undefined);
  }, [stageId]);

  return (
    <DarkModeContext.Provider value={darkMode}>
      {children}
    </DarkModeContext.Provider>
  );
};
