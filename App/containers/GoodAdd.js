/**
 * Created by dingyiming on 2017/1/18.
 */
import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    Button,
    Vibration,
    Easing,
    Platform,
    Animated,
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconI from 'react-native-vector-icons/Ionicons';
import IconE from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import ActionSheet from 'react-native-actionsheet';
import {setSpText} from '../utils/ScreenUtil'
import Config from '../../config';
import RNCamera from 'react-native-camera';
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import ViewFinder from '../utils/Viewfinder';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
var head="https://supnuevo.s3.sa-east-1.amazonaws.com/";
var ts=new Date().getTime();

class GoodAdd extends Component {

    componentDidMount(){
        this._startAnimation(false);
        console.log(this.state.newGoodInfo.codigo)
        console.log('1')
        if(this.state.newGoodInfo.codigo!==null && this.state.newGoodInfo.codigo!==undefined && this.state.newGoodInfo.codigo!==''){
            this.onCodigoSelect();
        }

    }


    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    goBack() {
        var code = {codigo: this.state.newGoodInfo.codigo};
        this.props.onCodigoSelect(code);
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    //检查商品基本信息的完整性
    checkGoodsBaseInfo(){
        if (this.state.newGoodInfo.codigo === null || this.state.newGoodInfo.codigo === undefined || this.state.newGoodInfo.codigo === '') {
            alert("商品条码不能为空");
            return false;
        }
        if (this.state.newGoodInfo.codigo !== null || this.state.newGoodInfo.codigo !== undefined || this.state.newGoodInfo.codigo !== '') {
            if (this.state.newGoodInfo.codigo.length < 6 || this.state.newGoodInfo.codigo.length > 15) {
                alert("商品条码位数错误");
                return false;
            }
        }
        // if (this.state.newGoodInfo.taxId === null || this.state.newGoodInfo.taxId === undefined || this.state.newGoodInfo.taxId === '') {
        //     alert("商品税类不能为空");
        //     return false;
        // }
        if (this.state.newGoodInfo.nombre === null || this.state.newGoodInfo.nombre === undefined || this.state.newGoodInfo.nombre === '') {
            alert("商品名称不能为空");
            return false;
        }
        if (this.state.newGoodInfo.nombre !== null || this.state.newGoodInfo.nombre !== undefined || this.state.newGoodInfo.nombre !== '') {
            if (this.state.newGoodInfo.nombre.length < 10) {
                alert("商品名称不能少于10位");
                return false;
            }
        }

        if (this.state.newGoodInfo.setSizeValue === null || this.state.newGoodInfo.setSizeValue === undefined || this.state.newGoodInfo.setSizeValue === '') {
            alert("商品含量不能为空");
            return false;
        }
        if (this.state.newGoodInfo.sizeUnit === null || this.state.newGoodInfo.sizeUnit === undefined || this.state.newGoodInfo.sizeUnit === '') {
            alert("含量单位不能为空");
            return false;
        }
        if (this.state.newGoodInfo.scaleUnit === null || this.state.newGoodInfo.scaleUnit === undefined || this.state.newGoodInfo.scaleUnit === '') {
            alert("比价单位不能为空");
            return false;
        }
    }

    confirm() {

        //修改信息
        if (this.state.newGoodInfo != undefined && this.state.newGoodInfo != null) {
            if(this.checkGoodsBaseInfo()!=false) {
                this.setState({wait: true, bgColor: '#D4D4D4'});
                var sessionId = this.props.sessionId;
                proxy.postes({
                    url: Config.server + '/func/commodity/saveOrUpdateSupnuevoCommonCommodityMobile',
                    headers: {
                        //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                        'Content-Type': 'application/json',
                        //'Cookie':sessionId,
                    },
                    // body: "taxId=" + this.state.newGoodInfo.taxId + "&supnuevoMerchantId=" + this.state.merchantId
                    // + "&codigo=" + this.state.newGoodInfo.codigo+ "&nombre=" + this.state.newGoodInfo.nombre+
                    // "&sizeValue=" + this.state.newGoodInfo.setSizeValue+ "&sizeUnited=" + this.state.newGoodInfo.sizeUnit+
                    // "&scaleUnited=" + this.state.newGoodInfo.scaleUnit
                    body: {
                        taxId: this.state.newGoodInfo.taxId,
                        supnuevoMerchantId: this.state.merchantId,
                        codigo: this.state.newGoodInfo.codigo,
                        nombre: this.state.newGoodInfo.nombre,
                        commodityName:this.state.newGoodInfo.commodityName,
                        sizeValue: this.state.newGoodInfo.setSizeValue,
                        sizeUnited: this.state.newGoodInfo.sizeUnit,
                        scaleUnited: this.state.newGoodInfo.scaleUnit
                    }
                }).then((json) => {
                    var errorMsg = json.errorMsg;
                    var message = json.message;
                    this.setState({commodityId: json.commodityId})
                    if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                        alert(errorMsg);
                        // this.goBack();
                    }
                    if (message !== null && message !== undefined && message !== "") {
                        alert(message);
                        // this.goBack();
                    }
                    this.setState({wait: false, bgColor: '#11c1f3'});
                }).catch((err) => {
                    this.setState({wait: false, bgColor: '#11c1f3'});
                    alert(err);
                    // this.goBack();
                });
            }
        }
    }

