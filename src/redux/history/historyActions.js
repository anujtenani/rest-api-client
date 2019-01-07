import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";



export const actionCreateResponseHistory = (requestId, payload) => {
    return (dispatch, getState)=>{
        const maxLength = getState().metadata.maxLength || 5;
        const history = getState().requests.byId[requestId].history;
        if(history.allIds.length > maxLength){
            const toDelete = history.allIds[history.allIds.length-1];
            dispatch(actionDeleteResponseHistory(requestId, toDelete));
        }
        dispatch(createResponseHistory(requestId, payload));
    }
}


function createResponseHistory(requestId, payload){
    return {
        type: createActionConstant(methods.create, types.history),
        requestId,
        payload:{
            ...payload,
            id: shortId.generate()
        }
    }
}
export function actionDeleteResponseHistory(requestId, id){
    return {
        type:createActionConstant(methods.delete, types.history),
        requestId,
        id
    }
}
