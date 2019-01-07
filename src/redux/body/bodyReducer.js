import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from 'redux';
import {allIdsReducer, byIdReducer} from "../reducerCreator";

const allIds =  (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.body):
        case createActionConstant(methods.delete, types.body):
            return allIdsReducer(types.body)(state, action);
        case createActionConstant(methods.update, types.bodyType):{
            return [];
        }
        default:
            return state;
    }
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.body):
        case createActionConstant(methods.delete, types.body):
        case createActionConstant(methods.update, types.body):
            return byIdReducer(types.body)(state, action);
        case createActionConstant(methods.update, types.bodyType):{
            return {};
        }
        default:
            return state
    }
}

const bodyType = (state = 'nobody', action)=>{
    switch (action.type) {
        case createActionConstant(methods.update, types.bodyType):{
            return action.bodyType
        }
        default:
            return state
    }
}

const data = (state = null, action)=>{
    switch (action.type) {
        case createActionConstant(methods.update, types.bodyData):{
            return action.data || null
        }
        case createActionConstant(methods.update, types.bodyType):{
            return null;
        }
        default :
            return state;
    }
}


export default combineReducers({
    byId, allIds, bodyType, data
})
