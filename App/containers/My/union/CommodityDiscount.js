
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
const is_not_alive_icon = <Ionicons name={"md-radio-button-off"} size={25}/>;
const is_alive_icon = <Ionicons name={"md-checkmark-circle-outline"} size={25}/>;

class CommodityDiscount extends Component {
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

            // 扫码搜索
            searchIdx:1,

            goods1: {},
            commodity1:null,
            goodsList1: [],
            codigo1: null,
            commodityId1: null,
            amount1:0,
            commodityName:null,

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

    componentDidMount(): void {
        this.getSupnuevoBuyerUnionCommodityDiscountList();
    }

    render() {
        var {openFlash, searchIdx} = this.state;

        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/*header*/}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1,paddingLeft:10}}>
                            <TouchableOpacity
                                style={{flexDirection:'row',height:40,alignItems:'flex-end'}}
                                onPress={
                                    ()=>{
                                        this.cancel();
                                    }
                                }>
                                <Icon name="arrow-left" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                            Supnuevo(6.0)-{this.props.username}
                        </Text>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        </View>
                    </View>

                        <View style={{flex: 1}}>
                            {this._renderDiscountSelector()}
                            {this._renderDateSelector()}
                            {this._renderBaseCommodity()}
                            {this._renderAuxCommodity()}
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
            </ScrollView>)
    }

    // 折扣头部
    _renderDiscountSelector(){

        const {isDropDown, discountName} = this.state;

        return(
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flexDirection:'row', padding:10}}>
                    <TouchableOpacity
                        style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4'}}
                        onPress={()=>{
                            this.createOrUpdateSupnuevoBuyerUnionCommodityDiscount();
                        }}
                        ><Text>提交</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity*/}
                        {/*style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4',marginLeft:10}}*/}
                        {/*onPress={()=>{*/}
                            {/*this.createOrUpdateSupnuevoBuyerUnionCommodityDiscount();*/}
                        {/*}}><Text>提交</Text></TouchableOpacity>*/}
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:18}}>{discountName}</Text></View>
                    <TouchableOpacity
                        onPress={()=>{this.ckeckAlive(this.state.isAlive)}}
                        style={{position:"absolute",right:5}}
                    >
                        <View style={{flexDirection:"row",marginTop:8}}>
                            <View style={{paddingTop:5,marginRight:5}}><Text>是否启用</Text></View>
                            <View>{this.state.isAlive === 1?is_alive_icon:is_not_alive_icon}</View>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={{flexDirection:'row',marginLeft:10}}>
                    <ModalDropdown
                        style={styles.cell}
                        textStyle={styles.textstyle}
                        dropdownStyle={styles.dropdownstyle}
                        options={this.state.commodityDiscountList}
                        renderRow={this.dropdown_renderRow.bind(this)}
                        onSelect={(idx, value) => this.dropdown_onSelect(idx, value)}
                    >
                        <View style={styles.viewcell}>
                            <View style={{flex:1}}>
                                <TextInput
                                    style={styles.textInputStyle}
                                    onChangeText={(value) => {this.setState({discountName:value})}}
                                    value={this.state.discountName}
                                    placeholder='折扣名称'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                            {isDropDown?dropupIcon:dropdownIcon}
                        </View>
                    </ModalDropdown>
                    <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {this.addSupnuevoBuyerUnionCommodityDiscount()}}>
                            <Text style={{padding: 5, color: '#fff', fontSize: setSpText(22)}}>+</Text>
                        </TouchableOpacity>
                    </View>

                        <View style={{flex:1,paddingHorizontal:10}}>
                        <TouchableOpacity style={{
                            alignItems: 'center',
                            borderRadius: 4,
                            backgroundColor: '#8bb3f4'
                        }} onPress={() => {this.deleteSupnuevoBuyerUnionCommodityDiscount(this.state.discountId)}}>
                            <Text style={{padding: 5, color: '#fff', fontSize: setSpText(22)}}>-</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                </View>
            </View>
        );
    }

    //日期选择
    _renderDateSelector(){
        return(
            <View style={{flex:1}}>
                {/*<InputWithCalendar*/}
                    {/*title={"开始日期"}*/}
                    {/*date={this.state.startDate}*/}
                    {/*onDateChange={(value1)=>{*/}
                        {/*this.setState({startDate:value1});*/}
                    {/*}}/>*/}
                <InputWithCalendar
                    title={"结束日期"}
                    date={this.state.endDate}
                    onDateChange={(value2)=>{
                        this.setState({endDate:value2});
                    }}/>
            </View>
        );
    }

    //销售商品listview
    _renderBaseCommodity(){

        var list1=this.state.goodsList1

        let baseCommodityListView =
            list1 ?
                <View style={{alignItems:"center",justifyContent:"center"}}>
                    <SwipeListView
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.setState({listHeight: contentHeight})
                        }}
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(list1)}
                        renderRow={this.renderBaseCommodityRow.bind(this)}
                        swipeToOpenPercent={100}
                        scrollToEnd={true}
                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity onPress={() => {
                                    this.baseCommodityCountAdd()}
                                }><Text>数量+1</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() =>
                                    {this.baseCommodityCountSub()}
                                }><Text>数量-1</Text></TouchableOpacity>
                            </View>
                        )}
                        onRowOpen={this.onRowDidClose.bind(this)}
                        leftOpenValue={0.5}
                        rightOpenValue={-0.5}
                    />
                </View>:null;

        return(
            <View style={{flex:3,height:200}}>
                <View style={{padding: 10}}>
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
                <View style={{flex:2}}>
                    {baseCommodityListView}
                </View>
            </View>
        );
    }

    //赠送商品listview
    _renderAuxCommodity(){

        var list2=this.state.goodsList2;

        let auxCommodityListView =
            list2 ?
                <View style={{alignItems:"center",justifyContent:"center",marginTop:5}}>
                    <SwipeListView
                        onContentSizeChange={(contentWidth, contentHeight) => {
                            this.setState({listHeight: contentHeight})
                        }}
                        automaticallyAdjustContentInsets={false}
                        dataSource={ds.cloneWithRows(list2)}
                        renderRow={this.renderAuxCommodityRow.bind(this)}
                        swipeToOpenPercent={100}
                        scrollToEnd={true}
                        renderHiddenRow={(data, secId, rowId, rowMap) => (
                            <View style={styles.rowBack}>
                                <TouchableOpacity onPress={() => {
                                    this.auxCommodityCountAdd()
                                }}><Text>数量+1</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.auxCommodityCountSub()
                                }}><Text>数量-1</Text></TouchableOpacity>
                            </View>
                        )}
                        onRowOpen={this.onAuxRowDidClose.bind(this)}
                        leftOpenValue={0.5}
                        rightOpenValue={-0.5}
                    />
                </View>:null;

        return(
            <View style={{flex:3,height:height*0.35,borderWidth:1}}>
                <View style={{padding: 10}}>
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
                                        this.state.goods2.codeNum = codeNum;
                                        this.setState({goods2: this.state.goods2});
                                        //this.queryGoodsCode(codeNum.toString());
                                    }
                                    else {
                                        if (codeNum !== undefined && codeNum !== null) {
                                            this.state.goods2.codeNum = codeNum;
                                            this.setState({goods2: this.state.goods2});
                                        }
                                    }
                                }}
                                value={this.state.goods2.codeNum}
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
                                                  if (this.state.goods2.codeNum !== undefined && this.state.goods2.codeNum !== null) {
                                                      var codeNum = this.state.goods2.codeNum;
                                                      if (codeNum.toString().length >= 4 && codeNum.toString().length <= 13) {
                                                          this.setState({searchIdx:2});
                                                          this.queryGoodsCode(this.state.goods2.codeNum.toString());
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
                                                  this.setState({cameraModalVisible: true,searchIdx:2})
                                              }}>

                                <View>
                                    <Text style={{color: '#fff', fontSize: setSpText(16)}}>扫码</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
                <View style={{flexDirection:"row",justifyContent:"center"}}>
                    <View style={{paddingTop:8}}><Text style={{fontSize: setSpText(15)}}>优惠商品价格：</Text></View>
                    <TextInput
                        style={styles.priInput}
                        // placeholder={this.state.ratio}
                        // placeholderTextColor={"black"}
                        defaultValue={this.state.discountPrice.toString()}
                        underlineColorAndroid={"transparent"}
                        onChangeText={(value) => {
                            this.setState({discountPrice: value})
                        }}
                    />
                </View>
                <View style={{flex:2}}>
                    {auxCommodityListView}
                </View>
            </View>
        );
    }

    //销售商品单元行
    renderBaseCommodityRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={styles.comcell}>
                    {/*<View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>*/}
                        {/*<View style={{borderWidth:1,padding:3,marginRight:10}}><Text style={{fontSize:18}}>amount：{rowData.amount}</Text></View>*/}

                    {/*</View>*/}
                    {/*style={styles.circle}*/}
                    <View style={styles.circle}>
                        <Text>{this.state.amount1}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品条码：</Text>
                        <Text style={styles.renderText}>{rowData.codigo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品信息：</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{this.state.commodityName}</Text>
                    </View>
                    {/*<View style={{flexDirection: 'row'}}>*/}
                        {/*<Text style={styles.renderText}>当前状态：</Text>*/}
                        {/*<Text style={styles.renderText}>{this.state.commodityId1}</Text>*/}
                    {/*</View>*/}


                </View>
            </TouchableOpacity>;
        return row;
    }

    //销售商品数量+1
    baseCommodityCountAdd(){
        this.setState({amount1:this.state.amount1+1})
    }

    //销售商品数量-1
    baseCommodityCountSub(){
        if(this.state.amount1>0) {
            this.setState({amount1: this.state.amount1 - 1})
        }
        else{
            this.setState({amount1: 0})
        }
    }

    //赠送商品数量+1
    auxCommodityCountAdd(){
        this.setState({amount2:this.state.amount2+1})
    }

    //赠送商品数量-1
    auxCommodityCountSub(){
        if(this.state.amount2>0) {
            this.setState({amount2: this.state.amount2 - 1})
        }
        else{
            this.setState({amount2: 0})
        }
    }

    //赠送商品单元行
    renderAuxCommodityRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={styles.comcell}>
                    <View style={styles.circle}>
                        <Text>{this.state.amount2}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品条码：</Text>
                        <Text style={styles.renderText}>{rowData.codigo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品信息：</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={styles.renderText}>{this.state.discountCommodityName}</Text>
                    </View>
                    {/*<View style={{flexDirection: 'row'}}>*/}
                        {/*<Text style={styles.renderText}>当前状态：</Text>*/}
                        {/*<Text style={styles.renderText}>{this.state.commodityId2}</Text>*/}
                    {/*</View>*/}
                </View>
            </TouchableOpacity>;
        return row;
    }

    //滑动销售商品
    onRowDidClose(secId, rowId, rows, translateX) {
        var obj = Object.entries(rows);
        var obj_1 = obj[rowId];
        var Swiperow = obj_1[1];
        //alert(Swiperow._translateX._value);
        if (Swiperow._translateX._value > 0) {
            this.baseCommodityCountAdd()
        }
        else if (Swiperow._translateX._value < 0) {
            this.baseCommodityCountSub()
        }
    }

    //滑动赠送商品
    onAuxRowDidClose(secId, rowId, rows, translateX) {
        var obj = Object.entries(rows);
        var obj_1 = obj[rowId];
        var Swiperow = obj_1[1];
        //alert(Swiperow._translateX._value);
        if (Swiperow._translateX._value > 0) {
            this.auxCommodityCountAdd()
        }
        else if (Swiperow._translateX._value < 0) {
            this.auxCommodityCountSub()
        }
    }

    //下拉折扣名称
    dropdown_renderRow(rowData, rowID, highlighted){
        return (
            <TouchableOpacity >
                <View style={[styles.dropdown_row]}>
                    <Text style={[styles.dropdown_row_text, highlighted && {color: 'mediumaquamarine'}]}>
                        {rowData.discountName}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    //选中下拉列表某项
    dropdown_onSelect(idx, value){
        this.setState({discountName:value.discountName,discountId:value.discountId});
        this.getCommodityDiscountFormByDiscountId(value.discountId);
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
                    this.setState({goods1: goodInfo, codigo1: codigo, goodsList1: goodsList, commodityId1:commodityId});
                else
                    this.setState({goods2: goodInfo, codigo2: codigo, goodsList2: goodsList, commodityId2:commodityId});
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

    // 获取所有商品折扣的名称和Id
    getSupnuevoBuyerUnionCommodityDiscountList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionCommodityDiscountOptionInfoList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var dataList = json.data;
                this.setState({commodityDiscountList:dataList})
                    // ,goodsList1:dataList,goodsList2:dataList

            }
        }).catch((err)=>{alert(err);});
    }


    // 获取某个折扣信息
    getCommodityDiscountFormByDiscountId(discountId){
        // 获取某个折扣信息
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionCommodityDiscountFormByDiscountId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: discountId,
            }
        }).then((json)=> {
            if(json.re === 1){
                const {discount,commodity,discountCommodity} = json.data;
                var goodsList1 = [];goodsList1.push(commodity);
                var goodsList2 = [];goodsList2.push(discountCommodity);
                this.setState({commodityId1:json.data.commodity.commodityId,isAlive:json.data.isAlive,
                    amount1:json.data.amount,amount2:json.data.discountAmount,discountPrice:json.data.discountPrice,
                    commodityId2:json.data.discountCommodityId,endDate:json.data.endDateStr,
                    commodityName:json.data.commodityName,discountCommodityName:json.data.discountCommodityName,
                    goodsList1:goodsList1,goodsList2:goodsList2})
            }
        }).catch((err)=>{alert(err);});
    }

    //新建或修改商品折扣
    createOrUpdateSupnuevoBuyerUnionCommodityDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnionCommodityDiscount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountName:this.state.discountName,
                discountId: this.state.discountId,
                commodityId: parseInt(this.state.commodityId1),
                discountCommodityId: parseInt(this.state.commodityId2),
                // startDate: this.state.startDate,
                endDateStr: this.state.endDate,
                discountPrice:parseFloat(this.state.discountPrice),
                amount:this.state.amount1,
                discountAmount:this.state.amount2,
                isAlive:this.state.isAlive,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('提交成功');
            }
        }).catch((err)=>{alert(err);});
    }

    setSupnuevoBuyerUnionCommodityDiscountIsAlive(){
        proxy.postes({
            url: Config.server + "/func/union/setSupnuevoBuyerUnionCommodityDiscountIsAlive",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: this.state.discountId,
                isAlive: 1,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('success');
            }
        }).catch((err)=>{alert(err);});
    }

    //清空屏幕以输入新折扣信息数据
    addSupnuevoBuyerUnionCommodityDiscount(){
        this.setState({discountId:null,endData:null,commodityId1:null,commodityId2:null,discountName:null,
            isAlive:1,goodsList1:[],goodsList2:[]
        })
        this.state.goods1.codeNum=null
        this.state.goods2.codeNum=null

    }

    //删除某商品折扣
    deleteSupnuevoBuyerUnionCommodityDiscount(discountId){
        proxy.postes({
            url: Config.server + '/func/union/deleteSupnuevoBuyerUnionCommodityDiscount',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId:discountId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("删除成功");
                this.getSupnuevoBuyerUnionCommodityDiscountList()
            }
        }).catch((err) => {
            alert(err);
        });
    }

    //修改启用状态
    ckeckAlive(isAlive){
        if(isAlive==1){
            this.setState({isAlive:0})
        }
        if(isAlive==0){
            this.setState({isAlive:1})
        }
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
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius:20,
        justifyContent: 'flex-start',
        backgroundColor: '#fff',
        width:width*0.9,
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
        fontSize: setSpText(18),
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
    })
)(CommodityDiscount);
