const redis = require('redis');
const client = redis.createClient();
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const {createStore} = require('redux');
const rootReducer = require('../src/redux/rootReducer').default;

async function applyActionsToStore(actions, userId, projectId){
    const stateKey = `state-${userId}-${projectId}`;
    const state = await getAsync(stateKey);
    const stateObj = state ? JSON.parse(state) : {};
    const store = createStore(rootReducer, stateObj);
    actions.forEach((action)=>{
        store.dispatch(action);
    });
    const finalState = store.getState();
    setAsync(stateKey, JSON.stringify(finalState));
    return finalState;
}

module.exports = {
    applyActionsToStore
}
