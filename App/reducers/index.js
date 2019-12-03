/**
 * Created by json on 16/5/25.
 * 根reducer
 */
import { combineReducers } from 'redux';

import user from './user';
import timer from './timer';
import netInfo from './netInfo';
import sale from './sale';
import imageattach from './imageattach';

export default rootReducer = combineReducers({
    user,
    timer,
    netInfo,
    sale,
    imageattach
})

