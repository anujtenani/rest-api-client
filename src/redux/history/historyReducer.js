import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from 'redux';
import {byIdReducer} from "../reducerCreator";


const allIdsReducer = (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.history): {
            return [action.payload.id, ...state] //important add it to the start
        }
        case createActionConstant(methods.delete, types.history):{
            console.log('deleting', action);
            return state.filter((id)=>id !== action.id)
        }
        default:
            return state;
    }
}



export default combineReducers({
    byId: byIdReducer(types.history), allIds: allIdsReducer
})
