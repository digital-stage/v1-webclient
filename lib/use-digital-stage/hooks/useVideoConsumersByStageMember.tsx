import { shallowEqual, useSelector } from 'react-redux';
import { LocalConsumer, RootReducer } from '../types';

const useVideoConsumersByStageMember = (stageMemberId: string): LocalConsumer[] =>
  useSelector<RootReducer, LocalConsumer[]>(
    (state) =>
      state.videoConsumers.byStageMember[stageMemberId]
        ? state.videoConsumers.byStageMember[stageMemberId].map(
            (id) => state.videoConsumers.byId[id]
          )
        : [],
    shallowEqual
  );
export default useVideoConsumersByStageMember;
