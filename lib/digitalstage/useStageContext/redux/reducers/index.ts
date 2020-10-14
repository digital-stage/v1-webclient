import {CombinedState, combineReducers, Reducer} from 'redux';
import {ReducerAction, stage} from "./stage";
import {NormalizedState} from "../../schema";

const rootReducer = combineReducers({
    stage
});

export default rootReducer;
