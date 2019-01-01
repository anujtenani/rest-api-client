import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from "redux";

const allIds =  (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.queryString): {
            const {qsId} = action.payload;
            return state.concat(qsId)
        }
        case createActionConstant(methods.delete, types.queryString):{
            const {qsId} = action;
            return state.filter((id)=>id !== qsId)
        }
        default:
            return state;
    }
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.queryString):{
            const {qsId} = action.payload;
            return {...state, [qsId]: action.payload}
        }
        case createActionConstant(methods.delete, types.queryString):{
            const {qsId} = action;
            return {...state, [qsId]:undefined}
        }
        case createActionConstant(methods.update, types.queryString):{
            const {qsId} = action;
            return {...state, [qsId]: {...state[qsId], ...action.change}}
        }
        default:
            return state
    }
}


export default combineReducers({
    byId, allIds
})
