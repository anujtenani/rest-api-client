import {createActionConstant, methods, types} from "../actionCreator";

const shortId = require('shortid');

export  const actionTypes = {
    createVariable:createActionConstant(methods.create, types.variable),
    updateVariable:createActionConstant(methods.update, types.variable),
    deleteVariable:createActionConstant(methods.delete, types.variable),
    createEnvironment:createActionConstant(methods.create, types.env),
    deleteEnvironment:createActionConstant(methods.delete, types.env),
    updateEnvironment:createActionConstant(methods.update, types.env),
    updateValueForEnvironment:'uve',
    setActiveEnv:'sae',
}







export const actionCreateVariable = (name)=>{
    return {
        type:actionTypes.createVariable,
        payload:{
            id: shortId.generate(),
            name
        }
    }
}

export const actionUpdateVariableName = (id, {name})=>{
    return {
        type: actionTypes.updateVariable,
        id,
        change:{
            name
        }
    }
}

export const actionDeleteVariable = (id)=>{
    return {
        type:actionTypes.deleteVariable,
        id
    }
}

export const actionCreateEnvironment = (name)=>{
    return {
        type: actionTypes.createEnvironment,
        payload:{
            id:shortId.generate(),
            name
        }
    }
}


export const actionUpdateEnvironment = (id, {name})=>{
    return {
        type: actionTypes.updateEnvironment,
        id,
        change:{
            name
        }
    }
}

export const actionDeleteEnvironment = (id)=>{
    return {
        type:actionTypes.deleteEnvironment,
        id
    }
}

export const actionSetActiveEnvironment = (id)=>{
    return {
        type: actionTypes.setActiveEnv,
        id
    }
}


export const actionSetVariableValueForEnvironment = (envId, variableId, value)=>{
    return {
        type: actionTypes.updateValueForEnvironment,
        envId, variableId, value
    }
}
