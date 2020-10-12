import {NormalizedState} from "./useStageContext/schema";
import {useStageState} from "./useStageContext";

const useStageSelector = (callback: (state: NormalizedState) => any) => {
    const state = useStageState();

    const getValue = (callback) => {
        return callback(state);
    }
    return getValue(callback);
}
export default useStageSelector;