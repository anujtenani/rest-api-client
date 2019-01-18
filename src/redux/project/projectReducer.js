import {createActionConstant, methods, types} from "../actionCreator";
// import {getProjectName} from "../../helpers/func";

const defaultState = {
    projectName:'',
    maxHistory:5,
   // id:getProjectName(),
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
