import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";

export function actionUpdateHeaderItem(requestId, id, change){
    return {
        type:createActionConstant(methods.update, types.headers),
        id,
        requestId,
        change
    }
}
export function actionDeleteHeaderItem(requestId, id){
    return {
        type:createActionConstant(methods.delete, types.headers),
        id,
        requestId,
    }
}

export function actionCreateHeaderItem(requestId){
    return {
        type:createActionConstant(methods.create, types.headers),
        payload:{
            id:shortId.generate(),
            name:'',
            value:'',
        },
        requestId
    }
}
