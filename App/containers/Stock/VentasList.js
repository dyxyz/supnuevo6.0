import React, {Component} from 'react';
import {
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
    ActivityIndicator,
    ListView,
    Platform
} from 'react-native';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import CompanyInfo from './CompanyInfo';
import VentasDetail from './VentasDetail';
import Camera from 'react-native-camera';
import MyOffer from './MyOffer';
import {setSpText} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');
var Dimensions = require('Dimensions');
var {_height, _width} = Dimensions.get('window');

class VentasList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            ventasListFromProps: this.props.VentasList,
            ventasListFromCommodityId: [],
            infoList: null,
            commodityId: this.props.commodityId,
            DetailModalVisible:false,
            selectVentasInfo:{
                ventasId:null,
                price:null,
                nickName:null,
                nombre:null,
                email:null,
                pagina:null,
                rubroDes:null,
                telefono:null,
                principalContactos:null,
                deliverDes:null,
                Provincia:null,
                Localidad:null,
                direccion:null,
            }
        }

    }

    goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
            if (this.props.reset)
                this.props.reset();
        }

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

    laruguanzhu() {
        // var sessionId = this.props.sessionId;
        var state = 1;
        var merchantId = this.state.merchantId;
        proxy.postes({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功拉入关注");
            }
        }).catch((err) => {
            alert(err);
        });
    }

    buzaiguanzhu() {
        var state = 0;
        // var sessionId = this.props.sessionId;
        var merchantId = this.state.merchantId;
        proxy.postes({
            url: Config.server + '/func/merchant/setBuyerSellerStateMobile',
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId,
            },
            body: {
                sellerId: merchantId,
                state: state,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                alert("成功不再关注");
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData(){

        let commodityInfo = this.props.commodityInfo;
        if (commodityInfo.commodityId === null || commodityInfo.commodityId === undefined) {
            return 0;
        }
        this.setState({showProgress: true});
        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;
        this.setState({infoList: null});

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
            if(json.re==1){
                proxy.postes_ventas({
                    url: Config.server2 + "/func/sale/getVentasInfoByCommodityIdFromSupnuevo",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        commodityId: commodityInfo.commodityId,
                    }
                }).then((json) => {
                    this.setState({showProgress:false})
                    if(json.re==1){
                        var json = json.data
                        var errorMsg = json.message;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            alert(errorMsg);
                        } else {
                            if (json.ArrayList !== undefined) {
                                let list = json.ArrayList;
                                list.sort(priceSort);

                                this.setState({showProgress: false, ventasListFromCommodityId: list});
                            } else {
                                this.setState({showProgress: false});
                            }
                        }
                    }
                }).catch((err) => {
                    alert(err);
                });
            }else{
                this.setState({showProgress: false});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    getPriceOptionList() {
        let ventasId = this.props.ventasInfo.ventasId;
        proxy.postes_ventas({
            url: Config.server2 + "/func/ventas/getVentasCommodityPriceOptionListFromSupnuevo",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ventasId: ventasId,
            }
        }).then((json) => {
            if(json.re==1){
            var json = json.data;
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                this.setState({infoList: json.ArrayList});
            }
        }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData) {

        var row = (
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
                                <Text style={[styles.renderText,{fontSize:setSpText(20),color:'#fff',fontWeight: 'bold',} ]}>价格: {rowData.price} </Text></View>
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
            );

        return row;
    }

    componentWillMount() {
        this.fetchData();
    }

    render() {

        var codigo = this.props.commodityInfo.codigo;
        var name = this.props.commodityInfo.descripcion;
        if(name!=null && name!='')name = name.toUpperCase();
        var pictureurl = this.props.commodityInfo.pictureurl;

        let listView = null;
        let infoList = this.state.ventasListFromCommodityId;
        if (infoList !== undefined && infoList !== null) {
            let data = infoList;
            let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
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
                            this.setState({selectVentasInfo:data})
                            this.navigatorVentasDetail(data)
                        }}>

                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(20)}}>详</Text></View>
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(20)}}>情</Text></View>
                        </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-60}
                />
        }
        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    paddingHorizontal: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop:Platform.OS=='ios'?40:10
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {
                            this.goBack()
                        }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: setSpText(22), flex: 3, textAlign: 'center', color: '#fff'}}>
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
                    <View style={{flex:1}}>
                        <Image style={{width: 80, height: 100}} resizeMode={'contain'} source={{uri:pictureurl}}/>
                    </View>
                    <View style={{flex:3,flexDirection:'column',justifyContent:'flex-start',alignItems: 'flex-start',}}>
                    <Text style={{fontSize: setSpText(18),textAlign: 'center', color: '#666'}}>
                        名称： {name}
                    </Text>
                    <Text style={{fontSize: setSpText(18),marginTop:5,textAlign: 'center', color: '#666'}}>
                        条码： {codigo}
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
                            <Text style={{color: '#AAAAAA', fontSize: setSpText(18), alignItems: 'center'}}>
                                请求中。。。
                            </Text>
                        </View>
                    </View>
                </Modal>

            </View>
        );
    }
}


var styles = StyleSheet.create({
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
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

function priceSort(obja, objb) {

    return obja.price - objb.price;
}

module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
    })
)(VentasList);
