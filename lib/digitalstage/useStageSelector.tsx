import {NormalizedState} from "./useStageContext/schema";
import {useSelector} from "./useStageContext/redux";
import {shallowEqual} from "react-redux";

function useStageSelector<T>(callback: (state: NormalizedState) => T): T {
    return useSelector<NormalizedState, T>(callback, shallowEqual);
}

export default useStageSelector;