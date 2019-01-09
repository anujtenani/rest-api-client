import {createActionConstant, methods, types} from "../actionCreator";

export const actionSetAuth = (requestId, authType)=>{
    return {
        type: createActionConstant(methods.set,  types.auth),
        requestId,
        payload: {
            authType
        }
    }
}


export const actionUpdateAuth = (requestId, change)=>{
    return {
        type: createActionConstant(methods.update, types.auth),
        requestId,
        change
    }
}
