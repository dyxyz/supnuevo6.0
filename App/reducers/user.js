import * as types from '../action/types';

const initialState = {
    supnuevoMerchantId: null,
    merchantType: null,
    merchantStates: null,
    validate: false,
    auth: false,
    info: null,
    announcement: null,
    sessionId: null,
    password: null,
    unionId: null,
    unionMemberType:null,
    shopName:null,
    root:false,
    unionNum:null
};

let user = (state = initialState, action) => {

    switch (action.type) {

        case types.AUTH_ACCESS__ACK:
            return Object.assign({}, state, {
                validate: action.validate,
                auth: action.auth,
                supnuevoMerchantId: action.supnuevoMerchantId,
                merchantType: action.merchantType,
                merchantStates: action.merchantStates,
                username: action.username,
                password: action.password,
                unionId: action.unionId,
                unionMemberType:action.unionMemberType,
                shopName:action.shopName,
                root:action.root,
                unionNum:action.unionNum
            });
            break;

        case types.SET_ANNOUNCEMENT:
            return Object.assign({}, state, {
                announcement: action.announcement,
            });
            break;
        case types.SET_SESSIONID:
            return Object.assign({}, state, {
                sessionId: action.sessionId,
            });
            break;
        case types.SET_UNION_ID:
            return Object.assign({}, state, {
                unionId: action.unionId,
                unionNum:action.unionNum
            });
            break;
        case types.LOGINOUT:
            return Object.assign({}, state, {
                initialState
            });
            break;
        default:
            return state;
    }
}

export default user;
