import {combineReducers} from 'redux';
import projectReducer from "./projectReducer";
import requestReducer from "./requestReducer";


//this is the complete project project reducer only
export default combineReducers({
    metadata: projectReducer,
    requests: requestReducer,

});
