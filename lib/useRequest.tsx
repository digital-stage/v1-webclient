import * as React from 'react';
import { GroupId, StageId } from './digitalstage/common/model.server';

export interface Request {
  stageId: StageId;
  groupId: GroupId;
  password: string | null;

  setRequest(stageId: StageId, groupId: GroupId, password?: string);
}

const RequestContext = React.createContext<Request>(undefined);

export const useRequest = (): Request => React.useContext<Request>(RequestContext);

export const RequestContextProvider = (props: { children: React.ReactNode }) => {
  const { children } = props;
  const [stageId, setStageId] = React.useState<StageId>();
  const [groupId, setGroupId] = React.useState<StageId>();
  const [password, setPassword] = React.useState<string>();

  return (
    <RequestContext.Provider
      value={{
        stageId,
        groupId,
        password,
        setRequest: (reqStageId, reqGroupId, reqPassword) => {
          setStageId(reqStageId);
          setGroupId(reqGroupId);
          setPassword(reqPassword);
        },
      }}
    >
      {children}
    </RequestContext.Provider>
  );
};
