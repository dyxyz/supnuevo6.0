import * as types from '../action/types';

const initialState = {
    timer: null,
    scanTime: null,
};

let timer = (state = initialState, action) => {

    switch (action.type) {

        case types.TIMER_SET:
            return Object.assign({}, state, {
                timer: action.timer
            });
        case types.TIMER_CLEAR:
            clearInterval(state.timer);
            return Object.assign({}, state, {
                timer: null
            });
            break;
        case types.SCANTIMER_SET:
            return Object.assign({}, state, {
                scanTime: action.scanTime
            });
        default:
            return state;
    }
}

export default timer;
