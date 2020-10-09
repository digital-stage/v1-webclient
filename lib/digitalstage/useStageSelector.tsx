import {NormalizedState} from "./useStages/schema";
import {useStageContext} from "./useStages";

const useStageSelector = (callback: (state: NormalizedState) => any) => {
    const {state} = useStageContext();

    const getValue = (callback) => {
        return callback(state);
    }
    return getValue(callback);
}
export default useStageSelector;