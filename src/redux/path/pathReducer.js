import {types} from "../actionCreator";
import {combineReducers} from "redux";
import {allIdsReducer, byIdReducer} from "../reducerCreator";

export default combineReducers({
    byId : byIdReducer(types.urlpath), allIds: allIdsReducer(types.urlpath)
})
