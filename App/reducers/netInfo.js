/**
 * Created by dingyiming on 2017/4/10.
 */

import * as types from '../action/types';

const initialState = {
    connectionInfoHistory: [],
    isConnected:true,
};

let netInfo = (state = initialState, action) => {

    switch (action.type) {

        case types.SET_NETINFO:
            return Object.assign({}, state, {
                connectionInfoHistory:action.connectionInfoHistory,
            });
            break;
        case types.IS_CONNECTED:
            return Object.assign({}, state, {
                isConnected:action.isConnected,
            });
            break;
        default:
            return state;
    }
}

export default netInfo;
