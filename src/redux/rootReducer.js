import {combineReducers} from 'redux';
import projectReducer from "./project/projectReducer";
import requestReducer from "./requestReducer";
import envReducer from "./env/envReducer";
import functionsReducer from "./functions/functionsReducer";
import groupReducer from './group/groupReducer';

//this is the complete project project reducer only
export default combineReducers({
    metadata: projectReducer,
    requests: requestReducer,
    env: envReducer,
    func: functionsReducer,
    groups: groupReducer,
});
