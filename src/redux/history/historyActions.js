import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";



export const actionCreateResponseHistory = (requestId, payload) => {
    return (dispatch, getState)=>{
        const maxLength = getState().metadata.maxLength || 5;
        const history = getState().requests.byId[requestId].history;
        const activeEnv = getState().env.activeEnv;
        if(history.allIds.length > maxLength){
            //delete xtra histories
            for(let x = history.allIds.length-1; x > maxLength; x--){
                const toDelete = history.allIds[x];
                console.log('deleting history', activeEnv);
                dispatch(actionDeleteResponseHistory(requestId, toDelete, activeEnv));
            }
        }
        dispatch(createResponseHistory(requestId, payload, activeEnv));
    }
}


function createResponseHistory(requestId, payload, activeEnv){
    return {
        type: createActionConstant(methods.create, types.history),
        requestId,
        payload:{
            ...payload,
            id: shortId.generate()
        },
        envId: activeEnv
    }
}

export function actionDeleteResponseHistory(requestId, id, activeEnv){
    return {
        type:createActionConstant(methods.delete, types.history),
        requestId,
        id,
        envId: activeEnv
    }
}
