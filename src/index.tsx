import React from 'react'
import { createRoot } from 'react-dom/client'
import {Provider} from 'react-redux'
import App from './App'
import { HashRouter as Router } from 'react-router-dom'
import store from "./store/store";
import './style/index.scss'

const rootElement = document.getElementById('root')

if (!rootElement) {
    throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <Provider store={store}>
        <Router>
            <App/>
        </Router>
    </Provider>,
);
