
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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ModalDropdown from 'react-native-modal-dropdown';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Config from "../../../../config";

const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const dropdownWidth = width * 2/3;

var proxy = require('../../../proxy/Proxy');

class OrderDiscount extends Component {
    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            discountName: '折扣名称',
            discountId: null,
            startDate: null,
            endData: null,
            total1: null,
            scale1: null,
            total2: null,
            scale2: null,
            total3: null,
            scale3: null,
        }
    }

    componentDidMount(): void {
        this.getSupnuevoBuyerUnionOrderDiscountOfUnion();
    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/*header*/}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1,paddingLeft:10}}>
                            <TouchableOpacity
                                style={{flexDirection:'row',height:40,alignItems:'flex-end'}}
                                onPress={()=>{this.cancel();}}>
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
                        {this._renderWeightPercent()}
                    </View>

                </View>
            </ScrollView>)
    }

    _renderDiscountSelector(){

        const {discountName} = this.state;

        return(
            <View style={{flex:1,flexDirection:'column'}}>
                <View style={{flexDirection:'row', padding:10}}>
                    <TouchableOpacity
                        style={{marginLeft:width*0.04,borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4'}}
                        onPress={()=>{
                            this.saveSupnuevoBuyerUnionOrderDiscount()
                        }}
                    >
                        <Text>启用</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity*/}
                        {/*style={{borderWidth:1,padding:3,paddingHorizontal:8,borderRadius:3,backgroundColor:'#8bb3f4',marginLeft:10}}*/}
                        {/*onPress={()=>{*/}
                            {/*this.saveSupnuevoBuyerUnionOrderDiscount();*/}
                        {/*}}>*/}
                        {/*<Text>提交</Text>*/}
                    {/*</TouchableOpacity>*/}
                    {/*<View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{fontSize:18}}>订单总额折扣</Text></View>*/}
                </View>

                <View style={{flexDirection:'row',marginLeft:10,alignItems:"center",justifyContent:"center"}}>
                        <View style={{marginRight:width*0.08}}>
                            <Text>折扣名称</Text>
                        </View>
                        <View style={styles.viewcell}>
                            <View>
                                <TextInput
                                    style={{height:height*0.06,width:width*0.4}}
                                    value={discountName}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(value) => {this.setState({discountName:value})}}
                                />
                            </View>
                        </View>
                </View>
            </View>
        );
    }

    _renderDateSelector(){
        return(
            <View style={{flex:1}}>
                <InputWithCalendar
                    title={"开始日期"}
                    date={this.state.startDate}
                    onDateChange={(value1)=>{
                        this.setState({startDate:value1});
                    }}/>
                <InputWithCalendar
                    title={"结束日期"}
                    date={this.state.endDate}
                    onDateChange={(value2)=>{
                        this.setState({endDate:value2});
                    }}/>
            </View>
        );
    }

    _renderWeightPercent(){
        return(
            <View style={{height:300,padding:10}}>
                {/*表头*/}
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:2}}><Text style={styles.textStyle}>购买总金额</Text></View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}/>
                    <View style={{flex:2}}><Text style={styles.textStyle}>折扣</Text></View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}/>
                </View>
                {/*percent1*/}
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({total1:value})}}
                            value={this.state.total1}
                            placeholder='total1'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>-</Text></View>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({scale1:value})}}
                            value={this.state.scale1}
                            placeholder='scale1'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>%</Text></View>
                </View>

                {/*percent2*/}
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({total2:value})}}
                            value={this.state.total2}
                            placeholder='total2'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>-</Text></View>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({scale2:value})}}
                            value={this.state.scale2}
                            placeholder='scale2'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>%</Text></View>
                </View>

                {/*percent3*/}
                <View style={{flex:1,justifyContent:'center',alignItems:'center',flexDirection:'row'}}>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({total3:value})}}
                            value={this.state.total3}
                            placeholder='total3'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>-</Text></View>
                    <View style={{flex:2,justifyContent:'center',alignItems:'center'}}>
                        <TextInput
                            style={styles.textInputStyle}
                            onChangeText={(value) => {this.setState({scale3:value})}}
                            value={this.state.scale3}
                            placeholder='scale3'
                            placeholderTextColor="#aaa"
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={styles.textStyle}>%</Text></View>
                </View>
            </View>
        );
    }

    getSupnuevoBuyerUnionOrderDiscountOfUnion(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionOrderDiscountForm",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var discount = json.data;
                this.setState({
                    discountName:discount.discountName,
                    startDate:discount.startDateStr,endDate:discount.endDateStr,
                    total1:discount.total1+"",scale1:discount.scale1+"",
                    total2:discount.total2+"",scale2:discount.scale2+"",
                    total3:discount.total3+"",scale3:discount.scale3+""})
            }
        }).catch((err)=>{alert(err);});
    }

    setSupnuevoBuyerUnionOrderDiscountIsAlive(){
        proxy.postes({
            url: Config.server + "/func/union/setSupnuevoBuyerUnionOrderDiscountIsAlive",
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
                alert('success')
            }
        }).catch((err)=>{alert(err);});
    }

    saveSupnuevoBuyerUnionOrderDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnionOrderDiscount",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                discountId: this.state.discountId,
                discountName: this.state.discountName,
                startDateStr: this.state.startDate,
                endDateStr: this.state.endDate,
                total1: parseFloat(this.state.total1),
                scale1: parseFloat(this.state.scale1),
                total2: parseFloat(this.state.total2),
                scale2: parseFloat(this.state.scale2),
                total3: parseFloat(this.state.total3),
                scale3: parseFloat(this.state.scale3),
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('保存成功')
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
        alignItems:'center',
        textAlign:'center',
        width:width*0.2,
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
        // paddingHorizontal:5,
        // alignItems:'center',
        height:35,
        paddingLeft:width*0.2,
        // justifyContent:'center',
        flexDirection:'row',
    },
    cell: {
        width:dropdownWidth,
        alignItems:'center',
        flexDirection:'row',
        height:35,
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
    textStyle:{
        fontSize:18,
        textAlign:'center'
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
        unionId:state.user.unionId,
    })
)(OrderDiscount);

