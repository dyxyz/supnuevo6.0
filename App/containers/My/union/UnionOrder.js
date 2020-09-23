
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
    WebView,
    Platform,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import InputWithCalendar from '../../../components/InputWithCalendar';
import Icon from 'react-native-vector-icons/FontAwesome';
import {TYPE_TEXT,InformationItem} from '../../../components/InformationItem'
import TableView from "../../../components/TableView";
import Config from "../../../../config";
import orderDetail from "./OrderDetail";
var proxy = require('../../../proxy/Proxy');
import {setSpText} from "../../../utils/ScreenUtil";

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
            robList:[],
            notDealList:[],
            dealList:[],
            finishedList:[],
            select:-1,
            deliver:0,
            showProgress: false,
        };
    }

    componentDidMount(): void {
        this.getOrderListOfDate(null,0);
        this.getOrderRobList();
    }

    render() {


        return (
            <View style={{flex: 1}}>
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
                            style={[{height: 80}]}
                            size="large"
                            color="black"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#000', fontSize: 22, alignItems: 'center'}}>
                                请稍候...
                            </Text>
                        </View>
                    </View>
                </Modal>
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
        if(this.state.select==-1){

            const headBody=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderLeftWidth: 2,borderRightWidth:2}]}
                        onPress={() => {
                            this.displayCanRob()
                        }}>
                        <View>


                            <Text style={{color: '#fff',textAlign:'center'}} allowFontScaling={false}>可抢订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayUnDone()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>未确认订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayConfirm()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>已确认订单</Text>


                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayOver()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>已完成订单</Text>


                        </View>
                    </TouchableOpacity>
                </View>




                <ScrollView>
                    {this.state.robList.length==0?
                        <View style={[styles.scrollViewContanier,{marginTop:15}]}>
                            <Text style={{fontSize:18,fontWeight:'bold'}}>暂无相关订单</Text>
                        </View>
                        :
                        <View style={styles.scrollViewContanier}>
                            {this._renderOrderList(this.state.robList)}
                        </View>

                    }

                </ScrollView>
            </View>;
            return headBody;
        }
        else if(this.state.select==0) {
             const body=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayCanRob()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>可抢订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderRightWidth: 2}]}
                        onPress={() => {
                        this.displayUnDone()
                    }}>
                        <View>


                                <Text style={{color: '#fff',textAlign:'center'}} allowFontScaling={false}>未确认订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayConfirm()
                        }}>
                        <View>

                            <Text style={styles.headText} allowFontScaling={false}>已确认订单</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select,{borderLeftWidth:2}]}
                        onPress={() => {
                        this.displayOver()
                    }}>
                        <View>

                                <Text style={styles.headText} allowFontScaling={false}>已完成订单</Text>
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
                                         <Text allowFontScaling={false}>自提订单</Text>
                                     </View>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToDeliver()}}
                                     style={styles.selected}
                                 >
                                     <View>
                                         <Text allowFontScaling={false}>配送订单</Text>
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
                                         <Text allowFontScaling={false}>自提订单</Text>
                                     </View>
                                 </TouchableOpacity>
                                 <TouchableOpacity
                                     onPress={()=>{this.changeToDeliver()}}
                                     style={[styles.selected,{backgroundColor:'rgb(114, 135, 191)'}]}
                                 >
                                     <View>
                                         <Text allowFontScaling={false}>配送订单</Text>
                                     </View>
                                 </TouchableOpacity>
                             </View>
                         </View>
                 }
                <ScrollView>
                    {this.state.notDealList.length == 0 ?
                        <View style={[styles.scrollViewContanier, {marginTop: 15}]}>
                            <Text style={{fontSize: 18, fontWeight: 'bold'}}>暂无相关订单</Text>
                        </View>
                        :
                        <View style={styles.scrollViewContanier}>
                            {this._renderOrderList(this.state.notDealList)}
                        </View>
                    }
                </ScrollView>


            </View>;

            return body
        }

    else if(this.state.select==1){

             const elsebody=<View style={{height:height*0.82}}>
                <View style={{flexDirection: "row", width: width}}>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayCanRob()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>可抢订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                        this.displayUnDone()
                    }}>
                        <View>


                                <Text style={styles.headText} allowFontScaling={false}>未确认订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderLeftWidth: 2,borderRightWidth:2}]}
                        onPress={() => {
                        this.displayConfirm()
                    }}>
                        <View>


                                <Text style={{color: '#fff',textAlign:'center'}} allowFontScaling={false}>已确认订单</Text>


                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayOver()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>已完成订单</Text>


                        </View>
                    </TouchableOpacity>
                </View>




                 <ScrollView>
                     {this.state.dealList.length == 0 ?
                         <View style={[styles.scrollViewContanier, {marginTop: 15}]}>
                             <Text style={{fontSize: 18, fontWeight: 'bold'}}>暂无相关订单</Text>
                         </View>
                         :
                         <View style={styles.scrollViewContanier}>
                             {this._renderOrderList(this.state.dealList)}
                         </View>
                     }
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
                            this.displayCanRob()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>可抢订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select,{borderRightWidth:2}]}
                        onPress={() => {
                            this.displayUnDone()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>未确认订单</Text>

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.select}
                        onPress={() => {
                            this.displayConfirm()
                        }}>
                        <View>


                            <Text style={styles.headText} allowFontScaling={false}>已确认订单</Text>


                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.select, {backgroundColor: "#39c7c8", borderLeftWidth: 2}]}
                        onPress={() => {
                            this.displayOver()
                        }}>
                        <View>


                            <Text style={{color: '#fff',textAlign:'center'}} allowFontScaling={false}>已完成订单</Text>


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
                        {this.state.finishedList.length == 0 ?
                            <View style={[styles.scrollViewContanier, {marginTop: 15}]}>
                                <Text style={{fontSize: 18, fontWeight: 'bold'}}>暂无相关订单</Text>
                            </View>
                            :
                            this._renderOrderList(this.state.finishedList)
                        }
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
                if(this.state.select==-1){
                    orderListView.push([
                        <View style={styles.container}>
                            <Text style={styles.text}>订单编号：{order.orderNum}</Text>
                        </View>,
                            <View style={styles.basicInfoContainer}>
                                {/*<InformationItem key={0} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>*/}
                                <InformationItem key={1} type={TYPE_TEXT} title="送货地址"
                                                 content={order.receiverAddr}/>
                                {/*<InformationItem key={2} type={TYPE_TEXT} title="接货人电话" content={order.receiverPhone}/>*/}
                                <InformationItem key={3} type={TYPE_TEXT} title="订单总价"
                                                 content={order.totalFeeFinal}/>
                            </View>,

                            <View style={{
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: height * 0.02,
                                marginBottom: height * 0.02
                            }}>
                                <TouchableOpacity onPress={() => {
                                    this.affirmCustomerOrder(order.orderId)
                                }}>
                                    <View style={styles.button}>
                                        <Text style={{color: '#fff'}}>抢单</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>,
                            <View style={{height:5,backgroundColor:'gray',width:width}}/>

                        ]
                    );
                }
                //未确认的配送订单
                else if(this.state.select==0 && this.state.deliver==1) {
                    if (orderInfo.deliveryType == 0) {
                        orderListView.push([
                                <View style={styles.container}>
                                    <Text style={styles.text}>订单编号：{orderInfo.orderNum}</Text>
                                </View>,
                                <View style={styles.basicInfoContainer}>
                                    {/*<InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>*/}
                                    {/*<InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"商家送货"}/>*/}
                                    <InformationItem key={0} type={TYPE_TEXT} title="送货地址"
                                                     content={orderInfo.receiverAddr}/>
                                    <InformationItem key={1} type={TYPE_TEXT} title="订单总价"
                                                     content={orderInfo.totalFeeFinal}/>
                                    {/*<InformationItem key={3} type={TYPE_TEXT} title="接货人电话"*/}
                                                     {/*content={orderInfo.receiverPhone}/>*/}
                                    {/*<InformationItem key={4} type={TYPE_TEXT} title="接货人" content={orderInfo.receiverName}/>*/}
                                    {/*<InformationItem key={5} type={TYPE_TEXT} title="送货时间" content={orderInfo.wiseSaleTime}/>*/}
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
                                            <Text style={{color: '#fff'}}>接单</Text>
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
                                    {/*<InformationItem key={0} type={TYPE_TEXT} title="客户手机号码" content={telephone}/>*/}
                                    {/*<InformationItem key={1} type={TYPE_TEXT} title="订单类型" content={"自提"}/>*/}
                                    <InformationItem key={0} type={TYPE_TEXT} title="提货时间" content={orderInfo.wiseSaleTime}/>
                                    <InformationItem key={1} type={TYPE_TEXT} title="订单总价" content={orderInfo.totalFeeFinal}/>
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
                                        <Text style={{color: '#fff'}}>接单</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>,

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
                                <InformationItem key={5} type={TYPE_TEXT} title="送货时间" content={orderInfo.wiseSaleTime}/>
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
                                    <InformationItem key={2} type={TYPE_TEXT} title="提货时间" content={orderInfo.wiseSaleTime}/>
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

    displayCanRob(){
        this.setState({select:-1});
        this.getOrderRobList();
    }

    displayUnDone(){
        this.setState({select:0});
        this.getOrderListOfDate(null,0,1);
    }

    displayConfirm(){
        this.setState({select:1});
        this.getOrderListOfDate(null,1,2);

    }

    displayOver(){
        this.setState({select:2});
        this.getOrderListOfDate(this.state.orderDate,2,3);
    }

    changeToSelf(){
        this.setState({deliver:0});
        this.getOrderListOfDate(null,0,1);
    }

    changeToDeliver(){
        this.setState({deliver:1});
        this.getOrderListOfDate(null,0,1);
    }

    getOrderRobList(){
        this.setState({showProgress:true})
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfUnionCanGrab",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            console.log(json)
            if(json.re === 1){
                var data = json.data;
                this.setState({robList:data})
            }
            this.setState({showProgress:false})
        }).catch((err)=>{alert(err);});
    }

    getOrderListOfDate(orderDate,orderState,orderType){
        this.setState({showProgress:true})
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfDateByUnion",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderDate: orderDate,
                unionId: this.props.unionId,
                orderState:orderState,
                merchantId:this.props.merchantId,
            }
        }).then((json)=> {
            console.log(json)
            if(json.re === 1){
                var data = json.data;
                if(orderType==1){
                    this.setState({notDealList:data})
                }
                else if(orderType==2){
                    this.setState({dealList:data})
                }
                else{
                    this.setState({finishedList:data})
                }

            }
            this.setState({showProgress:false})
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
                    this.getOrderListOfDate(null,0,1);
                    this.getOrderRobList()
                }
                else{
                    Alert.alert("确认自提订单成功");
                    this.getOrderListOfDate(null,0,1);
                }

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
            this.getOrderListOfDate(null,1,2);
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
    headText:{
        textAlign:'center'
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
        height:'auto',
        paddingTop:height*0.015,
        paddingBottom:height*0.015
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
        // height:45,
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
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
        merchantId: state.user.supnuevoMerchantId,
    })
)(UnionOrder);

