import {createActionConstant, methods} from "./actionCreator";

export const byIdReducer = (type) => (state = {}, action)=>{
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

export const allIdsReducer = (type)=> (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, type): {
            return [...state, action.payload.id]
        }
        case createActionConstant(methods.delete, type):{
            return state.filter((id)=>id !== action.id)
        }
        default:
            return state;
    }
}
