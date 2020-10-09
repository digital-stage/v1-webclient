import {NormalizedState} from "./useStageContext/schema";
import {useStageContext} from "./useStageContext";

const useStageSelector = (callback: (state: NormalizedState) => any) => {
    const {state} = useStageContext();

    const getValue = (callback) => {
        return callback(state);
    }
    return getValue(callback);
}
export default useStageSelector;