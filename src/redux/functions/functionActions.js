import {createActionConstant, methods, types} from "../actionCreator";
import shortId from 'shortid';


export const actionCreateFunction = (payload)=>{
    return {
        type: createActionConstant(methods.create, types.func),
        id: shortId.generate(),
        payload
    }
};

export const actionUpdateFunction = (id, change)=>{
    return {
        type: createActionConstant(methods.update, types.func),
        id, change
    }
};

export const actionDeleteFunction = (id)=>{
    return {
        type: createActionConstant(methods.delete, types.func),
        id
    }
};
