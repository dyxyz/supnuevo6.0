/**
 * Created by dingyiming on 2017/7/25.
 */

import * as types from '../action/types';

const initialState = {
    commodityClassList: null,
    weightService: null,
    codigo: null,
    nombre: null,
    oldPrice: null,
    price: null,
    flag: 1,
    suggestPrice: null,
    suggestLevel: null,
    IVAprice1: null,
    IVAprice2: null,
    IVAprice3: null,
    IVAprice4: null,
    doubleORper: null,
    profitprice1: null,
    profitprice2: null,
    profitprice3: null,
    profitprice4: null,
};

let sale = (state = initialState, action) => {//ES6函数默认参数值语法

    switch (action.type) {

        case types.SET_COMMODITY_CLASS_LIST:
            return Object.assign({}, state, {
                commodityClassList: action.commodityClassList,
            });
            break;

        case types.SET_WEIGHT_SERVICE:
            return Object.assign({}, state, {
                weightService: action.weightService,
            });
            break;
        case types.SET_GOODSINFO:
            return Object.assign({}, state, {
                codigo: action.codigo,
                nombre: action.nombre,
                price: action.price,
                oldPrice: action.oldPrice,
                suggestPrice: action.suggestPrice,
                suggestLevel: action.suggestLevel,
                flag: action.flag,
            });
            break;
        case types.SET_JISUAN_PRICE:
            return Object.assign({}, state, {
                IVAprice1: action.AddIva0,
                IVAprice2: action.AddIva1,
                IVAprice3: action.AddIva2,
                IVAprice4: action.AddIva3,
                doubleORper: action.AddMode,
                profitprice1: action.AddProfit0,
                profitprice2: action.AddProfit1,
                profitprice3: action.AddProfit2,
                profitprice4: action.AddProfit3,
            });
            break;
        default:
            return state;
    }
}

export default sale;