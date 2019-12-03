/**
 * Created by danding on 16/11/13.
 */

import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store/index';

//import App from './proxy/NetConnect';
import App from './containers/App';
//import App from './containers/Stock/Stock';

console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

export default class Root extends Component {
    render() {
        return (
            <Provider store = {store} >
                <App />
            </Provider>
        )
    }
}
