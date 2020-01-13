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

class CommodityDetailInfo extends Component{

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props){
        super(props);
            this.state={
                ratioOnly:this.props.ratio1,
            };
        }

    // componentDidMount(): void {
    //     this.updateSupnuevoBuyerUnionPriceRatio1();
    // }

    render(){
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
                        商品-{this.props.priceId}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>

                <View style={{height:height*0.8}}>
                    <View style={styles.info}>
                        <View style={styles.all}><Text style={styles.text}>商品条码：{this.props.codigo}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>商品名称：{this.props.nombre}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>商品类型：{this.props.taxName}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>含量数值：{this.props.sizeValue}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>含量单位：{this.props.sizeUnit}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>比价单位：{this.props.scaleUnit}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>商品基础价：{this.props.basePrice}</Text></View>
                        <View style={styles.all}><Text style={styles.text}>商品比例：{this.props.ratio}</Text></View>

                        {this.props.unionMemberType==2?
                            <View style={styles.ratio}>
                                <View style={{marginLeft:5}}>
                                    <Text style={styles.text}>比例1：</Text>
                                </View>

                                <View style={styles.ratioInput}>
                                    <View>

                                    {this.state.ratioOnly==null?
                                        <TextInput
                                            style={{height:height*0.05,width:width*0.13,paddingLeft:width*0.05}}
                                            //placeholder={this.state.ratioOnly.toString()}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({ratioOnly: value})
                                            }}
                                        />
                                        :
                                        <TextInput
                                            style={{height:height*0.05,width:width*0.13,paddingLeft:width*0.05}}
                                            placeholder={this.state.ratioOnly.toString()}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({ratioOnly: value})
                                            }}
                                        />
                                    }
                                    </View>
                                </View>
                                <Text>%</Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.updateSupnuevoBuyerUnionPriceRatio1()
                                    }}
                                >
                                    <View style={styles.button}>
                                        <Text style={{color:"white"}}>保存</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.all}><Text style={styles.text}>比例1：{this.state.ratioOnly}</Text></View>
                        }

                    </View>
                </View>

            </View>
        )
    }

    updateSupnuevoBuyerUnionPriceRatio1(){
        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnionPriceRatio1",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                priceId:this.props.priceId,
                // ratio1:this.state.ratioOnly,
                ratio1:parseFloat(this.state.ratioOnly),
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('修改成功')
            }
        }).catch((err)=>{alert(err);});
    }
}

const styles=StyleSheet.create({
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center',
    },
    ratioInput:{
        alignItems:"center",
        justifyContent:"center",
        borderBottomWidth:1,
        width:width*0.18,
        marginLeft:width*0.03,
        // borderColor:"red",
        // marginRight:10,
    },

    info:{
        marginTop:2,
    },
    ratio:{
        marginTop:5,
        // height:height*0.07,
        flexDirection:"row",
        // borderWidth:1,
        alignItems:"center",
    },
    button:{
        height:height*0.05,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:10,
        backgroundColor:'#387ef5',
        width:width*0.2,
        marginLeft:width*0.05,
    },
    text:{
        fontSize:20,
    },
    all:{
        marginTop:5,
        marginLeft:5,
    }
})

module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
    })
)(CommodityDetailInfo);