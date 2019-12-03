import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    TextInput,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view';
import {connect} from 'react-redux';
import Config from '../../../config';
import {setGoodsInfo, setJisuanPrice} from "../../action/actionCreator";
import {setSpText} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');
var {height, width} = Dimensions.get('window');


class CaluConfig extends Component {

    close() {
        if (this.props.onClose !== undefined && this.props.onClose !== null) {
            this.props.onClose();
        }
    }

    confirmStorage() {//js显示浮点都用String，计算的时候转成Double

        let IVAprice1 = this.state.IVAprice1;
        let IVAprice2 = this.state.IVAprice2;
        let IVAprice3 = this.state.IVAprice3;
        let IVAprice4 = this.state.IVAprice4;
        let profitprice1 = this.state.profitprice1;
        let profitprice2 = this.state.profitprice2;
        let profitprice3 = this.state.profitprice3;
        let profitprice4 = this.state.profitprice4;
        let doubleORper = this.state.doubleORper;//1是浮点制，2是百分制
        if (IVAprice1 == "" || IVAprice1 == undefined || IVAprice1 == null) {
            IVAprice1 = 1.00;
        }
        if (IVAprice2 == "" || IVAprice2 == undefined || IVAprice2 == null) {
            IVAprice2 = 1.00;
        }
        if (IVAprice3 == "" || IVAprice3 == undefined || IVAprice3 == null) {
            IVAprice3 = 1.00;
        }
        if (IVAprice4 == "" || IVAprice4 == undefined || IVAprice4 == null) {
            IVAprice4 = 1.00;
        }
        if (profitprice1 == "" || profitprice1 == undefined || profitprice1 == null) {
            profitprice1 = 1.00;
        }
        if (profitprice2 == "" || profitprice2 == undefined || profitprice2 == null) {
            profitprice2 = 1.00;
        }
        if (profitprice3 == "" || profitprice3 == undefined || profitprice3 == null) {
            profitprice3 = 1.00;
        }
        if (profitprice4 == "" || profitprice4 == undefined || profitprice4 == null) {
            profitprice4 = 1.00;
        }
        this.setState({querenstate: true});
        proxy.postes({
            url: Config.server + '/func/commodity/setCalculationStorageMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                doubleORper: doubleORper,
                IVAprice1: IVAprice1 + " ",
                IVAprice2: IVAprice2 + " ",
                IVAprice3: IVAprice3 + " ",
                IVAprice4: IVAprice4 + " ",
                profitprice1: profitprice1 + " ",
                profitprice2: profitprice2 + " ",
                profitprice3: profitprice3 + " ",
                profitprice4: profitprice4 + " ",
            }
        }).then((json) => {
            this.setState({querenstate: false});
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
                return;
            } else {
                if (json.message !== undefined && json.message !== null && json.message == "OK") {
                    const {dispatch} = this.props;
                    dispatch(setJisuanPrice({
                        AddIva0: this.state.IVAprice1,
                        AddIva1: this.state.IVAprice2,
                        AddIva2: this.state.IVAprice3,
                        AddIva3: this.state.IVAprice4,
                        AddProfit0: this.state.profitprice1,
                        AddProfit1: this.state.profitprice2,
                        AddProfit2: this.state.profitprice3,
                        AddProfit3: this.state.profitprice4,
                        AddMode: this.state.doubleORper,
                    }));
                    this.close();
                }

            }
        }).catch((err) => {
            alert(err);
        });
    }

    changeJiSuanWay(code) {
        let doubleORper = this.state.doubleORper;
        let IVAprice1 = this.state.IVAprice1;
        let IVAprice2 = this.state.IVAprice2;
        let IVAprice3 = this.state.IVAprice3;
        let IVAprice4 = this.state.IVAprice4;

        let profitprice1 = this.state.profitprice1;
        let profitprice2 = this.state.profitprice2;
        let profitprice3 = this.state.profitprice3;
        let profitprice4 = this.state.profitprice4;

        let end = (IVAprice1 * 1000).toFixed(1) - 1000;

        if (doubleORper != code) {
            if (doubleORper == 1 && code == 2) {
                //将浮点数转化成百分数
                this.setState({
                    doubleORper: 2,
                    IVAprice1: ((IVAprice1 * 1000).toFixed(0) - 1000) / 10,
                    IVAprice2: ((IVAprice2 * 1000).toFixed(0) - 1000) / 10,
                    IVAprice3: ((IVAprice3 * 1000).toFixed(0) - 1000) / 10,
                    IVAprice4: ((IVAprice4 * 1000).toFixed(0) - 1000) / 10,
                    profitprice1: ((profitprice1 * 1000 ).toFixed(0) - 1000) / 10,
                    profitprice2: ((profitprice2 * 1000 ).toFixed(0) - 1000) / 10,
                    profitprice3: ((profitprice3 * 1000 ).toFixed(0) - 1000) / 10,
                    profitprice4: ((profitprice4 * 1000 ).toFixed(0) - 1000) / 10,
                });
            } else if (doubleORper == 2 && code == 1) {
                this.setState({
                    doubleORper: 1,
                    IVAprice1: (IVAprice1 * 10 + 1000 ) / 1000,
                    IVAprice2: (IVAprice2 * 10 + 1000 ) / 1000,
                    IVAprice3: (IVAprice3 * 10 + 1000 ) / 1000,
                    IVAprice4: (IVAprice4 * 10 + 1000) / 1000,
                    profitprice1: (profitprice1 * 10 + 1000 ) / 1000,
                    profitprice2: (profitprice2 * 10 + 1000 ) / 1000,
                    profitprice3: (profitprice3 * 10 + 1000 ) / 1000,
                    profitprice4: (profitprice4 * 10 + 1000 ) / 1000,
                });
            }
        }
    }

    constructor(props) {
        super(props);
        const {codes} = this.props;
        this.state = {
            querenstate: false,
            doubleORper: props.doubleORper,//1是浮点制，2是百分制

            IVAprice1: props.IVAprice1,
            IVAprice2: props.IVAprice2,
            IVAprice3: props.IVAprice3,
            IVAprice4: props.IVAprice4,

            profitprice1: props.profitprice1,
            profitprice2: props.profitprice2,
            profitprice3: props.profitprice3,
            profitprice4: props.profitprice4,

        }
    }

    render() {

        let doubleORper = this.state.doubleORper;//1是浮点制，2是百分制


        let IVAprice1 = this.state.IVAprice1;
        let IVAprice2 = this.state.IVAprice2;
        let IVAprice3 = this.state.IVAprice3;
        let IVAprice4 = this.state.IVAprice4;

        let profitprice1 = this.state.profitprice1;
        let profitprice2 = this.state.profitprice2;
        let profitprice3 = this.state.profitprice3;
        let profitprice4 = this.state.profitprice4;

        return (
            <ScrollView>
                <View style={{flex: 1, backgroundColor: '#f0f0f0'}}>

                    {/*header*/}
                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 4,
                        paddingTop: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }, styles.card]}>
                        <View style={{flex: 1, paddingLeft: 10}}>
                            <TouchableOpacity onPress={
                                () => {
                                    this.close();
                                }
                            }>
                                <Icon name="times-circle" size={30} color="#fff"/>
                            </TouchableOpacity>
                        </View>
                        <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                            设置计算键
                        </Text>
                        <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                        </View>
                    </View>

                    {/*条型码列表*/}
                    <View style={{padding: 10}}>
                        <TouchableOpacity style={{flexDirection: 'row', paddingLeft: 10, alignItems: 'center'}}
                                          onPress={() => {
                                              this.changeJiSuanWay(1);
                                              // this.setState({doubleORper: 1})
                                          }}>
                            {doubleORper === 1 ?
                                <Icon name="check-circle-o" size={22} color="#000000"/>
                                :
                                <Icon name="circle-o" size={22} color="#000000"/>
                            }
                            <Text style={{fontSize: setSpText(16), paddingLeft: 10, paddingRight: 10}}>
                                使用浮点制
                            </Text>
                            <Text>例:1.05</Text>
                            <Text style={{paddingLeft: 10}}>100*1.05=105</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{flexDirection: 'row', paddingLeft: 10, alignItems: 'center'}}
                                          onPress={() => {
                                              this.changeJiSuanWay(2);
                                              // this.setState({doubleORper: 2})
                                          }}>
                            {doubleORper === 2 ?
                                <Icon name="check-circle-o" size={22} color="#000000"/>
                                :
                                <Icon name="circle-o" size={22} color="#000000"/>
                            }
                            <Text style={{fontSize: setSpText(16), paddingLeft: 10, paddingRight: 10}}>
                                使用百分制
                            </Text>
                            <Text>例:5%</Text>
                            <Text style={{paddingLeft: 19}}>100+100*5%=105</Text>
                        </TouchableOpacity>

                        <View style={{paddingLeft: 10, paddingTop: 10}}>
                            <Text style={{fontSize: setSpText(20),}}>
                                IVA乘数：
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={IVAprice1 + ''}
                                    onChangeText={(price) => {
                                        this.setState({IVAprice1: price});
                                    }}
                                    placeholderTextColor="#fff"
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }
                            </View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={IVAprice2 + ''}
                                    onChangeText={(price) => {
                                        this.setState({IVAprice2: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }
                            </View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={IVAprice3 + ''}
                                    onChangeText={(price) => {
                                        this.setState({IVAprice3: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }
                            </View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={IVAprice4 + ''}
                                    onChangeText={(price) => {
                                        this.setState({IVAprice4: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }
                            </View>
                        </View>
                    </View>
                    <View style={{padding: 10}}>
                        <View style={{paddingLeft: 10}}>
                            <Text style={{fontSize: setSpText(20),}}>
                                利润乘数：
                            </Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={profitprice1 + ''}
                                    onChangeText={(price) => {
                                        this.setState({profitprice1: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }</View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={profitprice2 + ''}
                                    onChangeText={(price) => {
                                        this.setState({profitprice2: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }</View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={profitprice3 + ''}
                                    onChangeText={(price) => {
                                        this.setState({profitprice3: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }</View>
                            <View style={styles.txtInput}>
                                <TextInput
                                    style={{
                                        flex: 1,
                                        color: '#FFFFFF',
                                        paddingLeft: 10,
                                    }}
                                    value={profitprice4 + ''}
                                    onChangeText={(price) => {
                                        this.setState({profitprice4: price});
                                    }}
                                    keyboardType="numeric"
                                    underlineColorAndroid="transparent"/>
                                {doubleORper === 2 ?
                                    <Text style={{fontSize: setSpText(20), paddingRight: 5, color: '#FFFFFF'}}>%</Text>
                                    :
                                    <View/>
                                }</View>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={{
                            borderRadius: 5,
                            backgroundColor: '#387ef5',
                            height: 50,
                            marginHorizontal: 20,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginTop: 20,
                        }}
                        disabled={this.state.querenstate}
                        onPress={() => {
                            this.confirmStorage()
                        }}
                    >
                        <Text style={{fontSize: setSpText(20), color: '#FFFFFF'}}>确定存储</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}


var styles = StyleSheet.create({
        txtInput: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingLeft: 10,
            height: 50,
            borderRadius: 6,
            marginHorizontal: 5,
            backgroundColor: '#387ef5',
        },
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        card: {
            borderTopWidth: 0,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0,0,0,0.1)',
            shadowColor: '#ccc',
            shadowOffset: {width: 2, height: 2,},
            shadowOpacity: 0.5,
            shadowRadius: 3,
            borderTopColor: '#fff'
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
            paddingTop: 16,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#222'
        },
        list: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
        },
        item: {
            backgroundColor: '#fff',
            borderRadius: 4,
            margin: 3,
            width: 100,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            marginRight: 10
        },
        selectedItem: {
            backgroundColor: '#63c2e3',
            borderRadius: 4,
            margin: 3,
            width: 100,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
            marginRight: 10
        },
        listView: {
            paddingTop: 20,
            backgroundColor: 'transparent',
        },
        thumb: {
            width: 30,
            height: 30,
        }
    })
;


module.exports = connect(state => ({

        IVAprice1: state.sale.IVAprice1,
        IVAprice2: state.sale.IVAprice2,
        IVAprice3: state.sale.IVAprice3,
        IVAprice4: state.sale.IVAprice4,
        profitprice1: state.sale.profitprice1,
        profitprice2: state.sale.profitprice2,
        profitprice3: state.sale.profitprice3,
        profitprice4: state.sale.profitprice4,
        doubleORper: state.sale.doubleORper,//1是浮点制，2是百分制

    })
)(CaluConfig);

