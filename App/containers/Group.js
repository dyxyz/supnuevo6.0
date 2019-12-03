/**
 * Created by danding on 16/11/21.
 */
import React, {Component} from 'react';

import {
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Text,
    TextInput,
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    FlatList,
    Platform
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import CheckBox from 'react-native-check-box';
import Config from '../../config';
import _ from 'lodash';
import {setSpText} from '../utils/ScreenUtil'
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../proxy/Proxy');
var item_height=80

class Group extends Component {

    goBack() {
        this.props.reset();
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    toggleAll() {
        if (this.state.relatedGoods0 !== undefined && this.state.relatedGoods0 !== null) {
            var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
            if (this.state.selectAll != true) {
                relatedGoods0.map(function (good, i) {
                    good.checked = true;
                });
            } else {
                relatedGoods0.map(function (good, i) {
                    good.checked = false;
                });
            }
            this.setState({
                relatedGoods0: relatedGoods0,
                selectAll: !this.state.selectAll,
            });
        }
    }

    getCommoditiesByPriceId(commodityId) {

        var merchantId = this.props.merchantId;
        var sessionId = this.props.sessionId;
        var codigo = this.props.codigo;
        var updatePrice = this.props.price;
        var goodInfo = this.props.goodInfo
        if (codigo == undefined || codigo == null) {
            return;
        }
        proxy.postes({
            url: Config.server + '/func/commodity/getSupnuevoBuyerCommodityPriceFormListOfGroupMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId,
                codigo: codigo,
                updatePrice:updatePrice.toString()
            }
        }).then((json) => {
            var errorMsg = json.errorMessage;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                var relatedGoods0 = json.array0;
                var relatedGoods1 = json.array1;
                const {goodInfo} = this.props;
                var goodIndex = 0;

                if (relatedGoods0 != undefined && relatedGoods0 != null)
                    relatedGoods0.map(function (good, i) {
                        if (good.commodityId == commodityId || good.groupPriceMark == 1 || good.flag==1) {
                            good.checked = true;
                            if(good.commodityId == commodityId)good.price = goodInfo.oldPrice;
                        } else {
                            good.checked = false;
                        }
                        if (good.sizeValue != undefined && good.sizeValue != null
                            && good.sizeUnit != undefined && good.sizeUnit != null) {
                            good.goodName = good.nombre + ',' +
                                good.sizeValue + ',' + good.sizeUnit;
                        } else {
                            good.goodName = good.nombre;
                        }

                        if(good.commodityId == commodityId ){
                            goodIndex = i;
                        }

                    });
                if (relatedGoods1 != undefined && relatedGoods1 != null)
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == commodityId || good.groupPriceMark == 1 || good.flag==1) {
                            good.checked = true;
                            if(good.commodityId == commodityId)good.price = goodInfo.oldPrice;
                        } else {
                            good.checked = false;
                        }
                        if (good.sizeValue != undefined && good.sizeValue != null
                            && good.sizeUnit != undefined && good.sizeUnit != null) {
                            good.goodName = good.nombre + ',' +
                                good.sizeValue + ',' + good.sizeUnit;
                        } else {
                            good.goodName = good.nombre;
                        }

                        if(good.commodityId == commodityId ){
                            goodIndex = i;
                        }
                    });

                relatedGoods0.sort(function(a,b){
                    return a.price - b.price
                })

                //TDOO:set state relatedGoods
                this.setState({
                    relatedGoods0: relatedGoods0, relatedGoods1: relatedGoods1,goodIndex:goodIndex
                });

                setTimeout(() => {
                    var goodIndex = this.state.goodIndex-1
                    if(goodIndex>0)
                    this._flatList0.scrollToIndex({animated: true, index: goodIndex, viewPosition: 0})
                }, 2000)

            }
        }).catch((err) => {
            alert(err);
        });

    }

    renderRow0(item, index) {

        var lineStyle = null;
        if (parseInt(index) % 2 == 0) {
            lineStyle = {
                flex: 1,
                height:item_height,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#C4D9FF'
            };
        } else {
            lineStyle = {
                flex: 1,
                height:item_height,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#fff'
            }
        }

        var chebx = null;
        if (item.checked == true) {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                    relatedGoods0.map(function (good, i) {
                        if (good.commodityId == item.commodityId)
                            good.checked = false;
                    });
                    this.setState({
                        relatedGoods0: relatedGoods0,
                    });
                }}
                isChecked={true}
                leftText={null}
            />;
        } else {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                    relatedGoods0.map(function (good, i) {
                        if (good.commodityId == item.commodityId)
                            good.checked = true;
                    });
                    this.setState({
                        relatedGoods0: relatedGoods0,
                    });

                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row =
            <View>

                <View style={lineStyle}>

                    {
                        item.checked == true ?
                            <TouchableOpacity onPress={function () {
                                var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                                relatedGoods0.map(function (good, i) {
                                    if (good.commodityId == item.commodityId) {
                                        good.checked = false;
                                    }
                                });
                                this.setState({
                                    relatedGoods0: relatedGoods0,
                                });
                            }.bind(this)}>
                                <View style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8
                                }}>
                                    <Icon name='check-square' size={24} color="#444"></Icon>
                                </View>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={function () {
                                var relatedGoods0 = _.cloneDeep(this.state.relatedGoods0);
                                relatedGoods0.map(function (good, i) {
                                    if (good.commodityId == item.commodityId) {
                                        good.checked = true;
                                    }
                                });
                                this.setState({
                                    relatedGoods0: relatedGoods0
                                });
                            }.bind(this)}>
                                <View style={{
                                    flex: 3,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 8
                                }}>
                                    <Icon name='square-o' size={24} color="#444"></Icon>
                                </View>
                            </TouchableOpacity>

                    }

                    <View style={{
                        flex: 10,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'flex-start',
                        padding: 8
                    }}>
                        <View style={{
                        flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{
                            flex:3,
                            color: '#000',textAlign:'left',
                            fontWeight: 'bold',
                            fontSize: setSpText(18)
                        }}>{item.codigo}</Text>
                            <Text style={{
                                flex:2,textAlign:'right',
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: setSpText(18)
                        }}>原价位：{item.price}</Text>
                        </View>

                        <View style={{
                        flex: 1,flexDirection: 'row',justifyContent: 'center',alignItems: 'center'}}>
                        <Text style={{
                            color: '#000',
                            fontWeight: 'bold',
                            fontSize: setSpText(18)
                        }}>{item.goodName}</Text></View>
                    </View>

                </View>

            </View>;

        return row;
    }

    renderRow1(item, index) {

        var lineStyle = null;
        if (parseInt(index) % 2 == 0) {
            lineStyle = {
                flex: 1,
                height:item_height,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#ece863'
            };
        } else {
            lineStyle = {
                flex: 1,
                height:item_height,
                flexDirection: 'row',
                padding: 8,
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: '#ddd',
                justifyContent: 'flex-start',
                backgroundColor: '#fff'
            }
        }

        var chebx = null;
        if (item.checked == true) {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == item.commodityId)
                            good.checked = false;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1,
                    });
                }}
                isChecked={true}
                leftText={null}
            />;
        } else {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == item.commodityId)
                            good.checked = true;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1
                    });

                }}
                isChecked={false}
                leftText={null}
            />;
        }


        var row =
            <View>
                <TouchableOpacity onPress={
                    function () {
                        //TODO:
                    }.bind(this)}>
                    <View style={lineStyle}>
                        {
                            item.checked == true ?
                                <TouchableOpacity onPress={function () {
                                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                                    relatedGoods1.map(function (good, i) {
                                        if (good.commodityId == item.commodityId) {
                                            good.checked = false;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1
                                    });
                                }.bind(this)}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 8
                                    }}>
                                        <Icon name='check-square' size={24} color="#444"></Icon>
                                    </View>
                                </TouchableOpacity>
                                :
                                <TouchableOpacity onPress={function () {
                                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                                    relatedGoods1.map(function (good, i) {
                                        if (good.commodityId == item.commodityId) {
                                            good.checked = true;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1
                                    });
                                }.bind(this)}>
                                    <View style={{
                                        flex: 3,
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        padding: 8
                                    }}>
                                        <Icon name='square-o' size={24} color="#444"></Icon>
                                    </View>
                                </TouchableOpacity>

                        }

                        <View style={{
                            flex: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: 8
                        }}>
                            <Text style={{
                                color: '#000',
                                fontWeight: 'bold',
                                fontSize: setSpText(18)
                            }}>{item.codigo + '\n' + item.goodName}</Text>
                        </View>

                    </View>
                </TouchableOpacity>

            </View>;
        return row;
    }

    changePriceRelated() {
        var selectedRelativePriceIds = [];
        var relatedGoods0 = this.state.relatedGoods0;
        var relatedGoods1 = this.state.relatedGoods1;
        relatedGoods0.map(function (good, i) {
            if (good.checked == true) {
                selectedRelativePriceIds.push(good.commodityId);
            }
        });
        relatedGoods1.map(function (good, i) {
            if (good.checked == true) {
                selectedRelativePriceIds.push(good.commodityId);
            }
        });
        const {goodInfo} = this.props;
        const {merchantId} = this.props;
        var sessionId = this.props.sessionId;
        this.setState({wait: true, bgColor: "#D4D4D4"});
        //TODO:make a fetch
        let price = this.state.price;
        if (price === null) {
            alert("请先设置价格");
            return;
        }
        proxy.postes({
            url: Config.server + '/func/commodity/updateSupnuevoBuyerCommodityPriceGroupMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityIds: selectedRelativePriceIds.toString(),
                merchantId: merchantId,
                priceShow: price.toString(),
                printType: goodInfo.printType,
                price: price.toString(),
                appVersion:this.state.appVersion
            }
        }).then((json) => {
            this.setState({wait: false, bgColor: "#3b5998"});
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                Alert.alert(
                    'Alert Title',
                    '组改价成功',
                    [
                        {text: 'OK', onPress: () => this.goBack()},
                    ]
                );
            }
        }).catch((err) => {
            alert(err);
        });


    }

    constructor(props) {
        super(props);
        this.state = {
            bgColor: "#3b5998",
            wait: false,
            merchantId: props.merchantId,
            goodInfo: props.goodInfo,
            relatedGoods0: null,
            relatedGoods1: null,
            price: props.price,
            selectAll: false,
            goodIndex:0,
            appVersion:'app5.2'
        };
    }

    render() {

        const {username} = this.props;
        const {goodInfo} = this.props;

        var relatedGoods0 = [];
        if (this.state.relatedGoods0 !== undefined && this.state.relatedGoods0 !== null) {
            relatedGoods0 = this.state.relatedGoods0;
        } else {
            this.getCommoditiesByPriceId(goodInfo.commodityId);
        }

        var relatedGoods1 = [];
        if (this.state.relatedGoods1 !== undefined && this.state.relatedGoods1 !== null) {
            relatedGoods1 = this.state.relatedGoods1;
        }

        var listView0 = null;
        var listView1 = null;
        if (relatedGoods0.length > 0) {

            listView0 =
                <FlatList
                    ref={(flatList0) => this._flatList0 = flatList0}
                    data={relatedGoods0}
                    renderItem={({item,index}) => this.renderRow0(item,index)}
                    getItemLayout={(data, index) => (
                            { length: item_height, offset: (item_height + 2) * index, index }) }
                    extraData={this.state}
                />;

        } else {
        }

        if (relatedGoods1.length > 0) {

            listView1 =
                <FlatList
                    ref={(flatList1) => this._flatList1 = flatList1}
                    data={relatedGoods1}
                    renderItem={({item,index}) => this.renderRow1(item,index)}
                    getItemLayout={(data, index) => (
                            { length: item_height, offset: (item_height + 2) * index, index }) }
                />;

        } else {
        }

        return (
            <View style={{flex: 1}}>
                    {/* header bar */}
                    <View style={[{
                        backgroundColor: 'rgba(240,240,240,0.8)',
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingTop:Platform.OS=='ios'?40:10
                    }, styles.card]}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={
                                              function () {
                                                  this.goBack();
                                              }.bind(this)}>
                            <Icon name='chevron-left' size={24} color="#444"></Icon>
                        </TouchableOpacity>
                        <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#444', fontWeight: 'bold'}}>
                            {username}
                        </Text>
                        <TouchableOpacity style={{
                            flex: 1,
                            marginRight: 0,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            backgroundColor: this.state.bgColor,
                            alignItems: 'center',
                            paddingLeft: 20,
                            paddingRight: 4,
                            paddingTop: 4,
                            paddingBottom: 4,
                            borderRadius: 6
                        }}
                                          disabled={this.state.wait}
                                          onPress={function () {
                                              this.changePriceRelated();
                                          }.bind(this)}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: setSpText(17)}}>改价</Text>
                            <Icon name="check" size={24} color="#fff"/>
                        </TouchableOpacity>
                    </View>

                    {/*显示组改价名称*/}
                <View style={{flex:1}}>
                    <View style={[styles.card, {padding: 8, borderWidth: 0}]}>
                        <View>
                            <Text style={{color: '#222', fontSize: setSpText(20)}}>
                                改动的价格:  &nbsp;&nbsp;&nbsp;
                                <Text style={{fontSize: setSpText(22), fontWeight: 'bold'}}>
                                    {this.state.price}
                                </Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={{color: '#222', fontSize: setSpText(20)}}>
                                商品组名: &nbsp;&nbsp;&nbsp;<Text
                                style={{color: '#222', fontSize: setSpText(18), fontWeight: 'bold'}}>{goodInfo.groupName}</Text>
                            </Text>
                        </View>
                    </View>


                    <View style={{padding: 10, paddingLeft: 0, paddingRight: 0}}>

                        {/*显示组内商品列表*/}
                        <View style={{height:50, flexDirection: 'row', justifyContent: 'flex-start'}}>

                            <TouchableOpacity style={{
                                flex: 3, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                backgroundColor: '#90B4FF', borderBottomWidth: 1, borderColor: '#aaa', padding: 8
                            }}
                                              onPress={
                                                  function () {
                                                      this.toggleAll();
                                                  }.bind(this)}>

                                <Text style={{color: '#fff', fontWeight: 'bold'}}>
                                    {this.state.selectAll != true ? '全选' : '全不选'}&nbsp;
                                </Text>
                                <Icon name='hand-pointer-o' size={20} color="#fff"></Icon>
                            </TouchableOpacity>

                            <View style={{
                                flex: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
                                borderColor: '#aaa', borderWidth: 1, borderRightWidth: 0, padding: 8
                            }}>
                                <Text>商品信息</Text>
                            </View>

                        </View>

                            <View style={{margin: 10, borderWidth: 1, borderColor: '#343434',marginBottom:180}}>
                                {listView0}
                            </View>


                    </View>
                </View>
            </View>);
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        borderBottomWidth: 0,
        shadowColor: '#eee',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    separator: {
        height: 1,
        backgroundColor: '#E8E8E8',
    },
    body: {
        padding: 10
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    }
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(Group);

