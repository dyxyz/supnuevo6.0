import * as types from '../action/types';

const initialState = {
    attachIdList:[],
    pictureUrl:[],
};

let imageattach = (state = initialState, action) => {

    switch (action.type) {

        case types.SET_ATTACH_ID_LIST:
            return Object.assign({}, state, {
                attachIdList: action.attachIdList,
            });
            break;

        case types.SET_PICTURE_URL:
            return Object.assign({}, state, {
                pictureUrl: action.pictureUrl,
            });
            break;
        default:
            return state;
    }
}

export default imageattach;
