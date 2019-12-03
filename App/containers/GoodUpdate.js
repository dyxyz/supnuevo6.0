/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import  {
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
    Platform
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import ActionSheet from 'react-native-actionsheet';
import {setSpText} from '../utils/ScreenUtil'
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
import Config from '../../config';
var head="https://supnuevo.s3.sa-east-1.amazonaws.com/";


class GoodUpdate extends Component {

    cancel() {
        //this.props.reset();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    goBack() {
        var code = {codigo: this.state.selectedCodeInfo.codigo};
        this.props.onCodigoSelect(code);
        this.props.setHasCodigo();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    confirm() {
        //修改信息
        if (this.state.selectedCodeInfo != undefined && this.state.selectedCodeInfo != null) {
            if (this.state.selectedCodeInfo.codigo === null || this.state.selectedCodeInfo.codigo === undefined || this.state.selectedCodeInfo.codigo === '') {
                alert("商品条码不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.taxId === null || this.state.selectedCodeInfo.taxId === undefined || this.state.selectedCodeInfo.taxId === '') {
                alert("商品税类不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.nombre === null || this.state.selectedCodeInfo.nombre === undefined || this.state.selectedCodeInfo.nombre === '') {
                alert("商品名称不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.nombre !== null || this.state.selectedCodeInfo.nombre !== undefined || this.state.selectedCodeInfo.nombre !== '') {
                if (this.state.selectedCodeInfo.nombre.length < 10) {
                    alert("商品名称不能少于10位");
                    return false;
                }
            }

            if (this.state.selectedCodeInfo.setSizeValue === null || this.state.selectedCodeInfo.setSizeValue === undefined || this.state.selectedCodeInfo.setSizeValue === '') {
                alert("商品含量不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.sizeUnit === null || this.state.selectedCodeInfo.sizeUnit === undefined || this.state.selectedCodeInfo.sizeUnit === '') {
                alert("含量单位不能为空");
                return false;
            }
            if (this.state.selectedCodeInfo.scaleUnit === null || this.state.selectedCodeInfo.scaleUnit === undefined || this.state.selectedCodeInfo.scaleUnit === '') {
                alert("比价单位不能为空");
                return false;
            }
            this.setState({wait:true,bgColor:'#D4D4D4'});

            var sessionId = this.props.sessionId;
            proxy.postes({
                url: Config.server + '/func/commodity/saveOrUpdateSupnuevoCommonCommodityMobile',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    taxId: this.state.selectedCodeInfo.taxId,
                    supnuevoMerchantId: this.state.merchantId,
                    codigo: this.state.selectedCodeInfo.codigo,
                    nombre: this.state.selectedCodeInfo.nombre.toUpperCase(),
                    sizeValue: this.state.selectedCodeInfo.setSizeValue,
                    sizeUnited: this.state.selectedCodeInfo.sizeUnit,
                    scaleUnited: this.state.selectedCodeInfo.scaleUnit
                }
            }).then((json)=> {
                var errorMsg = json.errorMsg;
                var message = json.message;
                this.setState({wait:false,bgColor:'#11c1f3'});
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                }
                if (message !== null && message !== undefined && message !== "") {
                    alert(message);
                    this.goBack();
                }

            }).catch((err) => {
                this.setState({wait:false,bgColor:'#11c1f3'});
                alert(err);
            });

        }


    }

    constructor(props) {
        super(props);
        this.state = {
            goods: {},
            printType: {type1: '1', type2: '0', type3: '0', type4: '0'},
            onCodigoSelect: props.onCodigoSelect,
            merchantId: props.merchantId,
            selectedCodeInfo: props.goodInfo,
            taxArr: props.taxArr,
            sizeArr: props.sizeArr,
            scaleArr: [],
            wait:false,
            bgColor:'#11c1f3',

            cameraModalVisible: false,
            picUrl1: this.props.attachDataUrl1,//base64格式显示图片，或者是图片地址
            picUrl2: this.props.attachDataUrl2,
            picUrl3: this.props.attachDataUrl3,
            picUrl4: this.props.attachDataUrl4,
            bigPicUrl:this.props.attachDataUrl,
            // picUrl5: null,
            picNum: null,//目前选择的第几个图片
            pictureUri: null,//查看大图的base64或者uri
        };

    }

    _handlePress1(index) {

        var sizeUnit = this.state.selectedCodeInfo.sizeUnit;
        if (index > 0) {
            this.state.selectedCodeInfo.sizeUnit = this.state.sizeArr[index - 1].label;
            var selectedCodeInfo = this.state.selectedCodeInfo;
            var sizeUnit = this.state.selectedCodeInfo.sizeUnit;
            this.setState({selectedCodeInfo: selectedCodeInfo});
        }
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoScaleInfoListMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            // body: "sizeUnit=" + sizeUnit + "&merchantId=" + this.state.merchantId
            body: {
                sizeUnit: sizeUnit,
                merchantId: this.state.merchantId
            }
        }).then((json)=> {
            var scaleArr = new Array();
            json.scaleArr.map(function (index, i) {
                scaleArr.push(index);
            })

            this.state.selectedCodeInfo.scaleUnit = '';
            var selectedCodeInfo = this.state.selectedCodeInfo;
            this.setState({selectedCodeInfo: selectedCodeInfo,scaleArr: scaleArr});

        }).catch((err) => {
            alert(err);
        });
    }

    _handlePress2(index) {
        if(index>0) {
            this.state.selectedCodeInfo.scaleUnit = this.state.scaleArr[index - 1].label;
            var selectedCodeInfo = this.state.selectedCodeInfo;
            this.setState({selectedCodeInfo: selectedCodeInfo});
        }


    }

    _handlePress3(index) {
        if(index>0) {
            this.state.selectedCodeInfo.taxId = index - 1;
            var selectedCodeInfo = this.state.selectedCodeInfo;
            this.setState({selectedCodeInfo: selectedCodeInfo});
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


    render() {

        var selectedCodeInfo = this.state.selectedCodeInfo;
        if (selectedCodeInfo.setSizeValue !== undefined && selectedCodeInfo.setSizeValue !== null) {
            selectedCodeInfo.setSizeValue = selectedCodeInfo.setSizeValue.toString();
        }

        var codigo = selectedCodeInfo.codigo;
        var name = selectedCodeInfo.nombre;
        var sizeValue = selectedCodeInfo.setSizeValue;

        var sizeUnit = selectedCodeInfo.sizeUnit;
        var scaleUnit = selectedCodeInfo.scaleUnit;
        var selectTax = '';

        const CANCEL_INDEX = 0;
        const DESTRUCTIVE_INDEX = 1;
        const buttons = ['取消', '确认退出', '😄😄😄', '哈哈哈'];
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
            if ((index.value - 1) == selectedCodeInfo.taxId) {
                selectTax = index.label;
            }
        })
        this.state.scaleArr.map(function (index, i) {
            scaleUnitButtons.push(index.label);
        })


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
                    <Text style={{fontSize: setSpText(17), flex: 3, textAlign: 'center', color: '#fff'}}>
                        修改商品
                    </Text>
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
                            <Text >商品内码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                        </View>
                    </View>


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
                            <Text >商品条码:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <Text>
                                {codigo}
                            </Text>
                        </View>
                    </View>


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
                            <Text >商品名称:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>

                            <TextInput
                                style={{height: 40}}
                                onChangeText={(nombre) => {
                                    this.state.selectedCodeInfo.nombre = nombre;
                                    var selectedCodeInfo = this.state.selectedCodeInfo;
                                    this.setState({selectedCodeInfo: selectedCodeInfo});
                                }}
                                value={this.state.selectedCodeInfo.nombre}
                                placeholder={name}
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
                            <Text >商品含量:</Text>
                        </View>
                        <View style={{flex: 6, padding: 5, justifyContent: 'center'}}>
                            <TextInput
                                style={{height: 40}}
                                onChangeText={(sizeValue) => {
                                    this.state.selectedCodeInfo.setSizeValue = sizeValue;
                                    var selectedCodeInfoNew = this.state.selectedCodeInfo;
                                    this.setState({selectedCodeInfo: selectedCodeInfoNew});
                                }}
                                value={(selectedCodeInfo.setSizeValue !== undefined && selectedCodeInfo.setSizeValue !== null)
                                    ? selectedCodeInfo.setSizeValue + '' : ''}
                                placeholder={sizeValue}
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
                            <Text >含量单位:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{sizeUnit}</Text>
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
                            <Text >比价单位:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{scaleUnit}</Text>
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
                            <Text >商品税类:</Text>
                        </View>
                        <View style={{
                            flex: 3,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            paddingLeft: 12
                        }}>
                            <Text >{selectTax}</Text>
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
                        <View style={{marginTop:50}}>
                            {this.state.bigPicUrl == null || this.state.bigPicUrl=="" ?
                                <Icon name="photo" size={140} color="#222"/>
                                :
                                <Image resizeMode="contain" style={{
                                    width: 200,
                                    height: height*0.2,
                                }}
                                       source={{uri: head+this.state.bigPicUrl}}
                                />

                            }
                        </View>

                    </View>

                    {/*备选商品图像*/}
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
                                    {this.state.picUrl1 == null || this.state.picUrl1=="" ?
                                        <IconI name="ios-add" size={40} color="#222"/>
                                        :
                                        <Image resizeMode="contain" style={{
                                            width: 100,
                                            height: 100,
                                        }}
                                               source={{uri: head+this.state.picUrl1}}
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
                                {this.state.picUrl2 == null || this.state.picUrl1==""?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl2}}
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
                                {this.state.picUrl3 == null || this.state.picUrl1==""? <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl3}}
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
                                {this.state.picUrl4 == null || this.state.picUrl1==""?
                                    <IconI name="ios-add" size={40} color="#222"/>
                                    :
                                    <Image resizeMode="contain" style={{
                                        width: 100,
                                        height: 100,
                                    }}
                                           source={{uri: head+this.state.picUrl4}}
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
                            <Text style={{color: '#fff', fontSize: setSpText(17)}}>确认</Text>
                        </TouchableOpacity>
                    </View>

                </View>
                </ScrollView>
            </View>);
    }
    selectPic(picturenum) {//点击图片
        if (picturenum === 1) {
            if (this.state.picUrl1 == null) {
                this.setPicture(1);
            } else {
                if(this.state.picUrl1 !=this.state.bigPicUrl)
                {
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 2) {
            if (this.state.picUrl2 == null) {
                this.setPicture(2);
            } else {
                if(this.state.picUrl2 !=this.state.bigPicUrl)
                {
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 3) {
            if (this.state.picUrl3 == null) {
                this.setPicture(3);
            } else {
                if(this.state.picUrl3 !=this.state.bigPicUrl)
                {
                    this.changeCommodityImage(picturenum)
                }
            }
        }
        if (picturenum === 4) {
            if (this.state.picUrl4== null) {
                this.setPicture(4);
            } else {
                if(this.state.picUrl4 !=this.state.bigPicUrl)
                {
                    this.changeCommodityImage(picturenum)
                }
            }
        }
    }

    //开启相机
    setPicture(picturenum) {
        this.setState({cameraModalVisible: true, picNum: picturenum});
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
                // Alert.alert("111")
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
                ownerId: this.props.commodityId,
                fileData: fileData,
                beanName:"supnuevoCommonCommodityProcessRmi",
                folder:"supnuevo/commodity",
                fileName:this.props.goodInfo.codigo+'/'+picnum+".jpg",
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
                //this.closeCamera();
                alert("图片上传成功");
                this.onCodigoSelect();
            }
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
                commodityId:this.props.commodityId,
                index:picnum,
                isAdmin:"",
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                if(json.data!=null && json.data!=undefined && json.data!=""){
                    alert(json.data)
                }
                else {
                    alert("删除成功");
                    this.onCodigoSelect();
                }
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
                commodityId:this.props.commodityId,
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
        var codigo = this.props.goodInfo.codigo;

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
                var goodInfo = json.object;


                this.setState({
                    picUrl1:goodInfo.attachDataUrl1,picUrl2:goodInfo.attachDataUrl2,picUrl3:goodInfo.attachDataUrl3,picUrl4:goodInfo.attachDataUrl4,
                    attachDataUrl:goodInfo.attachDataUrl
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
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
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
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
    })
)(GoodUpdate);

