
import React, {Component} from 'react';
import {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    Platform,
    FlatList
} from 'react-native';
import {connect} from 'react-redux';
import {setSpText} from '../../../utils/ScreenUtil'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalDropdown from 'react-native-modal-dropdown';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Config from "../../../../config";
import {loginAction} from "../../../action/actionCreator";
import CodesModal from '../../../components/modal/CodesModal';
import RNCamera from "react-native-camera";
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const dropdownWidth = width * 2/3;
const dropdownIcon = <Ionicons name={'md-arrow-dropdown'} size={22}/>;
const dropupIcon = <Ionicons name={'md-arrow-dropup'} size={22}/>;

var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var proxy = require('../../../proxy/Proxy');

class ModifyTime extends Component {
    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            discountPrice:0,
            listHeight: 0,
            showDropDown:false,
            commodityDiscountList:[],
            discountName:'',
            discountId:null,
            startDate:null,
            endData:null,
            baseCommodityList: [],
            auxCommodityList: [],
            isAlive:1,
            discountCode:'',
            discountPrompt:'',
            priceId:null,
            modifyList:[],

            // 扫码搜索
            searchIdx:1,

            goods1: {},
            commodity1:null,
            goodsList1: [],
            codigo1: null,
            commodityId1: null,
            amount1:0,
            commodityName:null,
            price:null,

            goods2: {},
            commodity2:null,
            goodsList2: [],
            codigo2:null,
            commodityId2:null,
            amount2:0,
            price2:null,
            discountCommodityName:null,

