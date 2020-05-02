import React from 'react'
import ReactDom from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import App from './App'
import Reducers from './reducers'

const store = createStore(Reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDom.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root'),
);
