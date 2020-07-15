import React from 'react'
import ReactDom from 'react-dom'
import {Provider} from 'react-redux'
import App from './App'
import { HashRouter as Router } from 'react-router-dom'
import store from "./store/store";
import './style/index.scss'

ReactDom.render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>,
    document.getElementById('root'),
);
