import {createActionConstant, methods, types} from "./actionCreator";

const defaultState = {
    projectTitle:'',
    maxHistory:5,
    projectId:undefined,
    comment:'',
}


export default (state = defaultState, action)=>{
    switch (action.type) {
        case createActionConstant(methods.update, types.metadata):{
            return {...state, ...action.change}
        }
        default:
            return state;
    }
};
