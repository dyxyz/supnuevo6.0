
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
    WebView
} from 'react-native';
import {connect} from 'react-redux';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_TEXT,InformationItem} from '../../../components/InformationItem'
import TableView from "../../../components/TableView";
import Config from "../../../../config";
import orderDetail from "./OrderDetail";
var proxy = require('../../../proxy/Proxy');

var {height, width} = Dimensions.get('window');
const orderHead = ["商品名称","数量","价格","小计"];
const orderList=[
    ["Coca cola 1.5L","6","50.00","300.00"],
    ["Sanco leche 300ml","5","40.00","200.00"],
    ["Shampoo 1000ml","1","140.00","140.00"],
];

class UnionOrder extends Component {

    navigatorToDetail(row) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'orderDetail',
                component: orderDetail,
                params: {
                    row:row,
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
            orderDate:null,
            orderList:[],
            select:0,
            deliver:0,
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

                    {this.renderBody()}


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

    renderBody(){
        if(this.state.select==0) {
             const body=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderRightWidth: 2}]}
                        onPress={() => {
                        this.displayUnDone()
                    }}>
                        <View>


                                <Text style={{color: '#fff'}}>未被接单订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayConfirm()
                        }}>
                        <View>

                            <Text>已确认订单</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select,{borderLeftWidth:2}]}
                        onPress={() => {
                        this.displayOver()
                    }}>
                        <View>

                                <Text>已完成订单</Text>
                        </View>
                    </TouchableOpacity>
                </View>


                 {
                     this.state.deliver==0?
                         <View style={{alignItems:"center"}}>
                             <View style={styles.deliver}>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToSelf()}}

                                     style={[styles.selected,{backgroundColor:'rgb(114, 135, 191)'}]}
                                 >
                                     <View>
                                         <Text>自提订单</Text>
                                     </View>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToDeliver()}}
                                     style={styles.selected}
                                 >
                                     <View>
                                         <Text>配送订单</Text>
                                     </View>
                                 </TouchableOpacity>
                             </View>
                         </View>
                         :
                         <View style={{alignItems:"center"}}>
                             <View  style={styles.deliver}>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToSelf()}}
                                     style={styles.selected}
                                 >
                                     <View>
                                         <Text>自提订单</Text>
                                     </View>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToDeliver()}}
                                     style={[styles.selected,{backgroundColor:'rgb(114, 135, 191)'}]}
                                 >
                                     <View>
                                         <Text>配送订单</Text>
                                     </View>
                                 </TouchableOpacity>
                             </View>
                         </View>
                 }
                <ScrollView>
                    <View style={styles.scrollViewContanier}>
                        {this._renderOrderList(this.state.orderList)}
                    </View>
                </ScrollView>


            </View>;

            return body
        }

    else if(this.state.select==1){

             const elsebody=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                        this.displayUnDone()
                    }}>
                        <View>


                                <Text>未被接单订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderLeftWidth: 2,borderRightWidth:2}]}
                        onPress={() => {
                        this.displayConfirm()
                    }}>
                        <View>


                                <Text style={{color: '#fff'}}>已确认订单</Text>


                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayOver()
                        }}>
                        <View>


                            <Text>已完成订单</Text>


                        </View>
                    </TouchableOpacity>
                </View>




                 <ScrollView>
                     <View style={styles.scrollViewContanier}>
                         {this._renderOrderList(this.state.orderList)}
                     </View>
                 </ScrollView>
            </View>;
            return elsebody;
        }
        else{
            const otherBody=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayUnDone()
                        }}>
                        <View>


                            <Text>未被接单订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayConfirm()
                        }}>
                        <View>


                            <Text>已确认订单</Text>


                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderLeftWidth: 2}]}
                        onPress={() => {
                            this.displayOver()
                        }}>
                        <View>


                            <Text style={{color: '#fff'}}>已完成订单</Text>


                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={styles.scrollViewContanier}>
                        <InputWithCalendar
                            title={"日期"}
                            date={this.state.orderDate}
                            onDateChange={(value) => {
                                this.setState({orderDate: value});
                                this.getOrderListOfDate(value, 1);
                            }}/>
                        {this._renderOrderList(this.state.orderList)}
                    </View>
                </ScrollView>
            </View>;
            return otherBody;
        }


    }

    _renderOrderList(orderList){
        let orderListView=[];
        if(orderList && orderList.length>0){
            orderList.map((order,i)=>{
                const telephone = order.mobilePhone;
                const orderInfo = order.order;
                //未确认的配送订单
                if(this.state.select==0 && this.state.deliver==1) {
                    if (orderInfo.deliveryType == 0) {
                        orderListView.push([
                                <View style={styles.container}>
                                    <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                                </View>,
                                <View style={styles.basicInfoContainer}>
                                    <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                                    <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>
                                    <InformationItem key={2} type={TYPE_TEXT} title="送货地址"
                                                     content={orderInfo.receiverAddr}/>
                                    <InformationItem key={3} type={TYPE_TEXT} title="接货人电话"
                                                     content={orderInfo.receiverPhone}/>
                                    <InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>
                                </View>,
                                <View style={styles.tableInfoCard}>
                                    <View style={styles.containers}>
                                        {this._renderTitle("订单内容")}
                                        {this._renderHeader(orderHead)}
                                        {this._renderInfoList(orderInfo.itemList)}
                                        {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                        {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                    </View>
                                </View>,
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: height * 0.02,
                                    marginBottom: height * 0.02
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        this.affirmCustomerOrder(orderInfo.orderId)
                                    }}>
                                        <View style={styles.button}>
                                            <Text style={{color: '#fff'}}>抢单</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>

                            ]
                        );
                    }
                }

                //未确认的自提订单
                else if(this.state.select==0 && this.state.deliver==0) {
                    if (orderInfo.deliveryType == 1) {
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
                                    <View style={styles.containers}>
                                        {this._renderTitle("订单内容")}
                                        {this._renderHeader(orderHead)}
                                        {this._renderInfoList(orderInfo.itemList)}
                                        {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                        {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                    </View>
                                </View>,
                                <View style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginTop: height * 0.02,
                                    marginBottom: height * 0.02
                                }}>
                                    <TouchableOpacity onPress={() => {
                                        this.affirmCustomerOrder(orderInfo.orderId)
                                    }}>
                                        <View style={styles.button}>
                                            <Text style={{color: '#fff'}}>确认</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ]
                        );
                    }
                }
                //已确认订单
                else if(this.state.select==1){
                    if(orderInfo.deliveryType==0) {
                        orderListView.push([
                            <View style={styles.container}>
                                <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                            </View>,
                            <View style={styles.basicInfoContainer}>
                                <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                                <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>
                                <InformationItem key={2} type={TYPE_TEXT} title="送货地址"
                                                 content={orderInfo.receiverAddr}/>
                                <InformationItem key={3} type={TYPE_TEXT} title="接货人电话"
                                                 content={orderInfo.receiverPhone}/>
                                <InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>
                            </View>,
                            <View style={styles.tableInfoCard}>
                                <View style={styles.containers}>
                                    {this._renderTitle("订单内容")}
                                    {this._renderHeader(orderHead)}
                                    {this._renderInfoList(orderInfo.itemList)}
                                    {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                    {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                </View>
                            </View>,
                            <View style={{alignItems:"center",justifyContent:"center",marginTop:height*0.02,marginBottom:height*0.02}}>
                                <TouchableOpacity onPress={()=>{this.finishCustomerOrder(orderInfo.orderId)}}>
                                    <View style={styles.button}>
                                        <Text style={{color:'#fff'}}>结束订单</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ]);
                    }
                    if(orderInfo.deliveryType==1){
                        orderListView.push([
                                <View style={styles.container}>
                                    <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                                </View>,
                                <View style={styles.basicInfoContainer}>
                                    <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                                    <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"自提"}/>
                                </View>,
                                <View style={styles.tableInfoCard}>
                                    <View style={styles.containers}>
                                        {this._renderTitle("订单内容")}
                                        {this._renderHeader(orderHead)}
                                        {this._renderInfoList(orderInfo.itemList)}
                                        {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                        {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                    </View>
                                </View>,
                                <View style={{alignItems:"center",justifyContent:"center",marginTop:height*0.02,marginBottom:height*0.02}}>
                                    <TouchableOpacity onPress={()=>{this.finishCustomerOrder(orderInfo.orderId)}}>
                                        <View style={styles.button}>
                                            <Text style={{color:'#fff'}}>结束订单</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            ]
                        );
                    }
                }
                //已完成订单
                else{
                    if(orderInfo.deliveryType==0) {
                        orderListView.push([
                            <View style={styles.container}>
                                <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                            </View>,
                            <View style={styles.basicInfoContainer}>
                                <InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>
                                <InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>
                                <InformationItem key={2} type={TYPE_TEXT} title="送货地址"
                                                 content={orderInfo.receiverAddr}/>
                                <InformationItem key={3} type={TYPE_TEXT} title="接货人电话"
                                                 content={orderInfo.receiverPhone}/>
                                <InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>
                            </View>,
                            <View style={styles.tableInfoCard}>
                                <View style={styles.containers}>
                                    {this._renderTitle("订单内容")}
                                    {this._renderHeader(orderHead)}
                                    {this._renderInfoList(orderInfo.itemList)}
                                    {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                    {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                </View>
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
                                </View>,
                                <View style={styles.tableInfoCard}>
                                    <View style={styles.containers}>
                                        {this._renderTitle("订单内容")}
                                        {this._renderHeader(orderHead)}
                                        {this._renderInfoList(orderInfo.itemList)}
                                        {this._renderFooter(orderInfo.totalAmount,orderInfo.totalFee,orderInfo.discountFee,orderInfo.totalFeeFinal)}
                                        {/*{this.props.renderAux?this.props.renderAux():null}*/}
                                    </View>
                                </View>
                            ]
                        );
                    }
                }
            })}
            return orderListView;
        }

    _renderTitle(title){
        return (
            title !== null?
                <View style={styles.titleWrapperStyle}>
                    <Text style={styles.titleStyle}>{title}</Text>
                </View>:null
        );
    }

    _renderHeader(headerList){
        var headerItemList = [];
        headerList.map((headerItem,i)=>{
            headerItemList.push(
                <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{headerItem}</Text></View>
            )
        });
        return(
            <View style={styles.tableWrapperStyle}>{headerItemList}</View>
        );
    }

    _renderInfoList(dataList){
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        return(
            <ListView
                // automaticallyAdjustContentInsets={false}
                dataSource={ds.cloneWithRows(dataList)}
                renderRow={this._renderRow.bind(this)}
            />
        )


    }

    _renderFooter(totalAmount,totalFee,discountFee,totalFeeFinal){
        return(
            <View>
                <View style={{justifyContent:"center",alignItems:"center",borderBottomWidth:1,height:height*0.04}}>
                    <Text style={styles.titleStyle}>账单小结</Text>
                </View>
                <View style={{flexDirection:"row",marginTop:5}}>
                    <View style={{marginLeft:10}}><Text>商品总数：{totalAmount}</Text></View>
                    <View style={{position:"absolute",right:10}}><Text>优惠前总价：{totalFee}</Text></View>
                </View>
                <View style={{flexDirection:"row",marginTop:10,marginBottom:5}}>
                    <View style={{marginLeft:10}}><Text>优惠金额：{discountFee}</Text></View>
                    <View style={{position:"absolute",right:10}}><Text>应付款：{totalFeeFinal}</Text></View>
                </View>
            </View>
        );
    }

    _renderRow(rowData){
        var row=
            <TouchableOpacity
                onPress={()=>{this.navigatorToDetail(rowData)}}
            >
                <View style={styles.tableWrapperStyle}>
                    <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{rowData.nombre}</Text></View>
                    <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{rowData.amount}</Text></View>
                    <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{rowData.price}</Text></View>
                    <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{rowData.total}</Text></View>
                </View>
            </TouchableOpacity>;
        return row;
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

    displayConfirm(){
        this.setState({select:1});
        this.getOrderListOfDate(null,1);

    }

    displayOver(){
        this.setState({select:2});
        this.getOrderListOfDate(this.state.orderDate,2);
    }

    changeToSelf(){
        this.setState({deliver:0});
        this.getOrderListOfDate(null,0);
    }

    changeToDeliver(){
        this.setState({deliver:1});
        this.getOrderListOfDate(null,0);
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

    //商家确认订单
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
                if(this.state.deliver==1) {
                    Alert.alert("抢单成功");
                }
                else{
                    Alert.alert("确认自提订单成功");
                }
                this.getOrderListOfDate(null,0);
            }
        }).catch((err)=>{alert(err);});
    }

    //商家结束订单
    finishCustomerOrder(orderId){
        proxy.postes({
            url: Config.server + "/func/customer/finishCustomerOrder",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderId:orderId,
                merchantId:this.props.merchantId,
            }
        }).then((json)=> {
            if(json.re === 1){
                Alert.alert("订单已完成")
            }
            this.getOrderListOfDate(null,1);
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
    deliver:{
        width:width*0.9,
        flexDirection:"row",
        height:height*0.06,
        borderWidth:2,
        borderColor:'rgb(114, 135, 191)',
        borderRadius:width*0.5,
    },
    selected:{
        borderRadius:width*0.2,
        flex:1,
        // borderWidth:1,
        // borderColor:"red",
        alignItems:"center",
        justifyContent:"center",
    },
    scrollViewContanier:{
        alignItems: 'center',
        marginBottom: 100,
        // borderWidth:1,
        // borderColor:"red",
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
    },
    containers: {
        flex:1
    },
    titleWrapperStyle:{
        height:40,
        width:"100%",
        justifyContent: "center",
        alignItems: "center"
    },
    titleStyle:{
        fontSize:16,
    },
    tableWrapperStyle:{
        height:45,
        width:"100%",
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingHorizontal:10,
        borderBottomWidth:1,
        borderColor:'#888'
    },
    tableItemStyle:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10
    },
    headerItemTextStyle:{
        fontSize:14,
        color:'#333'
    },
    dataItemTextStyle:{
        fontSize:14,
        color:'#888'
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
        merchantId: state.user.supnuevoMerchantId,
    })
)(UnionOrder);

