import {actionTypes} from "./envActions";
import {combineReducers} from 'redux';
import {allIdsReducer, byIdReducer} from "../reducerCreator";
import {types} from '../actionCreator';

const defaultState = {
    variableById:{
        "2adasd":{
            name:'VariableName',//without space
            defaultValue:'',
        }
    },
    variableAllIds:[],
    envAllIds:[],
    envById:{
        "envid":{
            title:'Production',
        }
    },
    envVariableMap:{
        "varid":{
            "prodid":"value",
            "env1id":"value"
        }
    }
}

const envVariableMap = (state = {}, action)=>{
    switch (action.type) {
        case actionTypes.updateValueForEnvironment:
            return {...state, [action.variableId]: {...state[action.variableId], [action.envId]: action.value}}
        case  actionTypes.createVariable:
            return {
                ...state, [action.payload.id]:{}
            }
        case actionTypes.deleteEnvironment:
            const {id} = action;
            const newState = {...state};
            const keys = Object.keys(state);
            keys.forEach((varId)=>{
                newState[varId][id] = undefined;
            });
            return newState;
        case actionTypes.deleteVariable:
            return {
                ...state, [action.id]:undefined
            }
        default:
            return state;
    }
}

const activeEnv = (state=null, action)=>{
    switch (action.type) {
        case actionTypes.createEnvironment:
            return state === null ? action.payload.id : state;
        case actionTypes.deleteEnvironment:
            return state === action.id ? null: state;
        case actionTypes.setActiveEnv:
            return action.id;
        default: return state;
    }
}


export default combineReducers({
    variableAllIds: allIdsReducer(types.variable),
    variableById: byIdReducer(types.variable),
    envAllIds: allIdsReducer(types.env),
    envById: byIdReducer(types.env),
    envVariableMap,
    activeEnv
})
