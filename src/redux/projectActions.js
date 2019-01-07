import {createActionConstant, methods, types} from "./actionCreator";

export const actionUpdateProjectMetadata = (change)=>{
    return {
        type: createActionConstant(methods.update, types.metadata),
        change
    }
}
