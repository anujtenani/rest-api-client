import {types} from "../actionCreator";
import {combineReducers} from "redux";
import {allIdsReducer, byIdReducer} from "../reducerCreator";

export default combineReducers({
    byId : byIdReducer(types.queryString), allIds: allIdsReducer(types.queryString)
})
