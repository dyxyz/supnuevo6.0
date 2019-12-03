
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
    WebView
} from 'react-native';
import {connect} from 'react-redux';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_TEXT,InformationItem} from '../../../components/InformationItem'
import TableView from "../../../components/TableView";
import Config from "../../../../config";
var proxy = require('../../../proxy/Proxy');

var {height, width} = Dimensions.get('window');
const orderHead = ["商品名称","数量","价格","小计"];
const orderList=[
    ["Coca cola 1.5L","6","50.00","300.00"],
    ["Sanco leche 300ml","5","40.00","200.00"],
    ["Shampoo 1000ml","1","140.00","140.00"],
];

class UnionOrder extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            orderDate:null,
            orderList:[],
            select:0,
        };
    }

    componentDidMount(): void {
        this.getOrderListOfDate(null,0);
    }

    render() {


        return (
            <View style={{flex: 1}}>
                <View style={{backgroundColor: '#387ef5', height: 55, padding: 12, justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                    <TouchableOpacity style={{flex: 1, height: 45, marginRight: 10, marginTop:10}}
                                      onPress={() => {this.goBack();}}>
                        <Icon name="angle-left" color="#fff" size={40}></Icon>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex:1}}>
                    </View>
                </View>
                {/* body */}
                {
                    this.state.select==0?
                        <View>
                            <View style={{flexDirection:"row",width:width}}>
                                <View style={[styles.select,{backgroundColor:"#39c7c8",borderRightWidth:2}]}>
                                    <TouchableOpacity onPress={()=>{this.displayUnDone()}}>

                                            <Text style={{color:'#fff'}}>未被接单订单</Text>

                                    </TouchableOpacity>
                                </View>
                                <View  style={styles.select}>
                                    <TouchableOpacity onPress={()=>{this.displayDone()}}>
                                            <Text>已完成订单</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView>
                                <View  style={styles.scrollViewContanier}>
                                    {this._renderOrderList(this.state.orderList)}
                                </View>
                            </ScrollView>

                        </View>
                        :
                        <View>
                            <View  style={{flexDirection:"row",width:width}}>
                                <View  style={styles.select}>
                                    <TouchableOpacity  onPress={()=>{this.displayUnDone()}}>

                                            <Text>未被接单订单</Text>

                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.select,{backgroundColor:"#39c7c8",borderLeftWidth:2}]}>
                                    <TouchableOpacity onPress={()=>{this.displayDone()}}>

                                            <Text style={{color:'#fff'}}>已完成订单</Text>

                                    </TouchableOpacity>
                                </View>
                            </View>
                            <ScrollView>
                                <View  style={styles.scrollViewContanier}>
                                    <InputWithCalendar
                                        title={"日期"}
                                        date={this.state.orderDate}
                                        onDateChange={(value)=>{
                                        this.setState({orderDate:value});
                                        this.getOrderListOfDate(value,1);
                                    }}/>
                                    {this._renderOrderList(this.state.orderList)}
                                </View>
                            </ScrollView>
                        </View>
                }
                {/*<ScrollView>*/}
                    {/*<View style={styles.scrollViewContanier}>*/}
                        {/*<InputWithCalendar*/}
                            {/*title={"日期"}*/}
                            {/*date={'请输入订单日期'}*/}
                            {/*onDateChange={(value)=>{*/}
                                {/*this.setState({orderDate:value});*/}
                                {/*this.getOrderListOfDate(value);*/}
                            {/*}}/>*/}
                        {/*{this._renderOrderList(orderList)}*/}
                    {/*</View>*/}
                {/*</ScrollView>*/}

            </View>
        )
    }

    _renderOrderList(orderList){
        let orderListView=[];
        if(orderList && orderList.length>0){
            orderList.map((order,i)=>{
                const telephone = order.mobilePhone;
                const orderInfo = order.order;
                if(orderInfo.deliveryType==0 && orderInfo.orderState==0 ) {
                    orderListView.push([
                        <View style={styles.container}>
                            <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                        </View>,
                        <View style={styles.basicInfoContainer}>
                            <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                            <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>
                            <InformationItem key={2} type={TYPE_TEXT} title="送货地址" content={orderInfo.receiverAddr}/>
                            <InformationItem key={3} type={TYPE_TEXT} title="接货人电话" content={orderInfo.receiverPhone}/>
                            <InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>
                        </View>,
                        <View style={styles.tableInfoCard}>
                            <TableView title={"订单内容"} headerList={orderHead}
                                       dataList={this._transformOrderListToArray(orderInfo.itemList)}   renderAux={null}
                                       totalAmount={orderInfo.totalAmount} totalFee={orderInfo.totalFee}
                                       discountFee={orderInfo.discountFee} totalFeeFinal={orderInfo.totalFeeFinal}
                            />
                        </View>,
                        <View style={{alignItems:"center",justifyContent:"center",marginTop:height*0.02,marginBottom:height*0.02}}>
                            <TouchableOpacity onPress={()=>{this.affirmCustomerOrder(orderInfo.orderId)}}>
                                <View style={styles.button}>
                                    <Text style={{color:'#fff'}}>抢单</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        ]
                    );
                }
                else if(orderInfo.deliveryType==0 && orderInfo.orderState==1){
                    orderListView.push([
                        <View style={styles.container}>
                            <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                        </View>,
                        <View style={styles.basicInfoContainer}>
                            <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                            <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>
                            <InformationItem key={2} type={TYPE_TEXT} title="送货地址" content={orderInfo.receiverAddr}/>
                            <InformationItem key={3} type={TYPE_TEXT} title="接货人电话" content={orderInfo.receiverPhone}/>
                            <InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>
                        </View>,
                        <View style={styles.tableInfoCard}>
                            <TableView title={"订单内容"} headerList={orderHead}
                                       dataList={this._transformOrderListToArray(orderInfo.itemList)}   renderAux={null}
                                       totalAmount={orderInfo.totalAmount} totalFee={orderInfo.totalFee}
                                       discountFee={orderInfo.discountFee} totalFeeFinal={orderInfo.totalFeeFinal}
                            />
                        </View>
                        ]);
                }
                else{
                    orderListView.push([
                        <View style={styles.container}>
                            <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                        </View>,
                        <View style={styles.basicInfoContainer}>
                            <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                            <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"自提"}/>
                            {/*<InformationItem key={1} type={TYPE_TEXT} title="送货地址" content={orderInfo.receiverAddr}/>*/}
                            {/*<InformationItem key={2} type={TYPE_TEXT} title="接货人电话" content={orderInfo.receiverPhone}/>*/}
                            {/*<InformationItem key={3} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>*/}
                        </View>,
                        <View style={styles.tableInfoCard}>
                            <TableView title={"订单内容"} headerList={orderHead}
                                       dataList={this._transformOrderListToArray(orderInfo.itemList)} renderAux={null}
                                       totalAmount={orderInfo.totalAmount} totalFee={orderInfo.totalFee}
                                       discountFee={orderInfo.discountFee} totalFeeFinal={orderInfo.totalFeeFinal}
                            />
                        </View>
                        ]
                    );
                }
            })}
            return orderListView;
        }



    _transformOrderListToArray(itemList){
        var array=[];
        if(itemList && itemList.length>0){
        itemList.map((order,i)=>{
            //"商品名称","数量","价格","小计"
            var item = [];
            item.push(order.nombre);
            item.push(order.amount);
            item.push(order.price);
            item.push(order.total);
            array.push(item);
        })}
        return array;
    }

    displayUnDone(){
        this.setState({select:0});
        this.getOrderListOfDate(null,0);
    }

    displayDone(){
        this.setState({select:1});
        this.getOrderListOfDate(this.state.orderDate,1);
    }

    getOrderListOfDate(orderDate,orderState){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfDateByUnion",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderDate: orderDate,
                unionId: this.props.unionId,
                orderState:orderState,
            }
        }).then((json)=> {
            if(json.re === 1){
                var data = json.data;
                this.setState({orderList:data})
            }
        }).catch((err)=>{alert(err);});
    }

    //商家抢单
    affirmCustomerOrder(orderId){
        proxy.postes({
            url: Config.server + "/func/customer/affirmCustomerOrder",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderId:orderId,
                merchantId:this.props.merchantId,
            }
        }).then((json)=> {
            if(json.re === 1){
                Alert.alert("抢单成功");
                this.getOrderListOfDate(null,0);
            }
        }).catch((err)=>{alert(err);});
    }
}


