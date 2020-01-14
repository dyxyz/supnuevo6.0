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
    Dimensions,
    ListView,
    FlatList,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_TEXT,InformationItem} from '../../../components/InformationItem'
import TableView from "../../../components/TableView";
import Config from "../../../../config";
import orderDetail from "./OrderDetail";
import {setSpText} from '../../../utils/ScreenUtil'
var proxy = require('../../../proxy/Proxy');

var {height, width} = Dimensions.get('window');

class AuditCustomer extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount(): void {

        this.getSupnuevoUnckeckCustomerList();



    }

    constructor(props){
        super(props);
        this.state=({
            customerList:null,
        })
    }

    render(){
        return(
            <View>
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
                <View>
                    <View style={styles.container}>
                        <View style={styles.head}>
                            <Text style={styles.text}>用户昵称</Text>
                        </View>
                        <View style={[styles.head,{flex:2}]}>
                            <Text style={styles.text}>用户电话</Text>
                        </View>
                        <View style={[styles.head,{flex:2}]}>
                            <Text style={styles.text}>申请时间</Text>
                        </View>
                        <View style={styles.head}>
                            <Text style={styles.text}>审核</Text>
                        </View>
                    </View>
                    <FlatList data={this.state.customerList} renderItem={this.renderRow} />
                </View>
            </View>
        );
    }

    renderRow=({item})=> {
        var row=
            <View>
                <View style={styles.container}>
                    <View style={[styles.head,{borderRightWidth:0}]}>
                        <Text style={styles.text}>{item.nickName}</Text>
                    </View>
                    <View style={[styles.head,{borderRightWidth:0,flex:2}]}>
                        <Text style={styles.text}>{item.telephone}</Text>
                    </View>
                    <View style={[styles.head,{borderRightWidth:0,flex:2}]}>
                        <Text style={styles.text}>{item.registerTimeStr}</Text>
                    </View>

                    <View style={[styles.head,{borderRightWidth:0}]}>
                        <TouchableOpacity
                            onPress={()=>{this.setCustomerIsPassed(item.registerId)}}
                        >
                            <View style={{backgroundColor:"#387ef5",width:width*0.15,borderRadius:width*0.02,height:height*0.04,alignItems:"center",justifyContent:"center"}}>
                                <Text style={[styles.text,{color:"white"}]}>审核通过</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>;
            return row;
    }

    getSupnuevoUnckeckCustomerList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoUnckeckCustomerList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re === 1){
                var dataList = json.data;
                this.setState({customerList:dataList})
            }
        }).catch((err)=>{alert(err);});
    }

    setCustomerIsPassed(registerId){
        proxy.postes({
            url: Config.server + '/func/union/setSupnuevoCustomerIsPassed',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                registerId:registerId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("审核成功");
                this.getSupnuevoUnckeckCustomerList();
            }
        }).catch((err) => {
            alert(err);
        });
    }
}

const styles=StyleSheet.create({
    container:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        width:width,
        borderBottomWidth:1,
        height:height*0.06,
    },
    head:{
        flex:1,
        borderRightWidth:1,
        justifyContent:"center",
        alignItems:"center",
        height:height*0.05,
    },
    text:{
        fontSize:12,
    }
});

module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
        merchantId: state.user.supnuevoMerchantId,
    })
)(AuditCustomer);