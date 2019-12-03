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
    Dimensions,
    Modal,
    ActivityIndicator,
    Platform
} from 'react-native';
import {setSpText} from '../utils/ScreenUtil'
import Icon from 'react-native-vector-icons/FontAwesome';
import GridView from 'react-native-grid-view';
import {connect} from 'react-redux';
import CompanyInfo from './Stock/CompanyInfo';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import VentasDetail from './Stock/VentasDetail'
import Config from '../../config';
var proxy = require('../proxy/Proxy');

var {height, width} = Dimensions.get('window');


class ReferencePrice extends Component {

    close() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
        }
        // if (this.props.onClose !== undefined && this.props.onClose !== null) {
        //     this.props.onClose();
        // }
    }

    navigatorCompanyInfo(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CompanyInfo',
                component: CompanyInfo,
                params: {
                    ventasInfo: ventasInfo,
                    username: this.props.username,
                    sessionId: this.props.sessionId,
                    password: this.props.password,
                }
            })
        }
    }

    // onCodigoSelect(ventasInfo) {
    //     this.props.navigateVentasCommodityList(ventasInfo);
    //     if (this.props.navigateVentasCommodityList !== undefined && this.props.navigateVentasCommodityList !== null) {
    //         this.props.navigateVentasCommodityList(ventasInfo);
    //     }
    // }

    navigateVentasCommodityList(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CompanyInfo',
                component: CompanyInfo,
                params: {
                    ventasInfo: ventasInfo,
                }
            })
        }
    }

    navigatorVentasDetail(ventasInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasDetail',
                component: VentasDetail,
                params: {
                    ventasInfo: ventasInfo,
                }
            })
        }
    }

    renderRow(rowData) {

        var price = rowData.commodityPrice.price;

        var row =
            <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex:1,
                    //justifyContent: 'center',
                    paddingTop: 10,
                    padding: 10,
                    backgroundColor:'#fff',
                    borderBottomWidth:1,
                }}>
                <TouchableOpacity
                    style={{flex:1}}
                    onPress={() => {
                            this.navigatorCompanyInfo(rowData)
                        }}
                >
                    <View style={{
                            flexDirection: 'row',
                            justifyContent:'space-between',
                        }}>
                        <Text style={[styles.renderText, ]}>用户名称: {rowData.nickName}</Text>
                        <View style={{padding:5,backgroundColor:'#fc6254',borderRadius:5}}>
                            <Text style={[styles.renderText,{fontSize:setSpText(20),color:'#fff',fontWeight: 'bold',} ]}>价格: {price} </Text></View>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={styles.renderText}>公司名称: </Text>
                        <Text style={styles.renderText}> {rowData.nombre}</Text>
                    </View>
                    <View style={{paddingTop: 5, flexDirection: 'column'}}>
                        <Text style={styles.renderText}>地址: {rowData.direccion} {rowData.Localidad} {rowData.Provincia}</Text>
                    </View>
                    <View style={{paddingTop: 5}}>
                        <Text style={styles.renderText}>联系人: {rowData.principalContactos}</Text>
                    </View>
                    <View style={{paddingTop: 5}}>
                        <Text style={styles.renderText}>电话: {rowData.telefono}</Text>
                    </View>
                </TouchableOpacity>
            </View>

        return row;
    }


    constructor(props) {
        super(props);
        this.state = {
            list: [],
        }
    }

    render() {

        var listView = null;
        let list = this.state.list;
        if (list !== undefined && list !== null && Object.prototype.toString.call(list) == '[object Array]') {

            var data = list;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

            listView =
                <SwipeListView
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                    previewFirstRow={true}
                    renderHiddenRow={(data, secId, rowId, rowMap) => (
                        <View style={{
                            alignItems: 'center',
                            flex: 1,
                            flexDirection: "row-reverse"
                        }}>
                        <TouchableOpacity
                        style={{width:60,paddingHorizontal: 10,backgroundColor: "#fc6254",textAlign:'center',justifyContent:'center'}}
                        onPress={() => {
                            this.navigatorVentasDetail(data)
                        }}>

                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(22)}}>详</Text></View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(22)}}>情</Text></View>
                        </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-60}
                />
        } else {
        }


        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    paddingHorizontal: 12,
                    paddingTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop:Platform.OS=='ios'?40:10
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {
                            this.close();
                        }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                        供应商列表
                    </Text>
                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>
                {/* 商品信息 */}
                <ScrollView>
                    <View style={[{
                    backgroundColor: '#fff',
                    flex:1,
                    padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    borderBottomWidth:1
                }]}>
                        <View style={{flex:3,flexDirection:'column',justifyContent:'flex-start',alignItems: 'flex-start',}}>
                            <Text style={{fontSize: setSpText(18),textAlign: 'center', color: '#666'}}>
                                名称： {this.props.goodName}
                            </Text>
                            <Text style={{fontSize: setSpText(18),marginTop:5,textAlign: 'center', color: '#666'}}>
                                条码： {this.props.codigo}
                            </Text>
                        </View>
                    </View>

                    <View style={{flex: 1}}>
                        {listView}
                    </View>
                    <View style={{height: 20}}/>
                </ScrollView>

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
                            style={[styles.loader, {height: 80}]}
                            size="large"
                            color="#AAAAAA"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#fff', fontSize: setSpText(18), alignItems: 'center'}}>
                                请求中。。。
                            </Text>
                        </View>
                    </View>
                </Modal>

            </View>
        );
    }

    componentDidMount(){

        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;
        var codigo = this.props.codigo;

        this.setState({showProgress: true})

        proxy.postes_ventas({
            url: Config.server2 + "/func/auth/loginAfterOtherServerAuthed",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                loginName: username,
                password: password,
                motherServerSessionId: sessionId,
            }
        }).then((json) => {
            if(json.re==1) {

                proxy.postes_ventas({
                    url: Config.server2 + '/func/ventas/getCommodityPriceFormByCommodityIdFromSupnuevo',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        codigo: codigo
                    }
                }).then((json) => {
                    this.setState({showProgress:false})
                    if(json.re==1) {
                        var json = json.data;
                        var errorMsg = json.message;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            alert(errorMsg)
                        } else {
                            if (json.ArrayList === null) {
                                //this.cleanWaitTip();
                                //this.setState({referencePriceButton: true});
                            } else if (json.ArrayList !== null && json.ArrayList !== undefined) {

                                this.setState({list: json.ArrayList})
                                //this.navigateRefercencePrice(json.ArrayList, codigo);
                                // this.setState({
                                //     //referencePriceModalVisable: true,
                                //     //referencePriceList: json.ArrayList,
                                //     referencePriceButton: false
                                // });
                            }
                        }
                    }
                }).catch((err) => {
                    alert(err);
                })
            }else if(json.re==-1){
                // this.refs.waitTip.close();
                this.setState({showProgress:false})
            }
        }).catch((err) => {
            alert(err);
        });

    }
}


var styles = StyleSheet.create({
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
    renderText: {
        fontSize: setSpText(16),
        alignItems: 'center'
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


module.exports = ReferencePrice;
