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
    KeyboardAvoidingView,
    ListView,
    Platform,
} from 'react-native';

import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SelectorTableView from "../../../components/SelectorTableView";
import {setSpText} from "../../../utils/ScreenUtil";
import Config from "../../../../config";
import {loginAction} from "../../../action/actionCreator";
import CodesModal from '../../../components/modal/CodesModal';
import RNCamera from "react-native-camera";


import AllCommoditybyTax from './CommoditybytaxId.js';

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');




class CommodityPrice extends Component {

    navigatorCommodity(taxId,taxName) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'AllCommoditybyTax',
                component: AllCommoditybyTax,
                params: {
                    taxId:taxId,
                    taxName:taxName,
                    getSupnuevoBuyerUnionPriceClass: this.getSupnuevoBuyerUnionPriceClass.bind(this),
                }
            })
        }
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }



    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            searchResult: [],
            selectedPrice: null,
            isSearchStatus: false,
            allClass:[],
            ratio:null,
        };
    }

    componentDidMount(): void {
        // 获取联盟商品种类表
        this.getSupnuevoBuyerUnionPriceClass();
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var allGoodsClass=this.state.allClass;

        return (
            <View style={{flex: 1,alignItems:"center",justifyContents:'center'}}>
                <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                    <View style={{flex:1,paddingLeft:10}}>
                        <TouchableOpacity
                            style={{flexDirection:'row',height:40,paddingTop:3}}
                            onPress={
                                ()=>{
                                    this.goBack();
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
                {/* body */}
                <View style={{padding:3,justifyContent:'center',alignItems:'center'}}>
                    <View style={{width:width,height:height*0.05,alignItems:"center",justifyContent:"center",borderBottomWidth:1}}>
                        <Text style={{fontSize:18}}>本店基础价位</Text>
                    </View>
                    <View style={{flex:1}}>
                        <ScrollView>
                            <ListView
                                automaticallyAdjustContentInsets={false}
                                dataSource={ds.cloneWithRows(allGoodsClass)}
                                renderRow={this.renderRow.bind(this)}
                            />
                        </ScrollView>
                    </View>
                </View>
            </View>
        )
    }

    renderRow(rowData) {
        if(this.props.unionMemberType==2) {
            var row =
                <TouchableOpacity onPress={() => {
                    this.navigatorCommodity(rowData.taxId, rowData.taxName)
                }}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'center', backgroundColor: '#fff', width: width
                    }}>

                        <View style={{ flexDirection: 'row',width:width,justifyContent:"space-between"}}>
                            <View style={{alignItems:"flex-end",justifyContent:"center",width:width*0.45}}>
                                <View>
                                <Text style={[styles.renderText,{fontSize:16}]}>{rowData.taxName}</Text>
                                </View>
                            </View>
                            <View style={{width:width*0.55,alignItems:"center",flexDirection:"row",justifyContent:"flex-start"}}>
                                <View><Text style={[styles.renderText,{fontSize:18}]}>建议价 - </Text></View>
                                <View>
                                    <TextInput
                                        style={{height:height*0.07,width:width*0.08}}
                                        defaultValue={rowData.ratio.toString()}
                                        onChangeText={(value) => {
                                            this.setState({ratio:value})
                                        }}
                                    />
                                </View>
                                <View>
                                    <Text> % </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={()=>{this.updateSupnuevoBuyerUnionPriceRatio(rowData.taxId)}}
                                >
                                    <View style={{backgroundColor:"#387ef5",height:height*0.04,width:width*0.15,borderRadius:width*0.05,alignItems:"center",justifyContent:"center"}}>
                                        <Text style={{color:"white"}}>修改</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>
                </TouchableOpacity>;
        }
        else{
            var row =
                <TouchableOpacity onPress={() => {
                    this.navigatorCommodity(rowData.taxId, rowData.taxName)
                }}>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff', width: width
                    }}>

                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={[styles.renderText,{fontSize:18}]}>{rowData.taxName}建议价-{rowData.ratio}%</Text>
                        </View>
                    </View>
                </TouchableOpacity>;
        }
        return row;
    }

    _onMicrophonePress = () => {
    };

    _searchTextChange = (text) => {
        this.setState({searchText: text});
        if (!text) {
            this._clearSearchInput()
            return;
        }
    };

    _clearSearchInput = () => this.setState({searchText: ''})

    _onSearchPress = () => {
        this.setState({isSearchStatus: true});
    };

    getSupnuevoBuyerUnionPriceClass(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceTaxFormList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var jsonData = json.data;
                this.setState({allClass:jsonData})
            }
        }).catch((err)=>{alert(err);});
    }
    updateSupnuevoBuyerUnionPriceRatio(taxId){
        if(this.state.ratio==null || this.state.ratio==undefined){
            Alert.alert("请输入建议价")
        }
        else {
            proxy.postes({
                url: Config.server + "/func/union/updateSupnuevoBuyerUnionPriceRatio",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    unionId: this.props.unionId,
                    taxId: taxId,
                    ratio: parseFloat(this.state.ratio),
                }
            }).then((json) => {
                if (json.re === 1) {
                    alert('修改成功');
                    this.getSupnuevoBuyerUnionPriceClass();
                }
            }).catch((err) => {
                alert(err);
            });
        }
    }
}




var styles = StyleSheet.create({
    tableInfoCard:{
        width:width-40,
        flex:1,
        borderColor:"black",
        borderWidth:1,
        borderRadius:10,
        marginTop: 10,
    },
    renderText: {
        alignItems: 'center'
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
    })
)(CommodityPrice);

