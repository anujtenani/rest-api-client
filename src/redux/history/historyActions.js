import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";


export function actionCreateResponseHistory(requestId, payload){
    return {
        type: createActionConstant(methods.create, types.history),
        requestId,
        historyId: shortId.generate(),
        payload
    }
}
export function actionDeleteResponseHistory(requestId, historyId){
    return {
        type:createActionConstant(methods.delete, types.history),
        requestId,
        historyId
    }
}
