import {syncUrl} from "../config";

const actionLogs = [];

const logger = store => next => action => {
//    console.log('dispatching', action);
    let result = next(action);
//    action.timestamp = new Date().getTime();
    action.timestamp = new Date().getTime();
    //TODO fix this soon
    actionLogs.push(action);
//    console.log('next state', store.getState());
//    console.log(actionLogs);
    /*
    return fetch(syncUrl,{
        method:'POST',
        body:JSON.stringify(action),
        headers:{
            'content-type':'application/json',
            'Authorization':'',
            'X_PROJECT_ID':store.metadata.id
        }
    }).then((e)=>{
        console.log('got result', e);
    });
    */
};


// loop http requests for actionlogs every 30 seconds to save the data in the cloud



export default logger;
