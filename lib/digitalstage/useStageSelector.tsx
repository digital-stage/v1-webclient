import {NormalizedState} from "./useStageContext/schema";
import {useSelector} from "./useStageContext/redux";

function useStageSelector<T>(callback: (state: NormalizedState) => T) {
    return useSelector<NormalizedState, T>(callback);
}

export default useStageSelector;