import * as React from 'react';

export interface TStageHandlingContext {
  stageId?: string;
  groupId?: string;
  password?: string;

  requestJoin(stageId: string, groupId: string, password?: string): void;
  requestLeave(): void;
}

const StageHandlingContext = React.createContext<TStageHandlingContext>({
  requestJoin: () => {
    throw new Error('Not ready');
  },
  requestLeave: () => {
    throw new Error('Not ready');
  },
});

const useStageHandling = (): TStageHandlingContext =>
  React.useContext<TStageHandlingContext>(StageHandlingContext);

export const StageHandlingProvider = (props: { children: React.ReactNode }): JSX.Element => {
  const { children } = props;
  const [stageId, setStageId] = React.useState<string>();
  const [groupId, setGroupId] = React.useState<string>();
  const [password, setPassword] = React.useState<string>();

  return (
    <StageHandlingContext.Provider
      value={{
        stageId,
        groupId,
        password,
        requestJoin: (reqStageId: string, reqGroupId: string, reqPassword?: string) => {
          setStageId(reqStageId);
          setGroupId(reqGroupId);
          setPassword(reqPassword);
        },
        requestLeave: () => {
          setStageId(undefined);
          setGroupId(undefined);
          setPassword(undefined);
        },
      }}
    >
      {children}
    </StageHandlingContext.Provider>
  );
};
export default useStageHandling;
