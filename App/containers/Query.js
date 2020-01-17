/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Keyboard,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    Platform,
    Animated,
    Vibration,
    Easing,
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import Modalbox from 'react-native-modalbox';
import {setSpText} from '../utils/ScreenUtil'
import Config from '../../config';
import CodesModal from '../components/modal/CodesModal';
import VentasInfoModal from '../components/modal/VentasInfoModal'
import Group from './Group';
import GroupQuery from './AddCommodityToGroup/GroupQuery';
import priceDeviation from './PriceSurvey/PriceDeviation';
import GoodUpdate from './GoodUpdate';
import GoodAdd from './GoodAdd';
import GroupManage from './GroupManage/index';
import {changeAuth, setGoodsInfo, setScanTimerAction,loginAction} from "../action/actionCreator";
import PriceSurvey from './PriceSurvey/PriceSurvey';
import RNCamera from 'react-native-camera';
import Camera from 'react-native-camera';
import ReferencePrice from './ReferencePrice';
import sale from './Sale/Sale';
import CaluConfig from '../components/modal/CaluConfig';
import WaitTip from "../components/modal/WaitTip";
import CookieManager from 'react-native-cookies';
import CompanyInfo from './Stock/CompanyInfo';
import _ from 'lodash'
import ViewFinder from '../utils/Viewfinder'
import VentasDetail from "./Stock/VentasDetail";
import Stock from './Stock/Stock'

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
var Popover = require('react-native-popover');
const BLACK_COLOR = '#000'

//字体不随系统字体变化
Text.render = _.wrap(Text.render, function (func, ...args) {
    let originText = func.apply(this, args)
    return React.cloneElement(originText, {allowFontScaling: false})
})

