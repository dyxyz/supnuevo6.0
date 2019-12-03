/**
 * Created by dingyiming on 2016/12/14.
 */

import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view';
import {connect} from 'react-redux';
import CheckBox from 'react-native-check-box';
import {setSpText} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');
import Config from '../../../config';
import _ from 'lodash';
var {height, width} = Dimensions.get('window');


class ChangeGroupPrice extends Component {


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
            var dataSource0 = this.state.dataSource0.cloneWithRows(relatedGoods0);
            this.setState({
                relatedGoods0: relatedGoods0,
                selectAll: !this.state.selectAll,
                dataSource0: dataSource0
            });
        }
    }

    renderRow(rowData, sectionId, rowId) {

        var lineStyle = null;
        if (parseInt(rowId) % 2 == 0) {
            lineStyle = {
                flex: 1,
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
        if (rowData.checked == true) {
            chebx = <CheckBox
                style={{flex: 1, padding: 2}}
                onClick={() => {
                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                    relatedGoods1.map(function (good, i) {
                        if (good.commodityId == rowData.commodityId)
                            good.checked = false;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1,
                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
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
                        if (good.commodityId == rowData.commodityId)
                            good.checked = true;
                    });
                    this.setState({
                        relatedGoods1: relatedGoods1,
                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
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
                            rowData.checked == true ?
                                <TouchableOpacity onPress={function () {
                                    var relatedGoods1 = _.cloneDeep(this.state.relatedGoods1);
                                    relatedGoods1.map(function (good, i) {
                                        if (good.commodityId == rowData.commodityId) {
                                            good.checked = false;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1,
                                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
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
                                        if (good.commodityId == rowData.commodityId) {
                                            good.checked = true;
                                        }
                                    });
                                    this.setState({
                                        relatedGoods1: relatedGoods1,
                                        dataSource1: this.state.dataSource1.cloneWithRows(relatedGoods1)
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
                                fontSize: setSpText(16)
                            }}>{rowData.codigo + '\n' + rowData.goodName}</Text>
                        </View>

                    </View>
                </TouchableOpacity>
            </View>;
        return row;
    }

    getCommodityGroupList() {
        let codigo = this.state.codigo;
        if (codigo == null || codigo == undefined || codigo == "") {
            alert("error");
            return;
        }

        proxy.postes({
            url: Config.server + '/func/commodity/getCommodityGroupListMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                codigo: codigo,
            }
        }).then((json) => {

            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                if (json.arrayList !== undefined) {
                    this.setState({commodiList: json.arrayList});
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    componentWillMount() {
        this.getCommodityGroupList();
    }

    constructor(props) {
        super(props);
        const ds0 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        const ds1 = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {

            codigo: props.codigo,
            price: props.price,
            commodiList: [],


            bgColor: "#3b5998",
            wait: false,
            merchantId: props.merchantId,
            goodInfo: props.goodInfo,
            relatedGoods0: null,
            relatedGoods1: null,
            selectAll: false,
            dataSource0: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
            dataSource1: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2}),
        };
    }


    render() {

        const {username} = this.props;
        const {goodInfo} = this.props;
        let commodiList = this.state.commodiList;
        var listView = null;

        if (commodiList.length > 0) {
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(commodiList)}
                    renderRow={this.renderRow.bind(this)}
                />;

        }


        return (
            <View style={{flex: 1}}>
                <ScrollView>

                    {/* header bar */}
                    <View style={[{
                        backgroundColor: 'rgba(240,240,240,0.8)',
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }, styles.card]}>
                        <TouchableOpacity style={{flex: 1}}
                                          onPress={
                                              function () {
                                                  // this.goBack();
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
                                              // this.changePriceRelated();
                                          }.bind(this)}>
                            <Text style={{color: '#fff', fontWeight: 'bold', fontSize: setSpText(14)}}>改价</Text>
                            <Icon name="check" size={24} color="#fff"/>
                        </TouchableOpacity>
                    </View>


                    {/*显示组改价名称*/}
                    <View style={[styles.card, {padding: 8, borderWidth: 0}]}>
                        <View>
                            <Text style={{color: '#222', fontSize: setSpText(18)}}>
                                改动的价格:  &nbsp;&nbsp;&nbsp;
                                <Text style={{fontSize: setSpText(18), fontWeight: 'bold'}}>
                                    {goodInfo.priceShow}
                                </Text>
                            </Text>
                        </View>
                        <View>
                            <Text style={{color: '#222', fontSize: setSpText(16)}}>
                                商品组名: &nbsp;&nbsp;&nbsp;<Text
                                style={{color: '#222', fontSize: setSpText(18), fontWeight: 'bold'}}>{goodInfo.groupName}</Text>
                            </Text>
                        </View>
                    </View>


                    <View style={{padding: 10, paddingLeft: 0, paddingRight: 0}}>

                        {/*显示组内商品列表*/}
                        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>

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
                        <ScrollView>
                            <View style={{margin: 10, borderWidth: 1, borderColor: '#343434'}}>
                                {listView}
                            </View>
                        </ScrollView>
                        <View style={{height: 50, width: width}}></View>


                    </View>
                </ScrollView>
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


module.exports = ChangeGroupPrice;
