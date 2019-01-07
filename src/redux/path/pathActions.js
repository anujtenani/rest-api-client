import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";

export function actionUpdateUrlPath(requestId, id, change){
    return {
        type:createActionConstant(methods.update, types.urlpath),
            id,
            requestId,
            change
    }
}
export function actionDeleteUrlPath(requestId, id){
    return {
        type:createActionConstant(methods.delete, types.urlpath),
        id,
        requestId,
    }
}

export function actionCreateUrlPath(requestId){
    return {
        type:createActionConstant(methods.create, types.urlpath),
        payload:{
            id:shortId.generate(),
            name:'',
            value:'',
            comment:'',
        },
        requestId
    }
}
