import {createActionConstant, methods, types} from "../actionCreator";
const shortId = require('shortid');
export function actionCreateRequestGroup(title){
    return {
        type: createActionConstant(methods.create, types.group),
        payload: {
            title,
            items:[]
        },
        groupId: shortId.generate()
    }
}
export function actionRemoveGroup(groupId){
    return {
        type: createActionConstant(methods.delete, types.group),
        groupId
    }
}

export function actionUpdateGroup(groupId, change){
    return {
        type:createActionConstant(methods.update, types.group),
        groupId,
        change
    }
}