var styles = StyleSheet.create({
    row: {
        height:65,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#aaa',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft:10
    },
    popoverText: {
        fontSize: 16
    },
    scrollViewContanier:{
        alignItems: 'center',
        marginBottom: 100,
    },
    basicInfoContainer:{
        flex:1,
        width: width,
    },
    tableInfoCard:{
        width:width-40,
        flex:1,
        borderColor:"#666",
        borderWidth:1,
        borderRadius:10,
        marginTop: 10,
    },
    container: {
        // marginTop:10,
        height:30,
        width:width,
        justifyContent:'center',
        textAlign:'left',
        backgroundColor:'#eee',
        paddingHorizontal:10
    },
    text: {
        color:'#666',
        fontSize:13
    },
    select:{
        flex:1,
        // borderWidth:1,
        borderBottomWidth:2,
        borderTopWidth:2,
        borderColor:'#9e9ca3',
        alignItems:"center",
        justifyContent:"center",
        height:height*0.05,
    },
    button:{
        borderWidth:1,
        width:width*0.4,
        backgroundColor: '#387ef5',
        height:height*0.05,
        alignItems:"center",
        justifyContent:"center",
        borderRadius:width*0.03,
    }
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
        merchantId: state.user.supnuevoMerchantId,
    })
)(UnionOrder);