    _handlePress1(index) {
        if (index > 0) {
            this.state.newGoodInfo.sizeUnit = this.state.sizeArr[index - 1].label;
            var newGoodInfo = this.state.newGoodInfo;
            var sizeUnit = this.state.newGoodInfo.sizeUnit;
            this.setState({newGoodInfo: newGoodInfo});

            var sessionId = this.props.sessionId;
            proxy.postes({
                url: Config.server + '/func/commodity/getSupnuevoScaleInfoListMobile',
                headers: {
                    //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                    'Content-Type': 'application/json',
                    //'Cookie':sessionId,
                },
                // body: "sizeUnit=" + sizeUnit + "&merchantId=" + this.state.merchantId
                body: {
                    sizeUnit: sizeUnit,
                    merchantId: this.state.merchantId
                }

            }).then((json) => {
                var scaleArr = new Array();
                json.scaleArr.map(function (index, i) {
                    scaleArr.push(index);
                });

                this.setState({scaleArr: scaleArr});

            }).catch((err) => {
                alert(err);
            });
        }

    }

    _handlePress2(index) {
        if(index>0) {
            this.state.newGoodInfo.scaleUnit = this.state.scaleArr[index - 1].label;
            var newGoodInfo = this.state.newGoodInfo;
            this.setState({newGoodInfo: newGoodInfo});
        }
    }

    _handlePress3(index) {
        if(index>0) {
            this.state.newGoodInfo.taxId = parseInt(this.state.taxArr[index-1].value);
            var newGoodInfo = this.state.newGoodInfo;
            this.setState({newGoodInfo: newGoodInfo});
        }
    }

    show(actionSheet) {
        if (actionSheet == 'actionSheet2') {
            if (this.state.scaleArr !== undefined && this.state.scaleArr !== null && this.state.scaleArr.length > 0) {
                this[actionSheet].show();
            } else {
                alert('请先选择含量单位');
            }
        } else {
            this[actionSheet].show();
        }
    }

    closeCamera(newGoodInfo) {
        if (newGoodInfo !== undefined && newGoodInfo !== null) {
            this.setState({codigoCameraModalVisible: false, newGoodInfo: newGoodInfo});
        } else {
            this.setState({codigoCameraModalVisible: false});
        }

    }


    constructor(props) {
        super(props);
        this.state = {
            commodityId:this.props.commodityId,
            onCodigoSelect: props.onCodigoSelect,
            merchantId: props.merchantId,
            wait: false,
            newGoodInfo: {
                codigo: this.props.codigo,
                nombre: '',
                commodityName:'',
                setSizeValue: '',
                sizeUnit: '',
                scaleUnit: '',
                selectTax: '',
                taxId: null
            },
            taxArr: props.taxArr,
            sizeArr: props.sizeArr,
            scaleArr: [],
            cameraModalVisible: false,
            codigoCameraModalVisible: false,
            bgColor: '#11c1f3',
            camera: {
                // aspect: Camera.constants.Aspect.fill,
                // captureTarget: Camera.constants.CaptureTarget.disk,
                // type: Camera.constants.Type.back,
                // orientation: Camera.constants.Orientation.auto,
                // flashMode: Camera.constants.FlashMode.auto
            },
            barcodeX: null,
            barcodeY: null,
            barcodeWidth: null,
            barcodeHeight: null,

            openFlash: false,
            active: true,
            fadeInOpacity: new Animated.Value(0), // 初始值
            isEndAnimation:false,//结束动画标记

            picUrl1: null,//base64格式显示图片，或者是图片地址
            picUrl2: null,
            picUrl3: null,
            picUrl4: null,
            // picUrl5: null,
            picNum: null,//目前选择的第几个图片
            pictureUri: null,//查看大图的base64或者uri
            bigPicUrl:null,
            currentNum:null,  //当前那张图片作为大图
        };
        this._startAnimation = this._startAnimation.bind(this);
    }


