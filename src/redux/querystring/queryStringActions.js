import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";

export function actionUpdateQueryStringItem(requestId, qsId, change){
    return {
        type:createActionConstant(methods.update, types.queryString),
            qsId,
            requestId,
            change
    }
}
export function actionDeleteQueryStringItem(requestId, qsId){
    console.log('delete query string called');
    return {
        type:createActionConstant(methods.delete, types.queryString),
        qsId,
        requestId,
    }
}

export function actionCreateQueryStringItem(requestId){
    return {
        type:createActionConstant(methods.create, types.queryString),
        payload:{
            qsId:shortId.generate(),
            name:'',
            value:'',
        },
        requestId
    }
}