            wait: false,
            codesModalVisible: false,
            camera: {},
            cameraModalVisible: false,
            openFlash: false,
            showProgress: false,
        }
    }

    // componentDidMount(): void {
    //     this.getSupnuevoBuyerUnionCommodityDiscountList();
    // }

    render() {
        var {openFlash, searchIdx} = this.state;

        return (
            <View style={{flex: 1}}>
                {/*header*/}
                <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TouchableOpacity
                            style={{flexDirection:'row',height:40,paddingTop:5}}
                            onPress={
                                ()=>{
                                    this.cancel();
                                }
                            }>
                            <Icon name="arrow-left" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <View>
                        <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                            Supnuevo(6.0)-{this.props.username}
                        </Text>
                    </View>
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>


                <View style={{height:'auto',alignItems:'center'}}>
                    {this._renderBaseCommodity()}

                </View>

                <View style={{flex:1,marginTop:5,borderTopWidth: 1,borderColor: '#ddd',}}>
                    <FlatList
                        data={this.state.modifyList}
                        renderItem={({item,index})=>this._renderItem(item,index)}
                    />
                </View>



                {/*条码*/}
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
                {/*相机*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
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
                            this.closeCamera();
                            var {type, data, bounds} = barcode;
                            if (data !== undefined && data !== null) {
                                console.log('barcode data=' + data + 'barcode type=' + type);
                                if(searchIdx == 1) {
                                    this.state.goods1.codeNum = data;
                                    var goods = this.state.goods1;
                                    goods.codeNum = data;
                                    setTimeout(() => this.queryGoodsCode(data), 1000)
                                }else{
                                    this.state.goods2.codeNum = data;
                                    var goods = this.state.goods2;
                                    goods.codeNum = data;
                                    setTimeout(() => this.queryGoodsCode(data), 1000)
                                }
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
            </View>
        )
    }



    //销售商品listview
    _renderBaseCommodity(){

        return(
            <View style={{height:'auto',alignItems:'center'}}>
                <View style={{padding: 10,height:height*0.1}}>
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
                                    paddingBottom: 6,
                                    color:"black",
                                }}
                                onChangeText={(codeNum1) => {
                                    if (codeNum1.toString().length == 13 || codeNum1.toString().length == 12 || codeNum1.toString().length == 8) {
                                        this.state.goods1.codeNum = codeNum1;
                                        this.setState({goods1: this.state.goods1});
                                        //this.queryGoodsCode(codeNum.toString());
                                    }
                                    else {
                                        if (codeNum1 !== undefined && codeNum1 !== null) {
                                            this.state.goods1.codeNum = codeNum1;
                                            this.setState({goods1: this.state.goods1});
                                        }
                                    }
                                }}
                                value={this.state.goods1.codeNum}
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
                                                  if (this.state.goods1.codeNum !== undefined && this.state.goods1.codeNum !== null) {
                                                      var codeNum = this.state.goods1.codeNum;
                                                      if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                          this.setState({searchIdx:1});
                                                          this.queryGoodsCode(this.state.goods1.codeNum.toString());
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
                                                  this.setState({cameraModalVisible: true,searchIdx:1})
                                              }}>

                                <View>
                                    <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>

            </View>
        );
    }

    _renderItem(rowData,index){
        return(
                <View style={{
                    height: 'auto',
                    flexDirection: "row",
                    padding: 10,
                    borderBottomWidth: 1,
                    borderColor: '#ddd',
                    justifyContent: 'flex-start',
                    backgroundColor: '#fff',
                    width: width,
                }}>
                    <View style={{flex: 6, justifyContent: "center"}}>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.renderText}>店铺ID：</Text>
                            <Text style={styles.renderText}>{rowData.merchantId}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.renderText}>店铺名称：</Text>
                            <Text style={styles.renderText}>{rowData.shopName}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.renderText}>商品价格：</Text>
                            <Text style={styles.renderText}>{rowData.price}</Text>
                        </View>
                        <View style={{flexDirection: 'row'}}>
                            <Text style={styles.renderText}>改价时间：</Text>
                            <Text style={styles.renderText}>{rowData.priceTime}</Text>
                        </View>
                    </View>


                </View>
        );
    }

    //通过输入条码模糊查询
    queryGoodsCode(codeNum) {
        const {merchantId} = this.props;
        proxy.postes({
            url: Config.server + '/func/commodity/getQueryDataListByInputStringMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codeNum,
                merchantId: merchantId
            }
        }).then((json) => {
            console.log(json)

            if(json.re == -2){
                this.props.dispatch(loginAction(username, password))
            }

            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
            else {
                //this.reset();
                if (json.array !== undefined && json.array !== null && json.array.length > 0) {
                    var codes = json.array;
                    this.setState({codes: codes, codesModalVisible: true});
                }
                else {
                    var code = {codigo: json.object.codigo, commodityId: json.object.commodityId};
                    this.onCodigoSelect(code);
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    //精确查询对应条码商品信息
    onCodigoSelect(code) {
        this.setState({discountCode:null,discountPrompt:null,priceId:null,commodityName:null,price:null})
        var {codigo, commodityId} = code;

        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceByCommodityId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId,
                unionId: this.props.unionId,
            }
        }).then((json) => {
            console.log(json)
            if(json.re === 1){
                // if(json.data == null){
                //     if(this.state.searchIdx === 1)this.resetGoods1();
                //     else this.resetGoods2();
                //     return;
                // }

                var goodInfo = json.data;
                var goodsList = [];
                if (goodInfo.setSizeValue != undefined && goodInfo.setSizeValue != null
                    && goodInfo.sizeUnit != undefined && goodInfo.sizeUnit != null) {
                    goodInfo.nombre = goodInfo.nombre + ',' + goodInfo.setSizeValue + ',' + goodInfo.sizeUnit;
                }
                goodInfo.codeNum = codigo;
                goodsList.push(goodInfo);
                if(this.state.searchIdx === 1)
                    this.setState({goods1: goodInfo, codigo1: codigo, goodsList1: goodsList, commodityId1:commodityId,discountCode:goodInfo.discountCode,discountPrompt:goodInfo.discountPrompt,priceId:goodInfo.priceId,commodityName:goodInfo.commodityName,price:goodInfo.price});
                else{
                    this.setState({goods2: goodInfo, codigo2: codigo, goodsList2: goodsList, commodityId2:commodityId,discountCode:goodInfo.discountCode,discountPrompt:goodInfo.discountPrompt,priceId:goodInfo.priceId,commodityName:goodInfo.commodityName,price:goodInfo.price});
                }
                this.getSupnuevoBuyerUnionModifyPriceList(commodityId)
            }
            // else {this.resetGoods1();this.resetGoods2();}
        }).catch((e) => {
            this.setState({codesModalVisible: false});
        });
    }


    changeFlash() {
        this.setState({
            openFlash: !this.state.openFlash,
        });
    }

    closeCodesModal(val) {
        this.setState({codesModalVisible: val, goods1: {},goods2: {}});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    getSupnuevoBuyerUnionModifyPriceList(commodityId){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerPriceModifyList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                commodityId:commodityId,
            }
        }).then((json)=> {
            console.log(json)
            if(json.re === 1){
                var dataList = json.data;
                this.setState({modifyList:dataList})
            }
        }).catch((err)=>{alert(err);});
    }



}


var styles = StyleSheet.create
({
    text: {
        fontSize: setSpText(20),
        paddingLeft: 10,
        borderColor: '#DEDEDE',
        borderLeftWidth: 1,
        marginLeft:5,
    },
    rowBack: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    priInput:{
        borderWidth:1,
        borderRadius:width*0.03,
        width:width*0.6,
        height:height*0.055,
    },
    comcell:{
        // flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius:20,
        // justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width:width*0.9,
        height:'auto',
        justifyContent:'center'
    },
    touch: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#DEDEDE',
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
    circle:{
        position:"absolute",
        right:width*0.005,
        borderWidth:1,
        width:20,
        borderRadius:width*2,
        alignItems:"center",
        justifyContent:"center"
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
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    textInputStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    textstyle: {
        fontSize: 13,
        textAlign: 'center',
        color:'#646464',
        justifyContent:'center',
    },
    dropdownstyle: {
        height: 150,
        width:dropdownWidth,
        borderColor: '#cdcdcd',
        borderWidth: 0.7,
    },
    dropdown_row: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
    },
    dropdown_row_text: {
        fontSize: 13,
        color: '#646464',
        textAlignVertical: 'center',
        justifyContent:'center',
        marginLeft: 5,
    },
    dropdown_image: {
        width: 20,
        height: 20,
    },
    viewCell: {
        height: 50,
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    viewcell: {
        width:dropdownWidth,
        borderWidth:1,
        paddingHorizontal:5,
        alignItems:'center',
        height:height*0.059,
        justifyContent:'center',
        flexDirection:'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:height*0.06,
        borderRightColor:'#cdcdcd',
        borderRightWidth:0.7,

    },
    renderText: {
        fontSize: setSpText(16),
        alignItems: 'center'
    },
    row: {
        flexDirection: 'row',
        height: 50,
        width: width,
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
        unionId: state.user.unionId,
        unionMemberType:state.user.unionMemberType,
    })
)(ModifyTime);

