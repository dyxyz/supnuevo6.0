/**
 * Created by dingyiming on 2017/7/25.
 */
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
    View,
    Alert,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from 'react-native-camera';
import Communications from 'react-native-communications';
import {setSpText} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');

class VentasDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            ventasInfo: this.props.ventasInfo,
            phoneList:[],
        }
    }

    goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
        }

    }

    fetchData() {

    }

    renderRubroRow(rowData) {

            var row = (
                    <View style={{
                        flex: 1,
                    }}>
                        <Text style={{color:'#000',fontSize:setSpText(18)}}>{rowData}</Text>
                    </View>
            )
        return row;
    }

    renderPhoneRow(rowData) {
        var row = (
            <TouchableOpacity
                style={{flex:1,flexDirection:'row',paddingTop:10,borderBottomWidth:1,borderColor:'#aaa'}}
                onPress={()=>{
                                Communications.phonecall(rowData,false)
                            }}>
                <Icon name="phone" size={23} color="blue"/>
                <Text style={{fontSize:setSpText(18),color:'blue',marginLeft:5}}>{rowData}</Text>
            </TouchableOpacity>
        )
        return row;
    }

    renderDelivergoodRow(rowData) {

        var row = (
            <View style={{
                        flex:1,
                        width:width-40,
                        borderWidth:1,
                        borderRadius:10,
                        borderColor:'#aaa',
                        flexDirection:'column',
                        padding:10,
                        marginBottom:10,
                    }}>
                <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>配送区域：</Text></View>
                    <View style={{flex:2}}><Text style={{fontSize:setSpText(16),color:'#000'}}>{rowData.address}</Text></View>
                </View>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>送货运输费：</Text></View>
                    <View style={{flex:2}}><Text style={{fontSize:setSpText(16),color:'#000'}}>{rowData.deliverFee}</Text></View>
                </View>
                <View style={{flex:1,flexDirection:'row'}}>
                    <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>最低购买量：</Text></View>
                    <View style={{flex:2}}><Text style={{fontSize:setSpText(16),color:'#000'}}>{rowData.minAmount}</Text></View>
                </View>
            </View>
        )
        return row;
    }


    render() {

        var ventasInfo = this.props.ventasInfo;
        var rubroList = [];
        var phoneList = [];
        var deliverGood = ventasInfo.deliverGood;

        if(ventasInfo.rubroDes!=null && ventasInfo.rubroDes!=undefined)
        rubroList = ventasInfo.rubroDes.split(';');

        var rubroListView = null;
        if (rubroList !== undefined && rubroList !== null && rubroList.length>0) {
            var ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            rubroListView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds1.cloneWithRows(rubroList)}
                    renderRow={this.renderRubroRow.bind(this)}
                />
        }else{
            rubroListView=<View/>
        }

        if(ventasInfo.telefono!=null && ventasInfo.telefono!=undefined)
            phoneList = ventasInfo.telefono.split('/');

        var phoneListView = null;
        if (phoneList !== undefined && phoneList !== null && phoneList.length>0) {
            var ds2 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            phoneListView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds2.cloneWithRows(phoneList)}
                    renderRow={this.renderPhoneRow.bind(this)}
                />
        }else{
            phoneListView=<View/>
        }

        var deliverGoodListView = null;
        if (deliverGood !== undefined && deliverGood !== null && rubroList.length>0) {
            var ds3 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            deliverGoodListView =
                <ListView
                    automaticallyAdjustContentInsets={true}
                    dataSource={ds3.cloneWithRows(deliverGood)}
                    renderRow={this.renderDelivergoodRow.bind(this)}
                />
        }else{
            deliverGoodListView=<View/>
        }

        return (
        <View style={{flex:1}}>

            {/*header*/}
            <View style={[{backgroundColor: '#11c1f3',padding: 4,paddingTop:Platform.OS=='ios'?40:10,justifyContent: 'center',alignItems: 'center',flexDirection: 'row'}, styles.card]}>
                <View style={{flex: 1, paddingLeft: 10}}>
                    <TouchableOpacity onPress={() => {
                            this.goBack();
                        }}>
                        <Icon name="times-circle" size={30} color="#fff"/>
                    </TouchableOpacity>
                </View>
                <Text style={{fontSize: setSpText(21), flex: 3, textAlign: 'center', color: '#fff'}}>供应商详情</Text>
                <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                </View>
            </View>

            {/*body*/}
            <ScrollView>
                <View style={[{
                    backgroundColor: '#fff',
                    flex:1,
                    padding: 10,
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    borderBottomWidth:1
                }]}>
                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>名称：</Text></View>
                        <View style={{flex:3,borderBottomWidth:1,borderColor:'#aaa'}}><Text style={{fontSize:setSpText(18),color:'#000'}}>{ventasInfo.nickName}</Text></View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>别名：</Text></View>
                        <View style={{flex:3,borderBottomWidth:1,borderColor:'#aaa'}}><Text style={{fontSize:setSpText(18),color:'#000'}}>{ventasInfo.nombre}</Text></View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>地址：</Text></View>
                        <View style={{flex:3,borderBottomWidth:1,borderColor:'#aaa'}}><Text style={{fontSize:setSpText(18),color:'#000'}}>{ventasInfo.direccion} {ventasInfo.Localidad} {ventasInfo.Provincia}</Text></View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>联系人：</Text></View>
                        <View style={{flex:3,borderBottomWidth:1,borderColor:'#aaa'}}><Text style={{fontSize:setSpText(18),color:'#000'}}>{ventasInfo.principalContactos}</Text></View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>电话：</Text></View>
                        <View style={{flex:3}}>{phoneListView}</View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>经营范围：</Text></View>
                        <View style={{flex:3,borderWidth:1,borderColor:'#aaa',borderRadius:20,padding:10}}>{rubroListView}</View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'row',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <View style={{flex:1}}><Text style={{fontSize:setSpText(16)}}>备注：</Text></View>
                        <View style={{flex:3,borderBottomWidth:1,borderColor:'#aaa'}}><Text style={{fontSize:setSpText(18),color:'#000'}}>{ventasInfo.nota}</Text></View>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'column',justifyContent:'flex-start',alignItems:'flex-start'}}>
                        <Text style={{fontSize:setSpText(16)}}>配送范围：</Text>
                    </View>

                    <View style={{backgroundColor: '#fff',padding: 4,paddingTop:10,flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                        {deliverGoodListView}
                    </View>
                </View>
            </ScrollView>

                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showProgress}
                    onRequestClose={() => {
                        this.setState({showProgress: false})
                    }}
                >
                    <View style={[styles.modalContainer, styles.modalBackgroundStyle]}>
                        <ActivityIndicator
                            animating={true}
                            style={[styles.loader, {height: 80}]}
                            size="large"
                            color="#fff"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#fff', fontSize: setSpText(18), alignItems: 'center'}}>
                                加载中。。
                            </Text>
                            <Text style={{color: '#fff', fontSize: setSpText(24), alignItems: 'center'}}>
                                {this.state.loginDot}
                            </Text>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }

    componentDidUpdate(){
        var ventasInfo = this.props.ventasInfo;
        var deliverGood = ventasInfo.deliverGood;
        if(deliverGood!=null && deliverGood!=undefined && deliverGood!=''){

        }
    }
}


var styles = StyleSheet.create({
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
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
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(VentasDetail);
