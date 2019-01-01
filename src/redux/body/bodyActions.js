import {createActionConstant, methods, types} from "../actionCreator";
import * as shortId from "shortid";


export function actionUpdateBodyItem(requestId, bodyId, change){
    return {
        type: createActionConstant(methods.update, types.body),
        requestId,
        bodyId,
        change
    }
}

export function actionCreateBodyItem(requestId){
    return {
        type: createActionConstant(methods.create, types.body),
        payload : {
            bodyId: shortId.generate(),
        },
        requestId,
    }
}

export function actionDeleteBodyItem(requestId, bodyId){
    return {
        type: createActionConstant(methods.delete, types.body),
        requestId,
        bodyId,
    }
}


export function actionChangeBodyType(requestId, bodyType){
    return {
        type: createActionConstant(methods.update, types.bodyType),
        requestId,
        bodyType
    }
}
