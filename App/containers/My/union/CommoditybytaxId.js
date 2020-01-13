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
    TouchableOpacity,
    ListView,
} from 'react-native';

import {connect} from 'react-redux';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setSpText} from "../../../utils/ScreenUtil";
import RNFS from 'react-native-fs';
import Config from "../../../../config";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');

import CommodityDetailInfo from "./CommodityDetail.js"

class AllCommoditybyTax extends Component{

    navigatorDetail(priceId,codigo,nombre,taxName,sizeValue,sizeUnit,scaleUnit,basePrice,ratio,ratio1){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CommodityDetailInfo',
                component: CommodityDetailInfo,
                params: {
                    priceId:priceId,
                    codigo:codigo,
                    nombre:nombre,
                    taxName:taxName,
                    sizeValue:sizeValue,
                    sizeUnit:sizeUnit,
                    scaleUnit:scaleUnit,
                    basePrice:basePrice,
                    ratio:ratio,
                    ratio1:ratio1,
                }
            })
        }
    }

    constructor(props){
        super(props);
        this.state={
            allTaxCommodity:[],
            ratio:null,
        };
    }

    componentDidMount(): void {
        this.getCommoditybytaxId();
    }


    render(){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var allCommodity=this.state.allTaxCommodity;
        return(
            <View style={{flex:1}}>
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
                        {this.props.taxId}-{this.props.taxName}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>

                {/*adjust*/}
                {/*<View style={styles.adjust}>*/}
                    {/*<View style={[styles.middleall,{marginLeft:5}]}>*/}
                        {/*<Text style={{fontSize:15}}>调整商品比例</Text>*/}
                    {/*</View>*/}
                    {/*<View style={styles.middleall}>*/}
                        {/*<TextInput*/}
                            {/*style={{height:height*0.06,width:width*0.5,borderWidth:1}}*/}
                            {/*placeholder={this.state.ratio}*/}
                            {/*placeholderTextColor={"black"}*/}
                            {/*underlineColorAndroid={"transparent"}*/}
                            {/*onChangeText={(value) => {*/}
                                {/*this.setState({ratio: value})*/}
                            {/*}}*/}
                        {/*/>*/}
                    {/*</View>*/}
                    {/*<TouchableOpacity*/}
                        {/*onPress={() => {*/}
                            {/*this.updateSupnuevoBuyerUnionPriceRatio()*/}
                        {/*}}*/}
                    {/*>*/}
                        {/*<View style={styles.button}>*/}
                            {/*<Text style={{color:"white"}}>保存</Text>*/}
                        {/*</View>*/}
                    {/*</TouchableOpacity>*/}
                {/*</View>*/}

                {/*body*/}
                <View style={{padding:3,justifyContent:'center',alignItems:'center'}}>
                    <ScrollView style={{height:height*0.8}}>
                            <ListView
                                automaticallyAdjustContentInsets={false}
                                dataSource={ds.cloneWithRows(allCommodity)}
                                renderRow={this.renderRow.bind(this)}
                            />
                    </ScrollView>
                </View>
            </View>
        )
    }

    renderRow(rowData) {
        var row =
            <TouchableOpacity onPress={() => {this.navigatorDetail(rowData.priceId,rowData.codigo,rowData.nombre,rowData.taxName,rowData.sizeValue,rowData.sizeUnit,rowData.scaleUnit,rowData.basePrice,rowData.ratio,rowData.ratio1)}}>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                }}>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品条码：</Text>
                        <Text style={styles.renderText}>{rowData.codigo}</Text>
                    </View>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品名称：</Text>
                        <Text style={styles.renderText}>{rowData.nombre}</Text>
                    </View>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>商品基础价：</Text>
                        <Text style={styles.renderText}>{rowData.basePrice}</Text>
                    </View>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>比例：</Text>
                        <Text style={styles.renderText}>{rowData.ratio}</Text>
                    </View>

                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>比例一：</Text>
                        <Text style={styles.renderText}>{rowData.ratio1}</Text>
                    </View>

                </View>
            </TouchableOpacity>;
        return row;
    }

    getCommoditybytaxId(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceFormListByTaxId",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                taxId:this.props.taxId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var jsonData = json.data;
                this.setState({allTaxCommodity:jsonData})
            }
        }).catch((err)=>{alert(err);});
    }

    updateSupnuevoBuyerUnionPriceRatio(){
        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnionPriceRatio",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                taxId:this.props.taxId,
                ratio:parseFloat(this.state.ratio),
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('修改成功');
                this.getCommoditybytaxId();
            }
        }).catch((err)=>{alert(err);});
    }

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
            this.props.getSupnuevoBuyerUnionPriceClass()
        }
    }
}

const styles=StyleSheet.create({
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center',
    },
    middleall:{
        alignItems:"center",
        justifyContent:"center",
        marginRight:10,
    },
    adjust:{
        marginTop:2,
        height:height*0.07,
        flexDirection:"row",
        borderWidth:1,
        alignItems:"center",
    },
    button:{
        height:height*0.05,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        backgroundColor:'#387ef5',
        width:width*0.2,
    }
})


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
    })
)(AllCommoditybyTax);