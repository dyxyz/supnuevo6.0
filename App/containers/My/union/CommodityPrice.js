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
    KeyboardAvoidingView, ListView,
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
                <View style={{
                    backgroundColor: '#387ef5',
                    height: 55,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{
                        flex: 1,
                        height: 45,
                        marginRight: 10,
                        marginTop:10
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        Supnuevo(6.0)-{this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{padding:3,justifyContent:'center',alignItems:'center'}}>
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
        var row =
            <TouchableOpacity onPress={() => {this.navigatorCommodity(rowData.taxId,rowData.taxName)}}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        {/*<Text style={styles.renderText}>ID：</Text>*/}
                        <Text style={styles.renderText}>{rowData.taxId}-{rowData.taxName}({rowData.ratio})</Text>
                    </View>
                    {/*<View style={{paddingTop: 5, flexDirection: 'row'}}>*/}
                        {/*<Text style={styles.renderText}>ClassName：</Text>*/}
                        {/*<Text style={styles.renderText}>{rowData.taxName}</Text>*/}
                    {/*</View>*/}
                    {/*<View style={{paddingTop: 5, flexDirection: 'row'}}>*/}
                        {/*<Text style={styles.renderText}>descripcion：</Text>*/}
                        {/*<Text style={styles.renderText}>{rowData.ratio}</Text>*/}
                    {/*</View>*/}
                </View>
            </TouchableOpacity>;
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
        fontSize: setSpText(18),
        alignItems: 'center'
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
    })
)(CommodityPrice);

