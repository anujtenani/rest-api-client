import {createActionConstant, methods, types} from "./actionCreator";

const defaultCookies = {

}

const cookiesReducer = (state, action)=>{
    switch (action.type) {
        case createActionConstant(methods.update, types.cookies):{
            return {...state, ...action.payload}
        }
        default:
            return state;
    }
}
