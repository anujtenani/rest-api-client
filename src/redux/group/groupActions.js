import {createActionConstant, methods, types} from "../actionCreator";
const shortId = require('shortid');
export function actionCreateRequestGroup(title){
    return {
        type: createActionConstant(methods.create, types.group),
        payload: {
            title,
            items:[],
            comment:'',
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

export function actionAddToGroup(groupId, requestId, index){
    return (dispatch, getState)=>{
        const items = getState().groups.byId[groupId].items;
        const newItems = items.slice();
        newItems.splice(index, 0, requestId);
        dispatch(actionUpdateGroup(groupId, {items: newItems}));
    }
}

export function actionRemoveFromGroup(groupId, requestId){
    return (dispatch, getState)=>{
        const items =  getState().groups.byId[groupId].items;
        const newItems = items.filter((reqId)=>{
            return reqId !== requestId;
        });
        dispatch(actionUpdateGroup(groupId, {items: newItems}));
    }

}

export function actionUpdateGroup(groupId, change){
    return {
        type:createActionConstant(methods.update, types.group),
        groupId,
        change
    }
}
