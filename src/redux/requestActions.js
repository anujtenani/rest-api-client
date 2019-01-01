import {combineReducers} from 'redux';
import {createActionConstant, methods, types} from "./actionCreator";
import torequest from "../transformers/torequest";
import {actionCreateResponseHistory, actionDeleteResponseHistory} from "./history/historyActions";
const shortId = require('shortid');
const axios = require('axios');

const defaultState = {
    title:'',
    created:'',
    modified:'',
    url:'',
    method:'GET',
    headers:{
        byId:{},
        allIds:[]
    },
    body:{
        byId:{},
        allIds:[],
        bodyType:'nobody'
    },
    auth:{
        authType:'none'
    },
    history:{
        byId:{},
        allIds:[]
    },
    qs:{
        byId:{},
        allIds:[]
    },
}

export const actionSetRequests = (byId, allIds)=>{
    return {
        type:createActionConstant(methods.set, types.request),
        payload:{
            byId, allIds
        }
    }
}

export const actionCreateRequest = (payload)=>{
    return {
        type: createActionConstant(methods.create, types.request),
        payload:{
            requestId: shortId.generate(),
            ...defaultState,
            ...payload
        }
    }
}


export const actionUpdateRequest = (requestId, change)=>{
    return {
        type: createActionConstant(methods.update, types.request),
        requestId:requestId,
        change
    }
}

export const actionDeleteRequest = (requestId)=>{
    return {
        type: createActionConstant(methods.delete, types.request),
        requestId:requestId
    }
}


let source;
export const actionExecuteRequest = (requestId)=>{
    return async (dispatch, getState)=>{
        if(source){
            source.cancel();
        }
        dispatch(actionUpdateRequest(requestId, {executing:true}));
        const CancelToken = axios.CancelToken;
        source = CancelToken.source();
        axios.post('http://localhost:8090/call',torequest(getState().requests.byId[requestId]),{
            cancelToken: source.token
        }).then(({data})=>{
            const allHistoryIds = getState().requests.byId[requestId].history.allIds;
            if(allHistoryIds.length > 5){
                dispatch(actionDeleteResponseHistory(requestId, allHistoryIds[5]))
            }
            dispatch(actionCreateResponseHistory(requestId, data));
            dispatch(actionUpdateRequest(requestId, {executing:false}));
        }).catch((e)=>{
            console.log(e);
            dispatch(actionUpdateRequest(requestId, {executing:false}));
        });
    }
};

export const actionCancelRequestExecution = (requestId)=>{
    return (dispatch, getState)=>{
        if(source) {
            source.cancel();
        }
        return dispatch(actionUpdateRequest(requestId, {executing:false}))
    }
}
