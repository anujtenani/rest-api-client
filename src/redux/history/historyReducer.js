import {createActionConstant, methods, types} from "../actionCreator";
import {combineReducers} from 'redux';

export const dummyHistory = {
    allIds:["qwerty","asdfgh"],
    byId:{
        qwerty:{
            request:{

            },
            response:{

            }
        },
        asdfgh:{
            request:{

            },
            response:{
                headers:{

                },
                timing:{

                },
                body:{

                },
                statusCode:{

                }
            }
        }
    }
}


const allIds =  (state = [], action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.history): {
            const {historyId} = action;
            return [historyId, ...state];
        }
        case createActionConstant(methods.delete, types.headers):{
            const {historyId} = action;
            return state.filter((id)=>id !== historyId)
        }
        default:
             return state;
    }
}

const byId = (state = {}, action)=>{
    switch (action.type) {
        case createActionConstant(methods.create, types.history):{
            const {historyId} = action;
            return {...state, [historyId]: action.payload}
        }
        case createActionConstant(methods.delete, types.history):{
            const {historyId} = action;
            return {...state, [historyId]:undefined}
        }
        default:
            return state
    }
}


export default combineReducers({
    byId, allIds
})
