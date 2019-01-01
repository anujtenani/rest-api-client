import {createActionConstant, methods, types} from "./actionCreator";

const defaultState = {
    projectTitle:'',
    allRequestsIds:[],
    maxHistory:5
}


export default (state = defaultState, action)=>{
    switch (action.type) {
        default:
            return state;
    }
}
