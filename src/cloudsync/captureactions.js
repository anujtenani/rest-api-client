
const actionLogs = [];


const logger = store => next => action => {
    console.log('dispatching', action);
    let result = next(action);
//    action.timestamp = new Date().getTime();
    action.timestamp = new Date().getTime();
    actionLogs.push(action);
    console.log('next state', store.getState());
    console.log(actionLogs);
    /*
    fetch('http://localhost:8090/apply_action',{
        method:'POST',
        body:JSON.stringify(action),
        headers:{
            'content-type':'application/json'
        }
    }).then((e)=>{
        console.log('got result', e);
    })
    */
    return result
};


// loop http requests for actionlogs every 30 seconds to save the data in the cloud



export default logger;