    //开始动画，循环播放
    _startAnimation(isEnd) {
        Animated.timing(this.state.fadeInOpacity, {
            toValue: 1,
            duration: 3000,
            easing: Easing.linear
        }).start(
            () => {
                if (isEnd){
                    this.setState({
                        isEndAnimation:true
                    })
                    return;
                }
                if (!this.state.isEndAnimation){
                    this.state.fadeInOpacity.setValue(0);
                    this._startAnimation(false)
                }
            }
        );
        console.log("开始动画");
    }

    render() {
        var newGoodInfo = this.state.newGoodInfo;
        var codigo = newGoodInfo.codigo;
        var name = newGoodInfo.nombre;
        var sizeValue = newGoodInfo.setSizeValue;

        var sizeUnit = newGoodInfo.sizeUnit;
        var scaleUnit = newGoodInfo.scaleUnit;
        var selectTax = '';

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;

        const sizeUnitButtons = [];
        const scaleUnitButtons = [];
        const taxButtons = [];

        sizeUnitButtons.push('取消');
        taxButtons.push('取消');
        scaleUnitButtons.push('取消');

        this.state.sizeArr.map(function (index, i) {
            sizeUnitButtons.push(index.label);
        })
        this.state.taxArr.map(function (index, i) {
            taxButtons.push(index.label);
            if ((index.value) == newGoodInfo.taxId) {
                selectTax = index.label;
            }
        })
        this.state.scaleArr.map(function (index, i) {
            scaleUnitButtons.push(index.label);
        })

        var openFlash = this.state.openFlash;

        return (
            <View style={{flex: 1}}>
                <ScrollView>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                    paddingTop:Platform.OS=='ios'?40:10
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={() => {
                                              this.cancel();
                                          }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    {this.state.newGoodInfo.codigo==null || this.state.newGoodInfo.codigo==undefined || this.state.newGoodInfo.codigo==''?
                        <View>
                            <Text style={{fontSize: setSpText(17), flex: 3, textAlign: 'center', color: '#fff'}}>
                                添加商品
                            </Text>
                        </View>
                        :
                        <View>
                            <Text style={{fontSize: setSpText(17), flex: 3, textAlign: 'center', color: '#fff'}}>
                                完善商品
                            </Text>
                        </View>

                    }

                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>

                {/* body */}

                <View style={{padding: 10, marginTop: 20}}>


                    {/*表单*/}
                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品内码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                        </View>
                    </View>


                    <View style={[styles.row, {
                        borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderBottomWidth: 0,
                        borderColor: '#aaa', borderBottomColor: '#aaa', paddingLeft: 12, paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',marginLeft:width*0.035}}>
                            <Text>商品条码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40,backgroundColor:"white", color:"black",}}
                                onChangeText={(codigo) => {
                                    this.state.newGoodInfo.codigo = codigo;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={codigo}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <TouchableOpacity style={{
                            flex: 2, height: 40, marginRight: 6, marginTop: 5, paddingTop: 10, paddingBottom: 6,
                            flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                            marginBottom: 0, borderRadius: 4, backgroundColor: 'rgba(17, 17, 17, 0.6)'
                        }}
                                          onPress={() => {
                                              this.startCodigo();
                                          }}>

                            <View>
                                <Text style={{color: '#fff', fontSize: setSpText(12)}}>扫码</Text>
                            </View>
                        </TouchableOpacity>

                    </View>

                    {/*扫码*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.codigoCameraModalVisible}
                        onRequestClose={() => {
                        this.closeCamera()
                        }}
                    >
                    <RNCamera
                        ref={(cam) => {
                        this.camera = cam;
                        }}
                        style={styles.preview}
                        permissionDialogTitle={'Permission to use camera'}
                        permissionDialogMessage={'We need your permission to use your camera phone'}
                        torchMode={openFlash ? RNCamera.constants.TorchMode.on:RNCamera.constants.TorchMode.off}
                        onBarCodeRead={(barcode) => {
                        var {type, data, bounds} = barcode;

                        if (data !== undefined && data !== null) {
                        this.state.newGoodInfo.codigo = data;
                        var newGoodInfo = this.state.newGoodInfo;
                        this.closeCamera(newGoodInfo);

                        }}
                        }
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


                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 0,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品简称:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                            <TextInput
                                style={{height: 40,backgroundColor:"white", color:"black",}}
                                onChangeText={(nombre) => {
                                    this.state.newGoodInfo.nombre = nombre;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={this.state.newGoodInfo.nombre}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>
                    {this.props.root?
                        <View style={[styles.row, {
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 0,
                            borderColor: '#aaa',
                            borderBottomColor: '#aaa'
                            ,
                            paddingLeft: 12,
                            paddingRight: 12
                        }]}>

                            <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text>商品全名:</Text>
                            </View>
                            <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                                <TextInput
                                    style={{height: 40,color:"black",}}
                                    onChangeText={(commodityName) => {
                                        this.state.newGoodInfo.commodityName = commodityName;
                                        var newGoodInfo = this.state.newGoodInfo;
                                        this.setState({newGoodInfo: newGoodInfo});
                                    }}
                                    value={this.state.newGoodInfo.commodityName}
                                    placeholder=''
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                        :
                        null


                    }



                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>商品含量:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40,backgroundColor:"white", color:"black",}}
                                onChangeText={(sizeValue) => {
                                    this.state.newGoodInfo.setSizeValue = sizeValue;
                                    var newGoodInfo = this.state.newGoodInfo;
                                    this.setState({newGoodInfo: newGoodInfo});
                                }}
                                value={this.state.newGoodInfo.setSizeValue.toString()}
                                placeholder=''
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>含量单位:</Text>
                        </View>
                        <View
                            style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>{sizeUnit}</Text>
                        </View>

                        <View style={{flex: 3, padding: 5}}>

                            <TouchableOpacity style={{justifyContent: 'center'}}
                                              onPress={() => {
                                                  this.show('actionSheet1');
                                              }}>
                                <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(o) => {
                                        this.actionSheet1 = o;
                                    }}
                                    title="请选择含量单位"
                                    options={sizeUnitButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data) => {
                                            this._handlePress1(data);
                                        }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={[styles.row, {
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12
                    }]}>

                        <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                            <Text>比价单位:</Text>
                        </View>
                        <View
                            style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Text>{scaleUnit}</Text>
                        </View>
                        <View style={{flex: 3, padding: 5}}>

                            <TouchableOpacity style={{justifyContent: 'center'}}
                                              onPress={
                                                  () => {
                                                      this.show('actionSheet2');
                                                  }}>
                                <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                <ActionSheet
                                    ref={(p) => this.actionSheet2 = p}
                                    title="请选择比价单位"
                                    options={scaleUnitButtons}
                                    cancelButtonIndex={CANCEL_INDEX}
                                    destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                    onPress={
                                        (data) => {
                                            this._handlePress2(data);
                                        }
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {this.props.root?
                        <View style={[styles.row, {
                            borderTopWidth: 1,
                            borderLeftWidth: 1,
                            borderRightWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: '#aaa',
                            borderBottomColor: '#aaa'
                            ,
                            paddingLeft: 12,
                            paddingRight: 12
                        }]}>

                            <View style={{flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                <Text>商品税类:</Text>
                            </View>
                            <View
                                style={{flex: 3, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                                <Text>{selectTax}</Text>
                            </View>
                            <View style={{flex: 3, padding: 5}}>

                                <TouchableOpacity style={{justifyContent: 'center'}}
                                                  onPress={
                                                      () => {
                                                          this.show('actionSheet3');
                                                      }}>
                                    <Icon name="chevron-circle-down" color="#aaa" size={30}></Icon>
                                    <ActionSheet
                                        ref={(q) => this.actionSheet3 = q}
                                        title="请选择商品税类"
                                        options={taxButtons}
                                        cancelButtonIndex={CANCEL_INDEX}
                                        destructiveButtonIndex={DESTRUCTIVE_INDEX}
                                        onPress={
                                            (data) => {
                                                this._handlePress3(data);
                                            }
                                        }
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        :
                        null

                    }



                    {/*店铺已选商品图片*/}
                    <View style={{
                        alignItems:"center",
                        justifyContent:"center",
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa',
                        height:height*0.3,
                    }}>
                        <View style={{position:"absolute",top:15}}>
                            <Text style={{fontSize:20}}>商品图像</Text>
                        </View>
                        <View style={{marginTop:10}}>
                            {this.state.bigPicUrl == null || this.state.bigPicUrl=="" ?
                                <Icon name="photo" size={140} color='rgb(112, 112, 112)'/>
                                :
                                <Image resizeMode="contain" style={{
                                    width: 200,
                                    height: height*0.2,
                                }}
                                       source={{uri: head+this.state.bigPicUrl+"?"+ts}}
                                />

                            }
                        </View>
                    </View>

                    {/*商品图像*/}
                    <View style={{
                        borderTopWidth: 1,
                        borderLeftWidth: 1,
                        borderRightWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: '#aaa',
                        borderBottomColor: '#aaa'
                        ,
                        paddingLeft: 12,
                        paddingRight: 12,
                        height:height*0.25,
                        justifyContent:"center"
                    }}>
                        <View style={{alignItems:"center",justifyContent:"center",marginTop:height*0.02}}>
                            <Text>备选图像</Text>
                        </View>
                        <ScrollView
                            // style={{borderWidth:1,borderColor:"green"}}
                            horizontal={true}
                            showsHorizontalScrollIndicator={true}
                        >
                            <TouchableOpacity
                                ref="picture1"
                                onPress={() => {
                                    this.selectPic(1);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(1);
                                    this.deleteButton(1);
                                }}
                            >
                                <View style={styles.picstyle}>
                                    {this.state.picUrl1 == null ?
                                        <IconI name="ios-add" size={40} color="#222"/>
                                        :
                                        <Image resizeMode="contain" style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                               source={{uri: head+this.state.picUrl1+"?"+ts}}
                                        />

                                    }
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture2"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.selectPic(2);
                                }}
                                onLongPress={() => {
                                    //this.onLongPress(2);
                                    this.deleteButton(2);
                                }}
                            >
                                {this.state.picUrl2 == null ?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl2+"?"+ts}}
                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture3"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.selectPic(3);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(3);
                                    this.deleteButton(3);
                                }}
                            >
                                {this.state.picUrl3 == null ? <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl3+"?"+ts}}
                                    />
                                }
                            </TouchableOpacity>
                            <TouchableOpacity
                                ref="picture4"
                                style={styles.picstyle}
                                onPress={() => {
                                    this.selectPic(4);
                                    //this.selectPic(4);
                                }}
                                onLongPress={() => {
                                    //this.onLongPress(4);
                                    this.deleteButton(4);
                                }}
                            >
                                {this.state.picUrl4 == null ?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl4+"?"+ts}}
                                    />
                                }
                            </TouchableOpacity>
                        </ScrollView>
                        {/*相机组件*/}
                        <Modal
                            animationType={"slide"}
                            transparent={false}
                            visible={this.state.cameraModalVisible}
                            onRequestClose={() => {
                                this.setState({cameraModalVisible: false});
                            }}
                        >
                            <Camera
                                ref={(ref) => {
                                    this.camera = ref;
                                }}
                                style={styles.preview}
                                playSoundOnCapture={false}
                                fixOrientation={true}
                                captureQuality="medium"
                                captureTarget={Camera.constants.CaptureTarget.temp}
                                aspect={Camera.constants.Aspect.fill}
                                permissionDialogTitle={'Permission to use camera'}
                                permissionDialogMessage={'We need your permission to use your camera phone'}
                            />
                            <View style={{
                                height: 100,
                                flexDirection: 'row',
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                            }}>
                                <TouchableOpacity
                                    onPress={() => this.takePicture()}
                                    style={[styles.capture, {
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    <IconE name="camera" color="#222" size={30}/>

                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.setState({cameraModalVisible: false})
                                    }}
                                    style={[styles.capture, {
                                        backgroundColor: 'transparent',
                                    }]}
                                >
                                    <IconE name="circle-with-cross" color="#222" size={30}/>

                                </TouchableOpacity>
                            </View>

                        </Modal>
                    </View>

                    {/*确认按钮*/}
                    <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: 20}}>
                        <TouchableOpacity style={{
                            flex: 1,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            backgroundColor: this.state.bgColor,
                            borderTopRightRadius: 4,
                            borderBottomRightRadius: 4,
                            alignItems: 'center',
                            padding: 8,
                            borderRadius: 4
                        }}
                                          disabled={this.state.wait}
                                          onPress={
                                              () => {
                                                  this.confirm();
                                              }}>
                            <Text style={{color: '#fff', fontSize: setSpText(16)}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                </ScrollView>





            </View>);
    }
    selectPic(picturenum) {//点击图片
        if(this.state.commodityId==null){
            alert("请先保存商品基本信息")
            return
        }
        var flag=this.checkGoodsBaseInfo();
        if (picturenum === 1) {
            if (this.state.picUrl1 == null) {
                if(flag!=false) {
                    this.setPicture(1);
                }
            } else {
                if(this.state.picUrl1 !=this.state.bigPicUrl)
                {
                    this.setState({currentNum:picturenum})
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 2) {
            if (this.state.picUrl2 == null) {
                if(flag!=false) {
                    this.setPicture(2);
                }

            } else {
                if(this.state.picUrl2 !=this.state.bigPicUrl)
                {
                    this.setState({currentNum:picturenum})
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 3) {
            if (this.state.picUrl3 == null) {
                if(flag!=false) {
                    this.setPicture(3);
                }
            } else {
                if(this.state.picUrl3 !=this.state.bigPicUrl)
                {
                    this.setState({currentNum:picturenum})
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 4) {
            if (this.state.picUrl4== null) {
                if(flag!=false) {
                    this.setPicture(4);
                }
            } else {
                if(this.state.picUrl4 !=this.state.bigPicUrl)
                {
                    this.setState({currentNum:picturenum})
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        // if (picturenum === 5) {
        //     if (this.state.picUrl5 === null) {
        //         this.setPicture(5);
        //     } else {
        //         this.setState({picNum: picturenum, bigPictureVisiable: true, pictureUri: this.state.picUrl5});
        //     }
        // }
    }

    startCodigo(){
        if(Platform.OS === 'ios') {
            if(Camera){
                Camera.checkDeviceAuthorizationStatus()
                    .then(access => {
                        if(!access) {
                            Alert.alert('相机权限没打开', '请在iPhone的设置中,允许访问您的摄像头')
                            this.setState({codigoCameraModalVisible:false})
                        }
                        else this.setState({codigoCameraModalVisible:true});
                    });
            }
        }
        else{
            this.setState({cameraModalVisible:true});
        }
    }

    //开启相机
    setPicture(picturenum) {

        if(Platform.OS === 'ios') {
            if(Camera){
                Camera.checkDeviceAuthorizationStatus()
                    .then(access => {
                        if(!access) {
                            Alert.alert('相机权限没打开', '请在iPhone的设置中,允许访问您的摄像头')
                            this.setState({cameraModalVisible:false})
                        }
                        else this.setState({cameraModalVisible: true, picNum: picturenum});
                    });
            }
        }
        else{
            this.setState({cameraModalVisible:true, picNum: picturenum});
        }
    }

    // 拍照获取照片
    takePicture = async function () {
        let picnum = this.state.picNum;
        let _this = this;

        if (this.camera) {
            try {
                // this.show("11");
                // const options = {quality: 0.2};
                let path = await this.camera.capture()
                    .then(function (data) {
                        return data.path;
                        // path = data.path;
                    })
                    .catch(err => this.show(err));
                // this.show("33");
                let base64S = await RNFS.readFile(path, 'base64')
                    .then((content) => {
                        return content;
                    })
                    .catch((err) => {
                        alert("unloading error: " + err);
                    });
                // this.show("22");
                var flag = this.uploadCommodityImage(picnum, base64S);

                if(flag==0){_this.setState({cameraModalVisible: false});return;}

                if (picnum === 1) {//ios拍照关闭不了modal，fuck
                    this.setState({picUrl1: path, cameraModalVisible: false});
                }
                if (picnum === 2) {
                    this.setState({picUrl2: path, cameraModalVisible: false});
                }
                if (picnum === 3) {
                    this.setState({picUrl3: path, cameraModalVisible: false});
                }
                if (picnum === 4) {
                    this.setState({picUrl4: path, cameraModalVisible: false});
                }
                // if (picnum === 5) {
                //     this.setState({picUrl5: path, cameraModalVisible: false});
                // }
                _this.setState({cameraModalVisible: false});
                // let permission = this.requestExternalStoragePermission(data);
            }
            catch
                (e) {
                console.log(e);
            }

        }
    };

    //上传图片
    uploadCommodityImage(picnum,fileData){
        proxy.postes({
            url: Config.server + '/func/comm/uploadAttachData',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ownerId: this.state.commodityId,
                fileData: fileData,
                beanName:"supnuevoCommonCommodityProcessRmi",
                folder:"supnuevo/commodity",
                fileName:this.state.newGoodInfo.codigo+'/'+picnum+".jpg",
                remark:"supnuevo",
                attachType:"90",
                imageWidth:480,
                imageHeight:640,
                paras:{merchantId:this.props.merchantId,index:picnum}
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("图片上传成功");

            }
            this.onCodigoSelect();
        }).catch((err) => {
            alert(err);
        });
    }

    //删除图片
    deleteButton(picnum){
        proxy.postes({
            url: Config.server + '/func/commodity/deleteSupnuevoCommonCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                merchantId: this.props.merchantId,
                commodityId:this.state.commodityId,
                index:picnum,
                isAdmin:"",
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("删除成功");
                if(this.state.currentNum==picnum){
                    this.setState({bigPicUrl:null})
                }
                this.onCodigoSelect();
            }
        }).catch((err) => {
            alert(err);
        });
    }

    //修改商品图片
    changeCommodityImage(picnum){
        proxy.postes({
            url: Config.server + '/func/commodity/changeSupnuevoCommonCommodityImage',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                merchantId: this.props.merchantId,
                commodityId:this.state.commodityId,
                index:picnum,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                this.setState({bigPicUrl:json.data.attachDataUrl})
                alert("设置成功");
                this.onCodigoSelect();
            }
        }).catch((err) => {
            alert(err);
        });
    }

    //通过codigo查询商品信息
    onCodigoSelect() {
        const merchantId = this.props.merchantId;
        var codigo = this.state.newGoodInfo.codigo;

        proxy.postes({
            url: Config.server + "/func/commodity/getSupnuevoBuyerPriceFormByCodigoMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codigo,
                supnuevoMerchantId: merchantId
            }
        }).then((json) => {


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
                console.log(json)
                var goodInfo = json.object;


                this.setState({
                    picUrl1:goodInfo.attachDataUrl1,picUrl2:goodInfo.attachDataUrl2,picUrl3:goodInfo.attachDataUrl3,picUrl4:goodInfo.attachDataUrl4,
                    attachDataUrl:goodInfo.attachDataUrl,newGoodInfo:goodInfo
                });


            }
        }).catch((err) => {
            alert(err);
        });
    }
}


var styles = StyleSheet.create({
    picstyle: {
        width: 100,
        height: 100,
        padding: 10,
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
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
    button: {
        width: 100,
        margin: 10,
        paddingTop: 15,
        paddingBottom: 15,
        color: '#fff',
        textAlign: 'center',
        backgroundColor: 'blue'
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
        backgroundColor:'#000',
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
        backgroundColor:'#000',
        opacity:0.5
    },
    bottomContainer:{
        alignItems:'center',
        backgroundColor:'#000',
        alignSelf:'center',
        opacity:0.5,
        flex:1,
        width:width
    },
    fillView:{
        width:(width-220)/2,
        height:220,
        backgroundColor:'#000',
        opacity:0.5
    },
    scan:{
        width:220,
        height:220,
        alignSelf:'center'
    }
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        merchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
        unionMemberType:state.user.unionMemberType,
        root: state.user.root,
    })
)(GoodAdd);

