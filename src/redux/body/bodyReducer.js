import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from 'redux';

const allIds =  (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.body): {
            const {bodyId} = action.payload;
            return state.concat(bodyId)
        }
        case createActionConstant(methods.delete, types.body):{
            const { bodyId } = action;
            return state.filter((id)=>id !== bodyId)
        }
        case createActionConstant(methods.update, types.bodyType):{
            const {bodyType} = action;
            return [];
        }
        default:
            return state;
    }
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.body):{
            const {bodyId} = action.payload;
            return {...state, [bodyId]: action.payload}
        }
        case createActionConstant(methods.delete, types.body):{
            const {bodyId} = action;
            return {...state, [bodyId]:undefined}
        }
        case createActionConstant(methods.update, types.body):{
            const {bodyId} = action;
            return {...state, [bodyId]: {...state[bodyId], ...action.change}}
        }
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
        default :
            return state;
    }
}


export default combineReducers({
    byId, allIds, bodyType, data
})