class Query extends Component {



    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val, goods: {}, selectedCodeInfo: {}, priceShow: null, hasCodigo: false});
    }

    showPopover(ref) {
        this.refs[ref].measure((ox, oy, width, height, px, py) => {
            this.setState({
                menuVisible: true,
                buttonRect: {x: px + 20, y: py + 40, width: 200, height: height}
            });
        });
    }

    startCamera(){
        if(Platform.OS === 'ios') {
            if(Camera){
                Camera.checkDeviceAuthorizationStatus()
                    .then(access => {
                        if(!access) {
                            Alert.alert('相机权限没打开', '请在iPhone的设置中,允许访问您的摄像头')
                            this.setState({cameraModalVisible:false})
                        }
                        else this.setState({cameraModalVisible:true});
                    });
            }
        }
    }

    closePopover() {
        this.setState({menuVisible: false});
    }

    setHasCodigo() {
        this.setState({hasCodigo: false});
    }

    reset() {
        var printType = {type1: '1', type2: '0', type3: '0', type4: '0'};
        this.setState({
            hasCodigo: false,
            selectedCodeInfo: {},
            priceShow: null,
            printType: printType,
            commodityId: null,
            referencePrice: null,
            gengxingaijiaInput: "",
            referencePriceButton:true,
        });
    }

    cleanWaitTip() {
        this.setState({referencePriceButton: true});
        this.refs.waitTip.close()
    }

    getReferencePrice() {
        let codigo = this.state.selectedCodeInfo.codigo;
        if (codigo === null || codigo === undefined) {
            return;
        }
        let commodityId = this.state.selectedCodeInfo.commodityId;
        if (commodityId === null || commodityId === undefined) {
            return;
        }
        //this.refs.waitTip.open();
        //this.setState({referencePriceButton: true});
        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;
        //第一次访问ventas服务器，把sessionId置为空，不发送sessionId，只发送mothersessionId
        // CookieManager.clearAll().then(function (res) {
        //     console.log('CookieManager.clearAll =>', res);
        // });
        proxy.postes_ventas({
            url: Config.server2 + "/func/auth/loginAfterOtherServerAuthed",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                loginName: username,
                password: password,
                motherServerSessionId: sessionId,
            }
        }).then((json) => {
            if(json.re==1) {
                proxy.postes_ventas({
                    url: Config.server2 + '/func/ventas/getReferencePriceByCodigoFromSupnuevo',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        codigo: codigo
                    }
                }).then((json) => {
                    if (json.re == 1){
                        var json = json.data;
                    var errorMsg = json.message;
                    if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                        //this.cleanWaitTip()
                        this.setState({referencePriceButton: true});
                    } else {
                        if (json.ReferencePrice == null || json.ReferencePrice == 0.0) {
                            //this.cleanWaitTip();
                            this.setState({referencePriceButton: true});
                        } else if (json.ReferencePrice !== null && json.ReferencePrice !== undefined) {

                            //this.refs.waitTip.close();
                            var referencePrice = json.ReferencePrice;

                            this.setState({referencePrice: referencePrice, referencePriceButton: false})

                        }
                    }
                }
                }).catch((err) => {
                    alert(err);
                })
            }else if(json.re==-1){
               // this.refs.waitTip.close();
            }
        }).catch((err) => {
            alert(err);
        });
    }

    onCodigoSelect(code) {
        // this.refs.waitTip.open();
        const merchantId = this.props.merchantId;
        var codigo = code.codigo;

        // var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/commodity/getSupnuevoBuyerPriceFormByCodigoMobile",
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                // 'Cookie': sessionId,
            },
            //body: "codigo=" + codigo + "&supnuevoMerchantId=" + merchantId
            body: {
                codigo: codigo,
                supnuevoMerchantId: merchantId
            }
        }).then((json) => {

            if(json.re == -2){
                this.props.dispatch(loginAction(username, password))
            }

            if (json.errMessage !== null && json.errMessage !== undefined) {
                var errMsg = json.errMessage.toString();
                Alert.alert(
                    '错误',
                    errMsg,
                    [
                        {
                            text: 'OK', onPress: () => {
                            this.refs.waitTip.close()
                        }
                        },
                    ]
                );
                return ;
            }
            else {
                var goodInfo = json.object;

                if (goodInfo.setSizeValue != undefined && goodInfo.setSizeValue != null
                    && goodInfo.sizeUnit != undefined && goodInfo.sizeUnit != null) {
                    goodInfo.goodName = goodInfo.nombre + ',' +
                        goodInfo.setSizeValue + ',' + goodInfo.sizeUnit;
                }
                else {
                    goodInfo.goodName = goodInfo.nombre;
                }

                var printType = goodInfo.printType;
                for (var i = 0; i < printType.length; i++) {
                    var j = i + 1;
                    var type = "type" + j;
                    this.state.printType[type] = printType.charAt(i);
                    if (i === 0 && printType.charAt(i) !== 1) {
                        this.state.printType[type] = 1;
                    }

                }
                var newPrintType = this.state.printType;
                goodInfo.printType = newPrintType.type1 + newPrintType.type2 + newPrintType.type3 + newPrintType.type4;

                this.state.goods.codeNum = 0;
                var goods = this.state.goods;

                if (goodInfo.priceShow == 0) {
                    goodInfo.priceShow = "";
                }
                var referencePrice = goodInfo.minPrice;
                if(referencePrice==null || referencePrice==0.0)
                    this.setState({referencePriceButton: true});
                else if (referencePrice !== null && referencePrice !== undefined) {
                    this.setState({referencePrice: referencePrice, referencePriceButton: false})

                }

                this.setState({
                    selectedCodeInfo: goodInfo, codigo: codigo, priceShow: goodInfo.priceShow,
                    inputPrice: goodInfo.priceShow, printType: newPrintType, goods: goods, hasCodigo: true,
                    Gsuggestlevel: goodInfo.suggestLevel,gengxingaijiaInput:goodInfo.priceShow,commodityId:goodInfo.commodityId,
                    attachDataUrl1:goodInfo.attachDataUrl1,attachDataUrl2:goodInfo.attachDataUrl2,attachDataUrl3:goodInfo.attachDataUrl3,attachDataUrl4:goodInfo.attachDataUrl4,
                    attachDataUrl:goodInfo.attachDataUrl
                });

                //this.getReferencePrice();

            }
        }).then(() => {
            this.refs.waitTip.close();
        }).then(()=>{
            this.refs.gengxingaijia.focus();
        }).catch((err) => {
            //this.refs.waitTip.close();
            this.setState({codesModalVisible: false});

            setTimeout(() => {
                Alert.alert(
                    '错误',
                    err,
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        },
                    ]
                );
            }, 900)

        });
    }

    queryGoodsCode(codeNum) {
        const {merchantId} = this.props;
        proxy.postes({
            url: Config.server + '/func/commodity/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            body: {
                codigo: codeNum,
                merchantId: merchantId
            }
        }).then((json) => {

            if(json.re == -2){
                this.props.dispatch(loginAction(username, password))
            }

            var errorMsg = json.message;
            this.reset();
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    this.setState({codes: codes, codesModalVisible: true, referencePrice: null,referencePriceButton:true});
                }
                else {
                    var code = {codigo: json.object.codigo, commodityId: json.object.commodityId, referencePrice: null,referencePriceButton:true}
                    this.onCodigoSelect(code);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    navigatorVentasDetail(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasDetail',
                component: VentasDetail,
                params: {
                    ventasInfo: ventasInfo,
                }
            })
        }
    }

    navigatorCompanyInfo(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CompanyInfo',
                component: CompanyInfo,
                params: {
                    ventasInfo: ventasInfo,
                    username: this.props.username,
                    sessionId: this.props.sessionId,
                    password: this.props.password,
                }
            })
        }
    }

    navigatorVentasInfoModal() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasInfoModal',
                component: VentasInfoModal,
                params: {
                }
            })
        }
    }

    navigateGroupQuery() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'groupManager',
                component: GroupQuery,
                params: {}
            })
        }
    }


    navigateRefercencePrice(codigo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'ReferencePrice',
                component: ReferencePrice,
                params: {
                    codigo: codigo,
                    goodName:this.state.selectedCodeInfo.goodName,
                    sessionId:this.props.sessionId,
                    password:this.props.password,
                    username:this.props.username,
                }
            })
        }
    }

    navigatePriceDeviation() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'priceDeviation',
                component: priceDeviation,
                params: {}
            })
        }
    }

    navigateGoodAdd() {
        const {navigator} = this.props;
        const {merchantId} = this.props;
        // var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoCommodityTaxInfoListMobile',
            //url:Config.server+'supnuevo/supnuevoGetSupnuevoCommodityTaxInfoListMobile.do',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //  'Cookie': sessionId,
            },
            //body:"merchantId=" + merchantId
            body: {
                merchantId: merchantId
            }
        }).then((json) => {

            var errorMsg = json.errorMessage;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var taxArr = new Array();
                var sizeArr = new Array();
                json.taxArr.map(function (index, i) {
                    taxArr.push(index);
                })
                if (json.sizeArr === undefined) {
                    json.sizeArr = [];
                }
                json.sizeArr.map(function (index, i) {
                    sizeArr.push(index);
                })
                for (var i = 0; i < taxArr.length; i++) {
                    var o = {'value': '', 'label': ''};
                    o.label = taxArr[i].label;
                    o.value = taxArr[i].value;
                    this.state.taxArr.push(o);
                }
                for (var i = 0; i < sizeArr.length; i++) {
                    var o = {'value': '', 'label': ''};
                    o.label = sizeArr[i].label;
                    o.value = sizeArr[i].value;
                    this.state.sizeArr.push(o);
                }

                if (navigator) {
                    navigator.push({
                        name: 'goodAdd',
                        component: GoodAdd,
                        params: {
                            merchantId: merchantId,
                            taxArr: this.state.taxArr,
                            sizeArr: this.state.sizeArr,
                            onCodigoSelect: this.onCodigoSelect.bind(this),
                        }
                    })
                }

            }
        }).catch((err) => {
            setTimeout(() => {
                Alert.alert(
                    '错误',
                    err,
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        },
                    ]
                );
            }, 900)

        });
    }

    navigateGoodUpdate() {
        const {navigator} = this.props;
        const {merchantId} = this.props;
        // var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoCommodityTaxInfoListMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //  'Cookie': sessionId,
            },
            // body:"merchantId=" + merchantId
            body: {
                merchantId: merchantId
            }
        }).then((json) => {

            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var taxArr = new Array();
                var sizeArr = new Array();
                json.taxArr.map(function (index, i) {
                    taxArr.push(index);
                })
                json.sizeArr.map(function (index, i) {
                    sizeArr.push(index);
                })
                for (var i = 0; i < taxArr.length; i++) {
                    var o = {'value': '', 'label': ''};
                    o.label = taxArr[i].label;
                    o.value = taxArr[i].value;
                    this.state.taxArr.push(o);
                }
                for (var i = 0; i < sizeArr.length; i++) {
                    var o = {'value': '', 'label': ''};
                    o.label = sizeArr[i].label;
                    o.value = sizeArr[i].value;
                    this.state.sizeArr.push(o);
                }

                if (this.state.selectedCodeInfo.codigo != undefined && this.state.selectedCodeInfo.codigo != null && this.state.selectedCodeInfo.codigo != '') {
                    if (navigator) {
                        navigator.push({
                            name: 'goodUpdate',
                            component: GoodUpdate,
                            params: {
                                merchantId: merchantId,
                                goodInfo: this.state.selectedCodeInfo,
                                taxArr: this.state.taxArr,
                                sizeArr: this.state.sizeArr,
                                onCodigoSelect: this.onCodigoSelect.bind(this),
                                setHasCodigo: this.setHasCodigo.bind(this),
                                reset: this.reset.bind(this),
                                commodityId:this.state.commodityId,
                                attachDataUrl:this.state.attachDataUrl,
                                attachDataUrl1:this.state.attachDataUrl1,
                                attachDataUrl2:this.state.attachDataUrl2,
                                attachDataUrl3:this.state.attachDataUrl3,
                                attachDataUrl4:this.state.attachDataUrl4,
                            }
                        })
                    }
                } else {
                    alert('请先选择要修改的商品！');
                }
            }
        }).catch((err) => {
            setTimeout(() => {
                Alert.alert(
                    '错误',
                    err,
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        },
                    ]
                );
            }, 900)

        });
    }

    navigateGroupMaintain() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.push({
                name: 'groupMaintain',
                component: GroupManage,
                params: {}
            })
        }
    }

    navigatePriceSurvey() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'priceSurvey',
                component: PriceSurvey,
                params: {}
            })
        }
    }

    navigateCaluConfig() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CaluConfig',
                component: CaluConfig,
                params: {}
            })
        }
    }

    navigate_priceGroupChange() {
        const {navigator} = this.props;
        const {merchantId} = this.props;
        var selectGoodInfo = this.state.selectedCodeInfo;
        let price = this.state.priceShow;
        let codigo = this.state.selectedCodeInfo.codigo;
        if ( codigo==null || codigo == undefined || codigo== "" || codigo.length < 8 || codigo.length > 13) {
            alert("条码错误");
            return;
        }

        if(selectGoodInfo==null || selectGoodInfo == undefined || selectGoodInfo == ""){
            alert("请输入条码")
            return ;
        }

        if (price == undefined || price == null || price == "") {
            alert("请先输入价格");
            return;
        }
        if(!isNumber(price)){
            alert('请输入正确的价格');
            return;
        }
        if (navigator) {
            navigator.push({
                name: 'group',
                component: Group,
                params: {
                    merchantId: merchantId,
                    price: price,
                    goodInfo: selectGoodInfo,
                    codigo: this.state.selectedCodeInfo.codigo,
                    reset: this.reset.bind(this),
                }
            })
        }

    }

    navigate2Stock() {
        this.setState({selectedTab:'进货'})
    }

    navigatorVentasDetail(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasDetail',
                component: VentasDetail,
                params: {
                    ventasInfo: ventasInfo,
                }
            })
        }
    }

    navigatorCompanyInfo(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CompanyInfo',
                component: CompanyInfo,
                params: {
                    ventasInfo: ventasInfo,
                    username: this.props.username,
                    sessionId: this.props.sessionId,
                    password: this.props.password,
                }
            })
        }
    }

    updatePrice(price) {

        var goodInfo = this.state.selectedCodeInfo;
        goodInfo.price = price;
        goodInfo.price1 = price;
        goodInfo.priceShow = price;
        this.setState({
            selectedCodeInfo: goodInfo, priceShow: goodInfo.priceShow, inputPrice: price, taxMark: 0,gengxingaijiaInput:goodInfo.priceShow,
            amount: 0
        });
    }

    addIVA() {
        var taxMark = this.state.taxMark;

        if (taxMark >= 0) {
            taxMark = 1;
        } else if (taxMark < 0) {
            taxMark = 0;
        }

        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + taxMark * this.state.selectedCodeInfo.iva) * (1 + this.state.amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({taxMark: taxMark, priceShow: priceShow});
    }

    addPercentage1() {
        var amount = this.state.amount + 0.1;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva) * (1 + amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.priceShow;
        this.setState({amount: amount, priceShow: priceShow});
    }

    addPercentage2() {
        var amount = this.state.amount + 0.05;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva) * (1 + amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount: amount, priceShow: priceShow});
    }

    zero() {
        this.state.selectedCodeInfo.price = parseInt(this.state.selectedCodeInfo.price);
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price.toFixed(2);
        var priceShow = this.state.selectedCodeInfo.priceShow;
        this.setState({priceShow: priceShow});
    }

    reduceIVA() {
        var taxMark = this.state.taxMark;

        if (taxMark <= 0) {
            taxMark = -1;
        } else if (taxMark > 0) {
            taxMark = 0;
        }
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + taxMark * this.state.selectedCodeInfo.iva) * (1 + this.state.amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({taxMark: taxMark, priceShow: priceShow});
    }

    reducePercentage1() {
        var amount = this.state.amount - 0.1;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva) * (1 + amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount: amount, priceShow: priceShow});
    }

    reducePercentage2() {
        var amount = this.state.amount - 0.05;
        this.state.selectedCodeInfo.price = (Math.round(this.state.inputPrice * (1 + this.state.taxMark * this.state.selectedCodeInfo.iva) * (1 + amount) * 100)) / 100;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price;
        var priceShow = this.state.selectedCodeInfo.price;
        this.setState({amount: amount, priceShow: priceShow});
    }

    zero1() {
        this.state.selectedCodeInfo.price = parseInt(this.state.selectedCodeInfo.price) + 0.50;
        this.state.selectedCodeInfo.priceShow = this.state.selectedCodeInfo.price.toFixed(2);
        var priceShow = this.state.selectedCodeInfo.priceShow;
        this.setState({priceShow: priceShow});
    }

    savePrice() {
        if (this.state.priceShow !== null && this.state.priceShow !== undefined) {

            if(this.state.selectedCodeInfo.codigo==null || this.state.selectedCodeInfo.codigo == undefined ||this.state.selectedCodeInfo.codigo =='')
            {alert('请输入正确条码');return;}
            if(this.state.selectedCodeInfo.commodityId==null || this.state.selectedCodeInfo.commodityId == undefined ||this.state.selectedCodeInfo.commodityId =='')
            {alert('请选择正确的商品');return;}

            var priceShow = this.state.priceShow.toString();
            var priceId = this.state.selectedCodeInfo.priceId;
            var commodityId = this.state.selectedCodeInfo.commodityId;
            var codigo = this.state.selectedCodeInfo.codigo.toString();
            var printType = this.state.selectedCodeInfo.printType.toString();
            var code = {codigo: codigo};
            var nombre = this.state.IsModify?this.state.selectedCodeInfo.nombre:null;

            const {merchantId} = this.props;

            if (priceShow !== null && priceShow !== undefined && priceShow !== '') {

                if(!isNumber(priceShow)){alert('请输入正确的价格');return;}

                this.setState({wait: true, bgColor: '#D4D4D4'});
                proxy.postes({
                    url: Config.server + '/func/commodity/saveOrUpdateSupnuevoBuyerCommodityPriceMobile',
                    headers: {
                        //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                        'Content-Type': 'application/json',
                        //  'Cookie': sessionId,
                    },
                    //body:"merchantId=" + merchantId + "&price=" + priceShow+ "&commodityId=" + commodityId+ "&printType=" + printType+ "&codigo=" + codigo
                    body: {
                        merchantId: merchantId,
                        price: priceShow,
                        commodityId: commodityId,
                        printType: printType,
                        codigo: codigo,
                        appVersion:this.state.appVersion,
                        nombre:nombre
                    }
                }).then((json) => {
                    this.setState({wait: false, bgColor: '#387ef5'});
                    //alert(1);
                    var errorMsg = json;
                    if (errorMsg === null && errorMsg === undefined) {
                        alert(errorMsg);
                    } else {
                        var message = json.message;
                        alert(message);
                        // this.onCodigoSelect(code);
                        this.reset();
                    }
                });

            } else {
                alert('请输入查询商品后再进行改价!');
            }

        }
        else {
            alert('请输入查询商品后再进行改价!');
        }


    }

    //联动改价
    saveRelPrice() {
        if (this.state.priceShow !== null && this.state.priceShow !== undefined) {
            var priceShow = this.state.priceShow.toString();
            var commodityId = this.state.selectedCodeInfo.commodityId;
            var codigo = this.state.selectedCodeInfo.codigo.toString();
            var printType = this.state.selectedCodeInfo.printType.toString();
            const {merchantId} = this.props;


            if (priceShow !== null && priceShow !== undefined && priceShow !== '') {

                proxy.postes({
                    url: Config.server + '/func/commodity/saveOrUpdateSupnuevoBuyerCommodityPriceAllRelMerchantMobile',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        merchantId: merchantId,
                        price: priceShow,
                        commodityId: commodityId,
                        printType: printType,
                        codigo: codigo,
                        appVersion:this.state.appVersion,
                    }
                }).then((json) => {

                    var errorMsg = json;
                    if (errorMsg === null && errorMsg === undefined) {
                        alert(errorMsg);
                    } else {
                        var message = json.message;
                        alert(message);
                        this.reset();
                    }
                });

            } else {
                alert('请输入查询商品后再进行改价!');
            }

        }
        else {
            alert('请输入查询商品后再进行改价!');
        }


    }

    updatePrintType1(printType1) {
        this.state.printType.type1 = printType1;
        var printType = this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1 + printType.type2 + printType.type3 + printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType: printType, selectCodeInfo: selectCodeInfo});
    }

    updatePrintType2(printType2) {
        this.state.printType.type2 = printType2;
        var printType = this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1 + printType.type2 + printType.type3 + printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType: printType, selectCodeInfo: selectCodeInfo});
    }

    updatePrintType3(printType3) {
        this.state.printType.type3 = printType3;
        var printType = this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1 + printType.type2 + printType.type3 + printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType: printType, selectCodeInfo: selectCodeInfo});
    }

    updatePrintType4(printType4) {
        this.state.printType.type4 = printType4;
        var printType = this.state.printType;
        this.state.selectedCodeInfo.printType = printType.type1 + printType.type2 + printType.type3 + printType.type4;
        var selectCodeInfo = this.state.selectedCodeInfo.printType;
        this.setState({printType: printType, selectCodeInfo: selectCodeInfo});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    closejisuanConfigModal() {
        if (this.state.jisuanConfigModalVisible === true) {

            proxy.postes({
                url: Config.server + '/func/commodity/getCalculationStorageMobile',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {}
            }).then((json) => {
                var errorMsg = json.errorMsg;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                } else {
                    this.setState({
                        IVAprice1: json.IVAprice1,
                        IVAprice2: json.IVAprice2,
                        IVAprice3: json.IVAprice3,
                        IVAprice4: json.IVAprice4,
                        profitprice1: json.profitprice1,
                        profitprice2: json.profitprice2,
                        profitprice3: json.profitprice3,
                        profitprice4: json.profitprice4,
                        doubleORper: json.doubleORper,
                        jisuanConfigModalVisible: false,
                    })
                }
            }).catch((err) => {
                alert(err);
            });
        }
    }

    closeVentasInfoModal(){
        this.setState({ventasInfoModalVisible:false})
    }

    priceCalculation(data) {

        let priceShow = this.state.gengxingaijiaInput;
        let doubleORper = this.props.doubleORper;//1是浮点制，2是百分制
        if (priceShow == null || priceShow == undefined) {
            return;
        }
        if (doubleORper == 1) {
            priceShow = (priceShow * data).toFixed(0);
            this.setState({priceShow: parseInt(priceShow),gengxingaijiaInput: parseInt(priceShow)});
        } else if (doubleORper == 2) {
            priceShow = ((priceShow * data / 100) + (priceShow * 1)).toFixed(0);
            this.setState({priceShow: parseInt(priceShow),gengxingaijiaInput: parseInt(priceShow)});
        }
    }

    confirmScanTime() {
        let scanTime = this.state.scanTime;
        if (scanTime < 1 || scanTime > 10) {
            alert("请设置小于10秒的间隔时间。");
            return;
        } else {
            const {merchantId} = this.props;
            proxy.postes({
                url: Config.server + '/func/commodity/setScanTimeWeb',
                headers: {
                    'Content-Type': 'application/json',
                    //'Cookie': sessionId,
                },
                body: {
                    scanTime: scanTime * 1,
                }
            }).then((json) => {
                var errorMsg = json.errorMsg;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                } else {
                    if (json.message === "OK") {
                        const {dispatch} = this.props;
                        dispatch(setScanTimerAction(scanTime));
                        ToastAndroid.show('设置成功', ToastAndroid.SHORT);
                        this.refs.modal1.close();
                    }
                }
            }).catch((err) => {
                alert(err);
            });
        }
    }

    constructor(props) {

        super(props);
        this.state = {
            attachDataUrl1:null,
            attachDataUrl2:null,
            attachDataUrl3:null,
            attachDataUrl4:null,
            attachDataUrl:null,

            Gsuggestlevel: null,
            referencePriceButton: true,
            referencePrice: null,//参考价
            scanTime: null,
            referencePriceList: [],
            uploadModalVisible: false,
            bgColor: '#387ef5',
            flag: 1,
            focus: false,
            commodityId: null,
            goods: {},
            wait: false,
            codesModalVisible: false,
            codigo: null,
            selectedCodeInfo: {},
            jisuanConfigModalVisible: false,//计算键设置的modal
            ventasInfoModalVisible:false,
            priceShow: null,
            inputPrice: null,
            taxMark: 0,
            amount: 0,
            taxArr: [],
            sizeArr: [],
            gengxingaijiaInput: "",
            printType: {type1: '1', type2: '0', type3: '0', type4: '0'},
            hasCodigo: false,
            cameraModalVisible: false,
            //计算的八个按键的值
            IVAprice1: this.props.IVAprice1,
            IVAprice2: this.props.IVAprice2,
            IVAprice3: this.props.IVAprice3,
            IVAprice4: this.props.IVAprice4,
            doubleORper: this.props.doubleORper,//1是浮点制，2是百分制
            profitprice1: this.props.profitprice1,
            profitprice2: this.props.profitprice2,
            profitprice3: this.props.profitprice3,
            profitprice4: this.props.profitprice4,

            camera: {
            },
            barcodeX: null,
            barcodeY: null,
            barcodeWidth: null,
            barcodeHeight: null,
            openFlash: false,

            appVersion:'app5.2',
            isOnLine:true,

            IsModify:false,
        };
    }



    goodsfromPriceD() {
        const {dispatch} = this.props;
        dispatch(setGoodsInfo({
            codigo: null,
            nombre: null,
            oldPrice: null,
            price: null,
            suggestPrice: null,
            differ: null,

        }));
    }

    changeModify(){
        this.setState({IsModify:!this.state.IsModify})
    }

    render() {

        var size = setSpText(22)

        var goodsfromPD_codigo = this.props.codigo;
        var flag = this.props.flag;
        var goodsfromPD = {};

        var suggestlevel = this.state.Gsuggestlevel;
        var codigo = this.state.selectedCodeInfo.codigo;
        var goodName = this.state.selectedCodeInfo.goodName;
        if(goodName!=null && goodName!='')goodName = goodName.toUpperCase()
        var oldPrice = this.state.selectedCodeInfo.oldPrice;
        let referencePrice = this.state.referencePrice;
        let IVAprice1 = this.state.IVAprice1;
        let IVAprice2 = this.state.IVAprice2;
        let IVAprice3 = this.state.IVAprice3;
        let IVAprice4 = this.state.IVAprice4;
        let doubleORper = this.state.doubleORper;//1是浮点制，2是百分制
        let profitprice1 = this.state.profitprice1;
        let profitprice2 = this.state.profitprice2;
        let profitprice3 = this.state.profitprice3;
        let profitprice4 = this.state.profitprice4;
        let scanTime = this.state.scanTime;
        if (scanTime == null) {
            scanTime = this.props.scanTime;
        }
        if (IVAprice1 == null && IVAprice2 == null && IVAprice3 == null) {
            IVAprice1 = this.props.IVAprice1;
            IVAprice2 = this.props.IVAprice2;
            IVAprice3 = this.props.IVAprice3;
            IVAprice4 = this.props.IVAprice4;
            doubleORper = this.props.doubleORper;//1是浮点制，2是百分制
            profitprice1 = this.props.profitprice1;
            profitprice2 = this.props.profitprice2;
            profitprice3 = this.props.profitprice3;
            profitprice4 = this.props.profitprice4;
        }

        var suggestPrice = this.state.selectedCodeInfo.suggestPrice == undefined || this.state.selectedCodeInfo.suggestPrice == null ? null : this.state.selectedCodeInfo.suggestPrice;
        if (goodsfromPD_codigo !== null && flag === 1) {
            const {dispatch} = this.props;
            codigo = goodsfromPD_codigo;
            suggestlevel = 1;
            dispatch(setGoodsInfo({
                codigo: null,
                nombre: null,
                oldPrice: null,
                price: null,
                suggestPrice: null,
                differ: null,
                flag: 0,
            }));
            goodsfromPD.codigo = codigo;
            this.onCodigoSelect(goodsfromPD);

        }
        var username = this.props.username;
        //var suggestPrice = this.state.selectedCodeInfo.suggestPrice == undefined || this.state.selectedCodeInfo.suggestPrice == null ? null : this.state.selectedCodeInfo.suggestPrice;
        var fixedPrice = null;
        var prientType = this.state.printType;

        //var suggestlevel = 1;
        var displayArea = {x: 5, y: 20, width: width, height: height - 25};

        var openFlash = this.state.openFlash;

        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/* header bar */}
                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop:Platform.OS=='ios'?40:10
                    }, styles.card]}>

                        <Text style={{fontSize: setSpText(22), flex: 4, textAlign: 'center', color: '#fff'}}>
                            Supnuevo(6.0)-{username}
                        </Text>
                        <TouchableOpacity ref="menu" style={{
                            flex: 1,
                            marginRight: 2,
                            flexDirection: 'row',
                            justifyContent: 'center'
                        }}
                                          onPress={this.showPopover.bind(this, 'menu')}>
                            <Icon name="chevron-circle-left" color="#fff" size={30}></Icon>
                        </TouchableOpacity>
                    </View>


                    <View style={{padding: 10}}>

                        {/*输入条码*/}
                        <View style={[styles.row, {borderBottomWidth: 0}]}>

                            <View style={{
                                flex: 1,
                                borderWidth: 1,
                                borderColor: '#ddd',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <TextInput
                                    style={{
                                        flex: 8,
                                        height: 50,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingTop: 6,
                                        paddingBottom: 6
                                    }}
                                    onChangeText={(codeNum) => {
                                        if (codeNum.toString().length == 13 || codeNum.toString().length == 12 || codeNum.toString().length == 8) {
                                            this.state.goods.codeNum = codeNum;
                                            this.setState({goods: this.state.goods});
                                            this.queryGoodsCode(codeNum.toString());
                                        }
                                        else {
                                            if (codeNum !== undefined && codeNum !== null) {
                                                this.state.goods.codeNum = codeNum;
                                                this.setState({goods: this.state.goods});
                                            }
                                        }
                                    }}
                                    value={this.state.goods.codeNum}
                                    keyboardType="numeric"
                                    placeholder='请输入商品条码尾数'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />

                                <TouchableOpacity style={{
                                    flex: 2,
                                    height: 40,
                                    marginRight: 10,
                                    paddingTop: 6,
                                    paddingBottom: 6,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 0,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(17, 17, 17, 0.6)'
                                }}
                                                  onPress={() => {
                                                      if (this.state.goods.codeNum !== undefined && this.state.goods.codeNum !== null) {
                                                          var codeNum = this.state.goods.codeNum;
                                                          if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                              this.queryGoodsCode(this.state.goods.codeNum.toString());
                                                          }
                                                          else {
                                                              Alert.alert(
                                                                  '提示信息',
                                                                  '请输入4-13位的商品条码进行查询',
                                                                  [
                                                                      {
                                                                          text: 'OK',
                                                                          onPress: () => console.log('OK Pressed!')
                                                                      },
                                                                  ]
                                                              )
                                                          }
                                                      }
                                                      else {
                                                          Alert.alert(
                                                              '提示信息',
                                                              '请输入4-13位的商品条码进行查询',
                                                              [
                                                                  {
                                                                      text: 'OK',
                                                                      onPress: () => console.log('OK Pressed!')
                                                                  },
                                                              ]
                                                          )
                                                      }

                                                  }}>

                                    <Text style={{color: '#fff', fontSize: setSpText(16)}}>查询</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={{
                                    flex: 2,
                                    height: 40,
                                    marginRight: 10,
                                    paddingTop: 6,
                                    paddingBottom: 6,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginBottom: 0,
                                    borderRadius: 4,
                                    backgroundColor: 'rgba(17, 17, 17, 0.6)'
                                }}
                                                  onPress={() => {
                                                      this.startCamera();
                                                  }}>

                                    <View>
                                        <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                                    </View>
                                </TouchableOpacity>

                            </View>
                        </View>

                        {/* 价位横幅 */}
                        <View style={[styles.row, {
                            height: 50,
                            backgroundColor: '#eee',
                            marginTop: 12,
                            marginBottom: 5,
                            borderRadius: 8,
                            borderWidth: 1,
                        }]}>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginRight: 1,
                                alignItems: 'center',
                                borderRightWidth: 1,

                            }}>
                                <Text style={{'fontSize': setSpText(16), color: '#444'}}>原价位</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                marginRight: 1,
                                alignItems: 'center',
                                borderRightWidth: 1,
                            }}>
                                <Text style={{'fontSize': setSpText(16), color: '#444'}}>建议价</Text>
                            </View>
                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}>
                                <Text style={{'fontSize': setSpText(16), color: '#444'}}>参考价</Text>
                            </View>
                        </View>

                        {/* 三个无意义的大方块 */}
                        <View style={[styles.row, {borderBottomWidth: 0, height: 50}]}>
                            <View style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                marginRight: 0.5, borderTopLeftRadius: 8, borderBottomLeftRadius: 8
                            }}>
                                <TouchableOpacity style={{justifyContent: 'center'}}
                                                  onPress={
                                                      () => {
                                                          this.updatePrice(oldPrice);
                                                      }}>
                                    <Text style={{'fontSize': setSpText(16), color: '#fff'}}>{oldPrice}</Text>
                                </TouchableOpacity>

                            </View>

                            <View style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: '#387ef5',
                                marginRight: 0.5
                            }}>
                                {
                                    suggestPrice == undefined || suggestPrice == null ?
                                        <Text style={{fontSize: setSpText(16), color: '#fff'}}></Text> :
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                        }}>
                                            {
                                                suggestlevel == 1 ?
                                                    <TouchableOpacity style={{justifyContent: 'center'}}
                                                                      onPress={
                                                                          () => {
                                                                              this.updatePrice(suggestPrice);
                                                                          }}>
                                                        <Text style={{
                                                            fontSize: setSpText(16),
                                                            color: '#0B0B0B'
                                                        }}>{suggestPrice}</Text>
                                                    </TouchableOpacity> :
                                                    <View style={{
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {
                                                            suggestlevel == 2 ?
                                                                <TouchableOpacity style={{justifyContent: 'center'}}
                                                                                  onPress={
                                                                                      () => {
                                                                                          this.updatePrice(suggestPrice);
                                                                                      }}>
                                                                    <Text style={{
                                                                        fontSize: setSpText(16),
                                                                        color: '#aaa'
                                                                    }}>{suggestPrice}</Text>
                                                                </TouchableOpacity> :
                                                                <View style={{
                                                                    flexDirection: 'row',
                                                                    justifyContent: 'center',
                                                                }}>
                                                                    {
                                                                        suggestlevel != null || suggestlevel != undefined ?
                                                                            <TouchableOpacity
                                                                                style={{justifyContent: 'center'}}
                                                                                onPress={
                                                                                    () => {
                                                                                        this.updatePrice(suggestPrice);
                                                                                    }}>
                                                                                <Text style={{
                                                                                    fontSize: setSpText(16),
                                                                                    color: '#fff'
                                                                                }}>{suggestPrice}</Text>
                                                                            </TouchableOpacity> :
                                                                            <Text style={{
                                                                                fontSize: setSpText(16),
                                                                                color: '#fff'
                                                                            }}/>
                                                                    }
                                                                </View>
                                                        }
                                                    </View>
                                            }</View>
                                }</View>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderTopRightRadius: 8, borderBottomRightRadius: 8, alignItems: 'center',
                            }}
                                              disabled={this.state.referencePriceButton}
                                              onPress={() => {
                                                  this.navigateRefercencePrice(this.state.codigo);
                                                  //this.getReferencePrice()
                                              }}
                            >
                                {
                                    referencePrice == undefined || referencePrice == null ?
                                        <Text style={{fontSize: setSpText(16), color: '#fff'}}></Text> :
                                        <Text style={{
                                            fontSize: setSpText(16),
                                            color: '#fff',
                                            textAlign: 'center'
                                        }}>{referencePrice}</Text>
                                }
                            </TouchableOpacity>
                        </View>

                        {/*商品概要*/}
                        <View style={[styles.row, {
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 0,
                            borderColor: '#aaa',
                            padding: 8,
                            marginBottom: 1,
                            marginTop: 8
                        }]}>
                            <View style={{
                                flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginRight: .5, borderTopLeftRadius: 4, borderBottomLeftRadius: 4
                            }}>
                                <Text style={{fonrSize:setSpText(14)}}>商品条码:</Text>
                            </View>
                            <View style={{
                                flex: 7,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{fonrSize:setSpText(14)}}>{codigo}</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.row, {
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 0,
                            borderColor: '#aaa',
                            padding: 8,
                            marginBottom: 1,
                            backgroundColor:this.state.IsModify?'#387ef5':'#eee',
                        }]}
                        onPress={()=>{
                            this.changeModify();
                        }}>
                            <View style={{
                                flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                marginRight: .5, borderTopLeftRadius: 4, borderBottomLeftRadius: 4
                            }}>
                                <Text style={{fonrSize:setSpText(14),color:this.state.IsModify?'#fff':'#000'}}>商品名称:</Text>
                            </View>
                            <View style={{
                                flex: 7,
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center'
                            }}>
                                <Text style={{fonrSize:setSpText(14),color:this.state.IsModify?'#fff':'#000'}}>{goodName}</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={[styles.row, {
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderColor: '#aaa',
                            borderBottomColor: '#aaa',
                            paddingLeft: 8,
                            paddingRight: 12
                        }]}>

                            <View
                                style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}>
                                <Text style={{fonrSize:setSpText(14)}}>更新改价:</Text>
                            </View>

                            <TextInput
                                ref="gengxingaijia"
                                keyboardType='numeric'
                                selectTextOnFocus={true}
                                style={{height: 50, alignItems: 'center', flex: 7}}
                                onChangeText={(priceShow) => {
                                    this.state.selectedCodeInfo.priceShow = priceShow;
                                    this.state.inputPrice = priceShow;
                                    this.setState({
                                        gengxingaijiaInput: priceShow,
                                        priceShow: priceShow,
                                        inputPrice: priceShow,
                                        taxMark: 0,
                                        amount: 0,
                                    });
                                }}
                                // placeholder='在此输入您的价格'
                                placeholder={'' + (this.state.priceShow !== undefined && this.state.priceShow !== null ? this.state.priceShow.toString() : '')}
                                placeholderTextColor="#aaa"
                                // value={'' + (this.state.inputPrice !== undefined && this.state.inputPrice !== null ? this.state.inputPrice.toString() : '')}
                                value={''+this.state.gengxingaijiaInput.toString()}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <View style={[styles.row, {
                            borderBottomWidth: 0,
                            height: 50,
                            marginTop: 12,
                            marginBottom: 12
                        }]}>

                            {/*标签*/}
                            {
                                prientType.type1 == 0 ?
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#eee',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType1('1');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#444'}}>标签</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#387ef5',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType1('0');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#fff'}}>标签</Text>
                                        </TouchableOpacity>
                                    </View>
                            }

                            {/*大折扣*/}
                            {
                                prientType.type2 == 0 ?
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#eee',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType2('1');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#444'}}>大折扣</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#387ef5',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType2('0');
                                                              }}>
                                            <Text style={{fontSize:setSpText(15), color: '#fff'}}>大折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                            {/*中折扣*/}
                            {
                                prientType.type3 == 0 ?
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#eee',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType3('1');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#444'}}>中折扣</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#387ef5',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType3('0');
                                                              }}>
                                            <Text style={{fontSize:setSpText(15), color: '#fff'}}>中折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                            {/*小折扣*/}
                            {
                                prientType.type4 == 0 ?
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#eee',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType4('1');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#444'}}>小折扣</Text>
                                        </TouchableOpacity>
                                    </View> :
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        backgroundColor: '#387ef5',
                                        marginRight: .5,
                                        borderTopLeftRadius: 4,
                                        borderBottomLeftRadius: 4,
                                        alignItems: 'center'
                                    }}>
                                        <TouchableOpacity style={{justifyContent: 'center'}}
                                                          onPress={
                                                              () => {
                                                                  this.updatePrintType4('0');
                                                              }}>
                                            <Text style={{fontSize: setSpText(15), color: '#fff'}}>小折扣</Text>
                                        </TouchableOpacity>

                                    </View>

                            }

                        </View>

                        {/*包含8个按钮的按钮组*/}
                        <View style={[styles.row, {borderBottomWidth: 0, height: 50}]}>
                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: '#387ef5',
                                borderRightWidth: 1,
                                borderRightColor: '#fff',
                                marginRight: 1,
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                                alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(IVAprice1);
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{IVAprice1}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderRightWidth: 1, borderRightColor: '#fff', alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(IVAprice2);
                                                  }}>

                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{IVAprice2}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderRightWidth: 1, borderRightColor: '#fff', alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(IVAprice3);
                                                  }}>

                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{IVAprice3}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderTopRightRadius: 4, borderBottomRightRadius: 4, alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(IVAprice4);
                                                  }}>

                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{IVAprice4}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, {borderBottomWidth: 0, height: 50, marginTop: 4}]}>
                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: '#387ef5',
                                borderRightWidth: 1,
                                borderRightColor: '#fff',
                                marginRight: 1,
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                                alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(profitprice1);
                                                  }}>

                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{profitprice1}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderRightWidth: 1, borderRightColor: '#fff', alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(profitprice2);
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{profitprice2}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderRightWidth: 1, borderRightColor: '#fff', alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(profitprice3);
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{profitprice3}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderTopRightRadius: 4, borderBottomRightRadius: 4, alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.priceCalculation(profitprice4);
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(20)}}>{profitprice4}</Text>
                                {doubleORper == 2 ? <Text style={{color: '#fff', fontSize: setSpText(20)}}>%</Text>
                                    : <View/>
                                }
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.row, {borderBottomWidth: 0, height: 50, marginTop: 12}]}>

                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                borderTopRightRadius: 4,
                                borderBottomRightRadius: 4,
                                marginRight: .5, alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.saveRelPrice();
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(18)}}>联动改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#387ef5',
                                marginRight: .5, alignItems: 'center'
                            }}
                                              onPress={
                                                  () => {
                                                      this.navigate_priceGroupChange();
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(18)}}>组改价</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{
                                flex: 1,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                backgroundColor: this.state.bgColor,
                                marginRight: .5,
                                borderTopLeftRadius: 4,
                                borderBottomLeftRadius: 4,
                                alignItems: 'center'
                            }}
                                              disabled={this.state.wait}
                                              onPress={
                                                  () => {
                                                      this.savePrice();
                                                  }}>
                                <Text style={{color: '#fff', fontSize: setSpText(18)}}>确认</Text>
                            </TouchableOpacity>

                        </View>

                    </View>

                    <Popover
                        isVisible={this.state.menuVisible}
                        fromRect={this.state.buttonRect}
                        displayArea={displayArea}
                        onClose={() => {
                            this.closePopover()
                        }}>

                        {
                            this.state.hasCodigo === false ?
                                <TouchableOpacity
                                    style={[styles.popoverContent, {
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#ddd'
                                    }]}
                                    onPress={() => {
                                        console.log('choose add commodity');
                                        this.closePopover();
                                        this.navigateGoodAdd();
                                    }}>
                                    <Text style={[styles.popoverText, {color: '#444'}]}>维护商品信息</Text>
                                </TouchableOpacity> :
                                <TouchableOpacity
                                    style={[styles.popoverContent, {
                                        borderBottomWidth: 1,
                                        borderBottomColor: '#ddd'
                                    }]}
                                    onPress={() => {
                                        console.log('choose add commodity');
                                        this.closePopover();
                                        this.navigateGoodUpdate();
                                    }}>
                                    <Text style={[styles.popoverText, {color: '#444'}]}>维护商品信息</Text>
                                </TouchableOpacity>

                        }

                        <TouchableOpacity
                            style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                            onPress={() => {
                                this.closePopover();

                                this.navigatePriceDeviation();

                            }}>
                            <Text style={[styles.popoverText, {color: '#444'}]}>价格偏差表</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                            onPress={() => {
                                this.closePopover();
                                this.setState({jisuanConfigModalVisible: true})
                            }}>
                            <Text style={[styles.popoverText, {color: '#444'}]}>计算键设置</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.popoverContent, {borderBottomWidth: 1, borderBottomColor: '#ddd'}]}
                            onPress={() => {
                                this.closePopover();
                                this.refs.modal1.open()
                            }}>
                            <Text style={[styles.popoverText, {color: '#444'}]}>扫码间隔时间</Text>
                        </TouchableOpacity>
                    </Popover>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.codesModalVisible}
                        onRequestClose={() => {
                            this.setState({codesModalVisible: false})
                        }}>

                        <CodesModal
                            onClose={() => {
                                this.closeCodesModal(!this.state.codesModalVisible)
                            }}
                            onCodigoSelect={
                                (code) => {
                                    this.onCodigoSelect(code);
                                }}
                            codes={this.state.codes}
                        />
                    </Modal>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.jisuanConfigModalVisible}
                        onRequestClose={() => {
                            this.setState({jisuanConfigModalVisible: false})
                        }}>

                        <CaluConfig
                            onClose={() => {
                                this.closejisuanConfigModal(this.state.jisuanConfigModalVisible)
                            }}
                        />
                    </Modal>

                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.ventasInfoModalVisible}
                        onRequestClose={() => {
                            this.setState({ventasInfoModalVisible: false})
                        }}>

                        <VentasInfoModal
                            onClose={() => {
                                this.closeVentasInfoModal()
                            }}
                            navigate2Stock={()=>{
                                this.navigate2Stock()
                            }}
                        />
                    </Modal>

                    <WaitTip
                        ref="waitTip"
                        tipsName="正在查找..."
                    />

                    {/*` part*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.cameraModalVisible}
                        onRequestClose={() => {
                            this.closeCamera()
                        }}
                    >
                        <Camera
                            ref={(cam) => {
                            this.camera = cam;
                        }}
                            style={styles.preview}
                            type={Camera.constants.Type.back}
                            permissionDialogTitle={'Permission to use camera'}
                            permissionDialogMessage={'We need your permission to use your camera phone'}
                            torchMode={openFlash ? Camera.constants.TorchMode.on:Camera.constants.TorchMode.off}
                            onBarCodeRead={(barcode) => {
                                this.closeCamera();
                                var {type, data, bounds} = barcode;
                                if (data !== undefined && data !== null) {
                                    console.log('barcode data=' + data + 'barcode type=' + type);
                                    this.state.goods.codeNum = data;
                                    var goods = this.state.goods;
                                    goods.codeNum = data;
                                    setTimeout(() => this.queryGoodsCode(data), 1000)
                                }
                            }}
                        />
                        <View style={[styles.box]}>
                        </View>
                        <View style={{
                        position: 'absolute',
                        right: 1 / 2 * width - 100,
                        top: 1 / 2 * height,
                        height: 100,
                        width: 200,
                        borderTopWidth: 1,
                        borderColor: '#e42112',
                        backgroundColor: 'transparent'
                    }}>
                        </View>
                        <View style={[styles.overlay, styles.bottomOverlay]}>

                            <TouchableOpacity
                                onPress={() => {
                                this.changeFlash()
                            }}
                            >
                                <Icon name="flash" size={30} color="#fff"/>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.captureButton,{marginTop:20}]}
                                onPress={() => {
                                this.closeCamera()
                            }}
                            >
                                <Icon name="times-circle" size={50} color="#343434"/>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                    <Modalbox
                        backButtonClose={true}
                        style={[styles.modelbox]}
                        ref={"modal1"}
                        animationType={"slide"}>
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'flex-end',
                                    paddingRight: 6,
                                    paddingTop: 6,
                                }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.refs.modal1.close()
                                    }}
                                >
                                    <Icon name="times-circle" color="#000" size={30}/>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: 20
                            }}>
                                <Text style={{fontSize: setSpText(20), color: '#000',}}>
                                    收银扫码间隔时间
                                </Text>
                                <TextInput
                                    style={{
                                        borderWidth: 1,
                                        paddingLeft: 10,
                                        height: 40,
                                        width: 60,
                                    }}
                                    value={scanTime + ""}
                                    onChangeText={(tim) => {
                                        this.setState({scanTime: tim})
                                    }}
                                    underlineColorAndroid="transparent"
                                    keyboardType="numeric"
                                />
                                <Text style={{fontSize: setSpText(20), color: '#000',}}>
                                    秒
                                </Text>
                            </View>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 50,
                                marginTop: 20,
                                marginLeft: 240,
                                height: 40,
                                borderRadius: 4,
                                backgroundColor: '#CAE1FF'
                            }} onPress={() => {
                                this.confirmScanTime()
                            }}>
                                <Text style={{textAlign: 'center'}}>
                                    确定
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Modalbox>
                </View>
            </ScrollView>);
    }
}

function isNumber(val){
    var regPos = /^\d+(\.\d+)?$/; //非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
    if(regPos.test(val) || regNeg.test(val)){
        return true;
    }else{
        return false;
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelbox: {
        marginRight: 10,
        borderRadius: 10,
        borderWidth: 1,
        width: 300,
        height: 180,
        backgroundColor: '#ffffff'
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        height: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    discountUnselected: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#eee',
        marginRight: .5,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center'
    },
    discountSelected: {
        flex: 1, flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#387ef5',
        marginRight: .5,
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        alignItems: 'center'
    },
    popoverContent: {
        width: 140,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popoverText: {
        color: '#ccc',
        fontSize: setSpText(18)
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'

    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    flashButton: {
        padding: 20,
        borderRadius: 40,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalContainerIOS: {
        justifyContent: 'center',
        padding: 8,
    },
    loader: {
        marginTop: 10,

    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    //条码
    cameraContainer: {
        ...Platform.select({
            ios: {
                height: 64,
                width:width,
            },
            android: {
                height: 50,
                width:width,
            }
        }),
        backgroundColor:BLACK_COLOR,
        opacity:0.5
    },
    titleContainer: {
        flex: 1,
        ...Platform.select({
            ios: {
                paddingTop: 15,
            },
            android: {
                paddingTop: 0,
            }
        }),
        flexDirection: 'row',
    },
    leftContainer: {
        flex:1,
        justifyContent: 'flex-start',
        alignItems:'flex-start'
    },
    backImg: {
        marginLeft: 10,
    },
    cameraStyle: {
        alignSelf: 'center',
        width: width,
        height: height,
    },
    flash: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 60,
    },
    flashIcon: {
        fontSize: 1,
        color: '#fff',
    },
    text: {
        fontSize: 14,
        color: '#fff',
        marginTop:5
    },
    scanLine:{
        alignSelf:'center',
    },
    centerContainer:{
        ...Platform.select({
            ios: {
                height: 80,
            },
            android: {
                height: 60,
            }
        }),
        width:width,
        backgroundColor:BLACK_COLOR,
        opacity:0.5
    },
    bottomContainer:{
        alignItems:'center',
        backgroundColor:BLACK_COLOR,
        alignSelf:'center',
        opacity:0.5,
        flex:1,
        width:width
    },
    fillView:{
        width:(width-220)/2,
        height:220,
        backgroundColor:BLACK_COLOR,
        opacity:0.5
    },
    scan:{
        width:220,
        height:220,
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center'
    }

});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
        auth:state.user.auth,
        codigo: state.sale.codigo,
        nombre: state.sale.nombre,
        oldPrice: state.sale.oldPrice,
        suggestPrice: state.sale.suggestPrice,
        flag: state.sale.flag,
        suggestLevel: 1,
        password: state.user.password,
        IVAprice1: state.sale.IVAprice1,
        IVAprice2: state.sale.IVAprice2,
        IVAprice3: state.sale.IVAprice3,
        IVAprice4: state.sale.IVAprice4,
        profitprice1: state.sale.profitprice1,
        profitprice2: state.sale.profitprice2,
        profitprice3: state.sale.profitprice3,
        profitprice4: state.sale.profitprice4,
        doubleORper: state.sale.doubleORper,//1是浮点制，2是百分制
        scanTime: state.timer.scanTime,
        isConnected:state.netInfo.isConnected,
    })
)(Query);
