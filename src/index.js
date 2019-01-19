import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import { PersistGate } from 'redux-persist/integration/react'
import {persistStore} from "redux-persist";
import store from './redux/store'
let persistor = persistStore(store);

/**
 * Remove console statements from production
 */
function noop() {}
if (process.env.NODE_ENV !== 'development') {
    console.log = noop;
    console.warn = noop;
    console.error = noop;
}

ReactDOM.render(<Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
            <App />
    </PersistGate>
</Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
 serviceWorker.unregister();
//serviceWorker.register();
