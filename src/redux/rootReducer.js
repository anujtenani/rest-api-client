import {combineReducers} from 'redux';
import projectReducer from "./projectReducer";
import requestReducer from "./requestReducer";


export default combineReducers({
    project: projectReducer,
    requests: requestReducer,
});
