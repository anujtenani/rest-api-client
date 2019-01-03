import {combineReducers} from 'redux';
import {createActionConstant, methods, types} from "./actionCreator";
import headerReducer from "./headers/headerReducer";
import bodyReducer from "./body/bodyReducer";
import historyReducer from "./history/historyReducer";
import queryStringReducer from "./querystring/queryStringReducer";


const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.set, types.request):{
            return action.payload.byId
        }
        case createActionConstant(methods.create, types.request): {
            const {requestId} = action.payload;
            return {...state, [requestId]: action.payload}
        }
        case createActionConstant(methods.update, types.request): {
            const {requestId} = action;
            return {...state, [requestId]: {...state[requestId], ...action.change}}
        }
        case createActionConstant(methods.delete, types.request): {
            const {requestId} = action;
            return {...state, [requestId]: undefined}
        }
        case createActionConstant(methods.update, types.auth):
        case createActionConstant(methods.set, types.auth): {
            const {requestId} = action;
            return {...state, [requestId]: {...state[requestId], auth: authReducer(state[requestId].auth, action)}}
        }
        case createActionConstant(methods.create, types.headers):
        case createActionConstant(methods.update, types.headers):
        case createActionConstant(methods.delete, types.headers): {
            const {requestId} = action;
            return {
                ...state,
                [requestId]: {...state[requestId], headers: headerReducer(state[requestId].headers, action)}
            }
        }
        case createActionConstant(methods.create, types.queryString):
        case createActionConstant(methods.update, types.queryString):
        case createActionConstant(methods.delete, types.queryString): {
            const {requestId} = action;
            return {
                ...state,
                [requestId]: {...state[requestId], qs: queryStringReducer(state[requestId].qs, action)}
            }
        }
        case createActionConstant(methods.update, types.bodyType):
        case createActionConstant(methods.create, types.body):
        case createActionConstant(methods.update, types.body):
        case createActionConstant(methods.delete, types.body):
        case createActionConstant(methods.update, types.bodyData):
            const {requestId} = action;
            return {
                ...state,
                [requestId]:{...state[requestId], body: bodyReducer(state[requestId].body, action)}
            }
        case createActionConstant(methods.create, types.history):
        case createActionConstant(methods.delete, types.history):{
            const {requestId} = action;
            return {
                ...state,
                [requestId]:{...state[requestId], history: historyReducer(state[requestId].history, action)}
            }
        }
        default:
            return state;
    }
}

const authReducer = (state = {}, action)=>{
        switch (action.type) {
            case createActionConstant(methods.update, types.auth):{
                return {...state, ...action.change}
            }
            case createActionConstant(methods.set, types.auth):{
                return action.payload
            }
            default:
                return null;
        }
}


const allIds = (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.request): {
            const {requestId} = action.payload;
            return state.concat(requestId);
        }
        case createActionConstant(methods.delete, types.request): {
            const {requestId} = action
            return state.filter((itemId) => requestId !== itemId)
        }
        case createActionConstant(methods.set, types.request):{
            return action.payload.allIds
        }
        default:
            return state;
    }
}


export default combineReducers({
    byId, allIds
})
