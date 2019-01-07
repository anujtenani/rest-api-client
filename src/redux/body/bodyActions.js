import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";


export function actionUpdateBodyItem(requestId, id, change){
    return {
        type: createActionConstant(methods.update, types.body),
        requestId,
        id,
        change
    }
}

export function actionCreateBodyItem(requestId){
    return {
        type: createActionConstant(methods.create, types.body),
        payload : {
            id: shortId.generate(),
        },
        requestId,
    }
}

export function actionDeleteBodyItem(requestId, id){
    return {
        type: createActionConstant(methods.delete, types.body),
        requestId,
        id,
    }
}


export function actionChangeBodyType(requestId, bodyType, data){
    return {
        type: createActionConstant(methods.update, types.bodyType),
        requestId,
        bodyType,
        data
    }
}


export function actionUpdateBodyData(requestId, data){
    return {
        type: createActionConstant(methods.update, types.bodyData),
        requestId,
        data
    }
}
