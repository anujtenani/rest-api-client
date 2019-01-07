import {combineReducers} from 'redux';
import {createActionConstant, methods, types} from "./actionCreator";
import headerReducer from "./headers/headerReducer";
import bodyReducer from "./body/bodyReducer";
import historyReducer from "./history/historyReducer";
import queryStringReducer from "./querystring/queryStringReducer";
import authReducer from "./auth/authReducer";
import pathReducer from "./path/pathReducer";


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
            return updatePartOfRequest(state, action, 'auth', authReducer);
        }

        case createActionConstant(methods.create, types.headers):
        case createActionConstant(methods.update, types.headers):
        case createActionConstant(methods.delete, types.headers): {
            return updatePartOfRequest(state, action, 'headers', headerReducer)
        }

        case createActionConstant(methods.create, types.queryString):
        case createActionConstant(methods.update, types.queryString):
        case createActionConstant(methods.delete, types.queryString): {
            return updatePartOfRequest(state, action, 'qs', queryStringReducer)
        }
        case createActionConstant(methods.create, types.urlpath):
        case createActionConstant(methods.update, types.urlpath):
        case createActionConstant(methods.delete, types.urlpath): {
            return updatePartOfRequest(state, action, 'path', pathReducer)
        }
        case createActionConstant(methods.update, types.bodyType):
        case createActionConstant(methods.create, types.body):
        case createActionConstant(methods.update, types.body):
        case createActionConstant(methods.delete, types.body):
        case createActionConstant(methods.update, types.bodyData): {
            return updatePartOfRequest(state, action, 'body', bodyReducer)
        }

        case createActionConstant(methods.create, types.history):
        case createActionConstant(methods.delete, types.history):{
            return updatePartOfRequest(state, action, 'history', historyReducer)
        }
        default:
            return state;
    }
}

const updatePartOfRequest = (state, action, partToUpdate, reducerFunction)=>{
    const {requestId} = action;
    return {
        ...state,
        [requestId]:{...state[requestId], [partToUpdate]: reducerFunction(state[requestId][partToUpdate], action)}
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
