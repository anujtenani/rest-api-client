import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import { persistReducer } from 'redux-persist'
// import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import storage from '../servicehandlers/ReduxPersistStorage';

import rootReducer from './rootReducer'

function getProjectName(){
    return document.location.pathname.split("/")[2];
}

const persistConfig = {
    key: getProjectName() || 'root',
    storage,
}
const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const persistedReducer = persistReducer(persistConfig, rootReducer);
const store =  createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);
store.subscribe(()=>{
    //here you save the state to the localstorage;
    //cloud storage is setup as redux middleware
//    const projectId = store.getState().metadata.projectId;
//    localstorage.setItem(projectId+"-meta", store.getState().metadata);
//    localstorage.setItem(projectId+"-requests", store.getState().requests);
});

export default store;
