import {combineReducers} from 'redux';
import {createActionConstant, methods, types} from "../actionCreator";

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.group):
            return {...state, [action.groupId]:action.payload};
        case createActionConstant(methods.delete, types.group):
            return {...state, [action.groupId]:undefined};
        case createActionConstant(methods.update, types.group):
            return {...state, [action.groupId]:{...state[action.groupId],...action.change}}
        default:
            return state;
    }
}
const allIds = (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.group):
            return [action.groupId, ...state]
        case createActionConstant(methods.delete, types.group):
            return state.filter((item)=>item !== action.groupId);
        default:
            return state
    }
}

return combineReducers({
    byId, allIds
})
