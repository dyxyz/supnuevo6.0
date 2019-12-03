import React, {Component} from 'react';

import  {
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
    ListView,
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setSpText} from "../../../utils/ScreenUtil";
import Config from "../../../../config";
import CommodityDiscount from "./CommodityDiscount.js"
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');

class AllCommodityDiscount extends Component{
    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    navigateToCommodityDiscount(){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CommodityDiscount',
                component: CommodityDiscount,
                params: {
                }
            })
        }
    }

    componentDidMount(): void {
        this.getAllCommodityDiscount();
    }

    constructor(props){
        super(props);
        this.state={
            ComDiscount:[]
        }
    }
    render(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return(
            <View>
                {/*head*/}
                <View style={{
                    backgroundColor: '#387ef5',
                    height: height*0.1,
                    padding: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{flex: 1, height: 45, marginRight: 10, marginTop:10}}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        Supnuevo(6.0)-{this.props.username}
                    </Text>
                    <TouchableOpacity
                        style={{
                            position:"absolute",
                            right:15,
                            top:27,
                            height: 30,
                        }}
                        onPress={() => {
                            this.navigateToCommodityDiscount();
                        }}>
                        <View
                        >
                            <IconI name="ios-add-circle-outline" color="#fff" size={30}/>
                        </View>
                    </TouchableOpacity>
                    <View style={{flex:1}}>

                    </View>
                </View>

                    {/* body */}
                    <View style={{flex:1}}>
                        <View style={styles.listViewWrapper}>
                            <ListView
                                style={{flex:1}}
                                automaticallyAdjustContentInsets={false}
                                dataSource={ds.cloneWithRows(this.state.ComDiscount)}
                                renderRow={this.renderRow.bind(this)}/>
                        </View>
                    </View>
            </View>
        );
    }

    renderRow(rowData) {
        var row =
            <TouchableOpacity
                onPress={() => {}}
                onLongPress={()=>{this.deleteCommodityDiscount(rowData.discountId)}}
            >
                <View style={{flexDirection:"row"}}>
                    <View style={{
                        flex: 3, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                    }}>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>折扣名：{rowData.discountName}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>活动商品条码：{rowData.commodity.codigo}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>赠品条码：{rowData.discountCommodity.codigo}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    };

    getAllCommodityDiscount(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionCommodityDiscountFormList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var ComDiscount = json.data;
                this.setState({
                    ComDiscount:ComDiscount})
            }
        }).catch((err)=>{alert(err);});
    }

    deleteCommodityDiscount(discountId){
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
                this.getAllCommodityDiscount()
            }
        }).catch((err) => {
            alert(err);
        });
    }
}

const styles=StyleSheet.create({
    listViewWrapper:{
        width:width,
        height:height/3,
    },
})

module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
    })
)(AllCommodityDiscount);