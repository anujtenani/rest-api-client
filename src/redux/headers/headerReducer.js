import {types} from "../actionCreator";
import {combineReducers} from 'redux';
import {allIdsReducer, byIdReducer} from "../reducerCreator";

export default combineReducers({
    byId: byIdReducer(types.headers), allIds: allIdsReducer(types.headers)
})
