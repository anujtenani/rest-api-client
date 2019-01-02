import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react'

import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import rootReducer from './redux/rootReducer'

const persistConfig = {
    key: 'root',
    storage,
}
const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;


const persistedReducer = persistReducer(persistConfig, rootReducer);
const store =  createStore(
    persistedReducer,
    composeEnhancers(applyMiddleware(thunk))
);
let persistor = persistStore(store);
persistor.purge();

store.subscribe(()=>{
    //here you save the state to the localstorage;
    //cloud storage is setup as redux middleware
//    const projectId = store.getState().metadata.projectId;
//    localstorage.setItem(projectId+"-meta", store.getState().metadata);
//    localstorage.setItem(projectId+"-requests", store.getState().requests);
});


ReactDOM.render(<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
            <App />
    </PersistGate>
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
