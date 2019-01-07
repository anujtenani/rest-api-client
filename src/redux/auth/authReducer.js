import {createActionConstant, methods, types} from "../actionCreator";

export default (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.update, types.auth):{
            return {...state, ...action.change}
        }
        case createActionConstant(methods.set, types.auth):{
            return action.payload
        }
        default:
            return null;
    }
}
