import {createActionConstant, methods, types} from "./actionCreator";
import * as shortId from "shortid";

export function actionUpdateAuth(requestId, change){
    return {
        type: createActionConstant(methods.update, types.auth),
        requestId,
        change
    }
}


export function actionSetAuth(requestId, authType){
    return {
        type: createActionConstant(methods.set, types.auth),
        requestId,
        payload:{
            authType
        }
    }
}


