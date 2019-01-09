import {createActionConstant, methods} from "./actionCreator";

export const byIdReducer = (type, defaultState={}) => (state = defaultState, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, type):{
            const {id} = action.payload;
            return {...state, [id]: action.payload}
        }
        case createActionConstant(methods.delete, type):{
            const {id} = action;
            return {...state, [id]:undefined}
        }
        case createActionConstant(methods.update, type):{
            const {id} = action
            return {...state, [id]: {...state[id], ...action.change}}
        }
        default:
            return state
    }
}

export const allIdsReducer = (type, defaultState=[])=> (state = defaultState, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, type): {
            return [action.payload.id, ...state]
        }
        case createActionConstant(methods.delete, type):{
            return state.filter((id)=>id !== action.id)
        }
        default:
            return state;
    }
}
