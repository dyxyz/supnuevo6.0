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
    Platform,

} from 'react-native';
// import ReactNative from 'react-native'
// import findNodeHandle from 'react-native'

import {connect} from 'react-redux';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
var ReactNative = require('react-native');
import {setSpText} from "../../../utils/ScreenUtil";
import RNFS from 'react-native-fs';
import Config from "../../../../config";

var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');

class DiscountPic extends Component{

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props){
        super(props);
        this.state={
            uri:null
        };
    }

    takeToImage() {
        ReactNative.takeSnapshot('screen', {format: 'png', quality: 1}).then(

            (uri) =>{
                console.log(uri)
                this.setState({uri:uri})
            }
        ).catch(
            (error) => alert(error)
        );
    }


    render(){
        console.log(this.props.goods)
        var imageuri ="https://supnuevo.s3.sa-east-1.amazonaws.com/"+ this.props.goods.imageUrl;
        return(
            <View style={{flex:1,alignItems:'center'}}>
                {/*head*/}
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
                                折扣图片
                            </Text>
                        </View>


                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>

                <View ref='pic' style={{alignItems:"center",justifyContent:'center',borderWidth:2,borderRadius:5,flexDirection:'row',width:width*0.95,padding:10,marginTop:15}}>
                    <View style={{}}>
                        {
                            this.props.goods.imageUrl==null?
                                <Icon name="photo" size={150} color='rgb(112,112,112)'/>
                                :
                                <Image resizeMode="contain" style={{
                                    width: width*0.35,
                                    height: width*0.35,
                                }}
                                       source={{uri:imageuri}}
                                />
                        }
                        <Text style={{marginTop:5}}>COD. {this.props.goods.codigo}</Text>
                    </View>
                    <View style={{width:width*0.56,justifyContent:'space-around',borderWidth:1,borderColor:'orange',height:width*0.35}}>
                        <View>
                            <Text style={{fontWeight:'800',fontSize:15}}>{this.props.goods.commodityName}</Text>
                        </View>
                        <View>
                            <Text style={{fontWeight:'800',fontSize:15,color:'green'}}>${this.props.goods.price}</Text>
                        </View>
                    </View>



                </View>

                <TouchableOpacity
                    onPress={()=>{this.takeToImage()}}
                >
                    <View style={{backgroundColor:'#387ef5',width:width*0.6,padding:10,alignItems:'center',justifyContent:'center',borderRadius:8,height:height*0.05,marginTop:30}}>
                        <Text style={{color:'white',fontSize:18}}>生成折扣图片</Text>
                    </View>
                </TouchableOpacity>



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
    },
    detail:{
        height:45,
        width:"100%",
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderColor:'#888'
    }
})

module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
    })
)(DiscountPic);