import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";

export function actionUpdateHeaderItem(requestId, headerId, change){
    return {
        type:createActionConstant(methods.update, types.headers),
            headerId,
            requestId,
            change
    }
}
export function actionDeleteHeaderItem(requestId, headerId){
    return {
        type:createActionConstant(methods.delete, types.headers),
        headerId,
        requestId,
    }
}

export function actionCreateHeaderItem(requestId){
    return {
        type:createActionConstant(methods.create, types.headers),
        payload:{
            headerId:shortId.generate(),
            name:'',
            value:'',
        },
        requestId
    }
}
