import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from 'redux';

const defaultState = {
    allIds:[],
    byIds:{
        "iadsdsa1": {
            name: '',
            value: '',
            doc: {
                required: false,
                type: 'string',
                description: '',
                constraints: {
                    minLength: 0,
                    maxLength: 10,
                    enumValues: ['hello', 'what', 'is', 'goin', 'on']
                }
            }
        }
    }
}

const allIds =  (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.headers): {
            const {headerId} = action.payload;
            return state.concat(headerId)
        }
        case createActionConstant(methods.delete, types.headers):{
            const {headerId} = action;
            return state.filter((id)=>id !== headerId)
        }
        default:
             return state;
    }
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.headers):{
            const {headerId} = action.payload
            return {...state, [headerId]: action.payload}
        }
        case createActionConstant(methods.delete, types.headers):{
            const {headerId} = action;
            return {...state, [headerId]:undefined}
        }
        case createActionConstant(methods.update, types.headers):{
            const {headerId} = action
            return {...state, [headerId]: {...state[headerId], ...action.change}}
        }
        default:
            return state
    }
}


export default combineReducers({
    byId, allIds
})
