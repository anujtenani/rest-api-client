import {combineReducers} from 'redux';
import {types} from "../actionCreator";
import {allIdsReducer, byIdReducer} from "../reducerCreator";




export default combineReducers({
    byId: byIdReducer(types.func), allIds: allIdsReducer(types.func)
})
