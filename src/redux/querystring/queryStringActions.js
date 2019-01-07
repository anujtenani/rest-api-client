import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";

export function actionUpdateQueryStringItem(requestId, id, change){
    return {
        type:createActionConstant(methods.update, types.queryString),
            id,
            requestId,
            change
    }
}
export function actionDeleteQueryStringItem(requestId, id){
    return {
        type:createActionConstant(methods.delete, types.queryString),
        id,
        requestId,
    }
}

export function actionCreateQueryStringItem(requestId){
    return {
        type:createActionConstant(methods.create, types.queryString),
        payload:{
            id:shortId.generate(),
            name:'',
            value:'',
        },
        requestId
    }
}
