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
    ListView,
    View,
    Alert,
    Modal,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Platform,
} from 'react-native';
import Config from '../../../config';
import {connect} from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Entypo';
import AllCompany from './AllCompany';
import MyConcernOffer from './MyConcernOffer';
import MyOffer from './MyOffer';
import PopupDialog from 'react-native-popup-dialog';
import Camera from 'react-native-camera';
import VentasList from './VentasList';
import WaitTip from '../../components/modal/WaitTip';
import CompanyInfo from './CompanyInfo';
import PreferenceStore from '../../utils/PreferenceStore';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view'
import VentasDetail from './VentasDetail'
import {setSpText} from '../../utils/ScreenUtil'
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');
var Popover = require('react-native-popover');
const DEMO_OPTIONS_1 = ['option 1', 'option 2', 'option 3', 'option 4', 'option 5', 'option 6', 'option 7', 'option 8', 'option 9'];
import CookieManager from 'react-native-cookies';
import VentasInfoModal from '../../components/modal/VentasInfoModal'

class Stock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            stockSearchType:null,
            state: 0,
            start: 0,
            limit: 10,
            arrlong: 0,
            first :1,
            waitShow: false,
            firststate: 0,
            companyinfo: null,
            dialogShow: false,
            infoList: null,
            listVentas: null,
            merchantId: 0,
            modalDropdown: false,
            shangpinzhonglei: null,
            zhongleiList: null,
            provinceList: null,
            provinceId: null,
            provinceId2: null,
            cityList: null,
            province: null,
            showProgress: false,
            city: null,
            menuVisible: false,
            showDropdown: false,
            isLoadingTail: false,
            isRefreshing: false,
            isNoMoreData: false,
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    if (r1 !== r2) {
                    } else {
                    }
                    return r1 !== r2;
                }
            }),
            cameraModalVisible: false,
            camera: {
                // aspect: Camera.constants.Aspect.fill,
                // captureTarget: Camera.constants.CaptureTarget.disk,
                // type: Camera.constants.Type.back,
                // orientation: Camera.constants.Orientation.auto,
                // flashMode: Camera.constants.FlashMode.auto
            },
        };
        this.showpopupDialog = this.showpopupDialog.bind(this);

    }

    showpopupDialog() {
        this.popupDialog.show();
    }

    dismisspopupDialog() {
        this.popupDialog.dismiss();
    }

    navigatorVentasInfoModal() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasInfoModal',
                component: VentasInfoModal,
                params: {
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

    navigatorVentasList(list, commodityInfo) {
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'VentasList',
                component: VentasList,
                params: {
                    VentasList: list,
                    commodityInfo: commodityInfo,
                    username: this.props.username,
                    sessionId: this.props.sessionId,
                    password: this.props.password,

                }
            })
        }
    }

    fetchData_commodity() {
        this.refs.textInput1.blur();//输入框失去焦点
        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;
        let userinput = this.state.companyinfo;
        this.setState({infoList: null,stockSearchType:1});

        if(userinput==null || userinput==undefined || userinput==''){
            this.setState({showProgress:false})
            return;
        }

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
                    url: Config.server2 + "/func/sale/getCommdodityPriceFormBySearchEngine",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        userinput: userinput,
                    }
                }).then((json) => {//listCommodity是查询出的商品列表listVentas是查询出的商户列表
                    if(json.re==1){
                    var json = json.data;
                    var errorMsg = json.message;
                    if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                        Alert.alert(
                            '提示',
                            "没有数据",
                            [
                                {
                                    text: 'OK', onPress: () => {
                                    this.refs.waitTip.close();
                                    this.setState({showProgress: false});
                                }
                                }
                            ]
                        )
                    } else {
                        if (json.listCommodity !== undefined && json.listCommodity !== null) {
                            if (json.listCommodity === []) {
                                Alert.alert(
                                    '提示',
                                    "没有数据",
                                    [
                                        {
                                            text: 'OK', onPress: () => {
                                            this.refs.waitTip.close();
                                            this.setState({showProgress: false});
                                        }
                                        }
                                    ]
                                )
                            } else {
                                PreferenceStore.put('stockSearch', userinput);
                                PreferenceStore.put('stockSearchType', "1");//设置搜索type为1是查商品
                                this.setState({infoList: json.listCommodity, showProgress: false,arrlong: json.listCommodity.length,});
                                this.refs.waitTip.close()
                            }

                        }
                    }
                }
                }).catch((err) => {
                    alert(err);
                })
            }else{
                this.refs.waitTip.close();
                this.setState({showProgress: false});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_ventas() {
        this.refs.textInput1.blur();//输入框失去焦点
        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;
        let userinput = this.state.companyinfo;
        this.setState({infoList: null,stockSearchType:2});

        if(userinput==null || userinput == undefined || userinput == '')
        {
            this.setState({showProgress:false})
            return;
        }

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
                    url: Config.server2 + "/func/sale/getVentasInfoFormBySearchEngine",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        userinput: userinput,
                    }
                }).then((json) => {//listCommodity是查询出的商品列表listVentas是查询出的商户列表
                    if(json.re==1){
                    var json = json.data;
                    var errorMsg = json.message;
                        this.refs.waitTip.close();
                        this.setState({showProgress: false});
                    if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {

                        setTimeout(()=>{
                            Alert.alert(
                                '提示',
                                "没有数据",
                                [
                                    {
                                        text: 'OK', onPress: () => {
                                        this.refs.waitTip.close();

                                    }
                                    }
                                ]
                            )
                        },1000)

                    } else {
                        if (json.listVentas !== undefined && json.listVentas !== null) {
                            if (json.listVentas === []) {
                                setTimeout(()=> {
                                    alert("no data");
                                },1000)
                                return;
                            }
                            PreferenceStore.put('stockSearch', userinput);
                            PreferenceStore.put('stockSearchType', "2");//设置搜索type为2是查商户
                            this.setState({infoList: json.listVentas, showProgress: false});
                        }
                        else {
                            this.setState({showProgress: false});
                        }
                    }
                }
                }).catch((err) => {
                    alert(err);
                })
            }else{
                this.refs.waitTip.close();
                this.setState({showProgress: false});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_Province() {
        // var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoProvinceListMobile",
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': sessionId
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var provinceList = json.data;
                this.setState({provinceList: provinceList});
                //this.state.provinceList = provinceList;
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_City() {
        var provinceId = this.state.provinceId;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoCityListMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                provinceId: provinceId
            }
        }).then((json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var cityList = json.data;
                this.setState({cityList: cityList});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    fetchData_Zhonglei() {
        var zhongleiList = this.state.zhongleiList;
        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoCommodityRubroList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {}
        }).then((json) => {
            var errorMsg = json.message;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                zhongleiList = json.data;
                this.setState({zhongleiList: zhongleiList});
            }
        }).catch((err) => {
            alert(err);
        });
    }

    renderRow(rowData) {//后台如果传了一个空的，会在传输过程中丢失
        if (rowData.commodityId !== undefined && rowData.commodityId !== null) {

            let descripcion = rowData.descripcion
            if(descripcion!=null && descripcion!='')descripcion = descripcion.toUpperCase();

            var row =
                <View>
                    <TouchableOpacity onPress={() => {
                        this.navigatorVentasList(this.state.listVentas, rowData);
                    }}>
                        <View style={{
                            flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                            justifyContent: 'flex-start', backgroundColor: '#fff'
                        }}>

                            <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                <Text style={styles.renderText}>codigo：</Text>
                                <Text style={styles.renderText}>{rowData.codigo}</Text>
                            </View>
                            <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                <Text style={styles.renderText}>descripcion：</Text>
                                <Text style={styles.renderText}>{descripcion}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>;
        } else {
            var row =
                <SwipeRow
                    preview={true}
                    rightOpenValue={-60}>
                    <View style={{
                            alignItems: 'center',
                            flex: 1,
                            flexDirection: "row-reverse"
                        }}>
                        <TouchableOpacity
                            style={{width:60,paddingHorizontal: 10,backgroundColor: "#fc6254",textAlign:'center',justifyContent:'center'}}
                            onPress={() => {
                                this.navigatorVentasDetail(rowData)
                            }}>

                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(20)}}>详</Text></View>
                            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><Text style={{color: '#fff', textAlign: 'center',fontSize:setSpText(20)}}>情</Text></View>
                        </TouchableOpacity>
                    </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    borderBottomWidth: 1,
                    borderColor: '#ddd',
                    paddingLeft: 10,
                    paddingTop: 10,
                    backgroundColor:'#fff'
                }}>
                    <TouchableOpacity
                        style={{flex:1}}
                        onPress={() => {
                            this.navigatorCompanyInfo(rowData)
                        }}
                    >
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>用户名称: </Text>
                            <Text style={styles.renderText}> {rowData.nickName}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>公司名称: </Text>
                            <Text style={styles.renderText}> {rowData.nombre}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>地址: {rowData.direccion} {rowData.Localidad} {rowData.Provincia}</Text>
                            <Text style={styles.renderText}> </Text>
                        </View>
                        <View style={{paddingTop: 5}}>
                            <Text style={styles.renderText}>联系人: {rowData.principalContactos}</Text>
                        </View>
                        <View style={{paddingTop: 5}}>
                            <Text style={styles.renderText}>电话: {rowData.telefono}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                </SwipeRow>
        }
        return row;
    }

    renderRow_Province(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    renderRow_City(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={{flex: 3}}>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    resetzhonglei(idx, value) {
        this.setState({shangpinzhonglei: value.label})
    }

    resetprovince(idx, value) {
        this.setState({province: value.label, provinceId: value.value})
    }

    resetcity(idx, value) {
        this.setState({city: value.label})
    }

    renderRow_zhonglei(rowData) {
        var row =
            <TouchableOpacity>
                <View style={{
                    flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                    justifyContent: 'flex-start', backgroundColor: '#fff'
                }}>
                    <View style={{paddingTop: 5, flexDirection: 'row'}}>
                        <Text style={{flex: 3}}>{rowData.label}</Text>
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    }

    closePopover() {
        this.setState({menuVisible: false});
    }

    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    _onRefresh() {
        this.setState({isRefreshing: true});
        // console.log(this);
        setTimeout(() => {
            this.setState({
                isRefreshing: false,
                start: 0,
                infoList: null
            });
        }, 100);
    }

    hide() {
        this.setState({
            showDropdown: false
        });
    }

    componentDidMount() {

        this.navigatorVentasInfoModal()

        //这个页面在打开的时候直接调用这个方法
        // let userInput;
        // let stockSearchType;
        // PreferenceStore.get('stockSearch').then((val) => {
        //     userInput = val;
        //     return PreferenceStore.get('stockSearchType');
        // }).then((val) => {
        //     stockSearchType = val;
        //     if (userInput !== undefined && userInput !== null && userInput != ''
        //         && stockSearchType !== undefined && stockSearchType !== null && stockSearchType != '') {
        //         //TODO:auto-login
        //         this.setState({
        //             companyinfo: userInput, showProgress: true
        //         });
        //         //这里把showProgress置成true
        //         if (stockSearchType == 1) {
        //             this.state.companyinfo = userInput;
        //             this.fetchData_commodity();
        //         } else if (stockSearchType == 2) {
        //             this.state.companyinfo = userInput;
        //             this.fetchData_ventas();
        //         }
        //     }
        // })
    }

    surequary() {
        this.dismisspopupDialog();
        var shangpinzhonglei = this.state.shangpinzhonglei;
        var province = this.state.province;
        var city = this.state.city;
        var companyinfo = null;
        if (shangpinzhonglei !== null)
            companyinfo = shangpinzhonglei + ';';
        if (province !== null)
            companyinfo += province + ';';
        if (city !== null)
            companyinfo += city;
        //companyinfo = shangpinzhonglei + ' ; ' + province + ' ; ' + city;
        if (companyinfo !== null)
            this.setState({companyinfo: companyinfo});
    }

    render() {
        var displayArea = {x: 5, y: 20, width: width, height: height - 25};
        var listView = null;
        const infoList = this.state.infoList;
        if (infoList !== undefined && infoList !== null) {
            var data = infoList;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                />
        } else {
            this.state.infoList = [];
        }

        var zhongleiList = this.state.zhongleiList;
        // if (zhongleiList === null)
        //     this.fetchData_Zhonglei();
        //console.log(this.state.shangpinzhonglei);
        var provinceList = this.state.provinceList;
        // if (provinceList === null)
        //     this.fetchData_Province();
        var cityList = this.state.cityList;
        var state = 0;
        if (this.state.provinceId2 !== this.state.provinceId)
            state = 1;
        var provinceId = null;
        provinceId = this.state.provinceId;
        if ((provinceId !== null && cityList === null) || state === 1) {
            this.fetchData_City();
            this.state.provinceId2 = provinceId;
        }

        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    paddingTop:Platform.OS=='ios'?40:10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row'
                }, styles.card]}>
                    <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                        Supnuevo(6.0)-{this.props.username}
                    </Text>
                </View>
                {/*nei rong*/}
                <View style={{flex: 1}}>
                    <View style={{
                        //flex: 1,
                        height: 60,
                        flexDirection: 'row',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            flex: 1,
                            height: 40,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            margin: 10,
                            borderWidth: 1,
                            borderColor: '#343434'
                        }}>
                            <TextInput
                                ref="textInput1"
                                style={{
                                    flex: 1,
                                    height: 40,
                                    marginLeft: 5,
                                    paddingTop: 2,
                                    paddingBottom: 2,
                                    fontSize: setSpText(16),
                                }}
                                onChangeText={(companyinfo) => {
                                    this.setState({companyinfo: companyinfo});
                                }}
                                value={this.state.companyinfo}
                                placeholder="搜索"
                                placeholderTextColor="#aaa"
                                underlineColorAndroid="transparent"
                            />
                        </View>
                        <TouchableOpacity
                            style={{width: 70, backgroundColor: '#CAE1FF', marginRight: 5, borderRadius: 4}}
                            onPress={() => {
                                this.refs.waitTip.open();
                                this.fetchData_commodity();
                            }}
                        >
                            <View style={{padding: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: setSpText(16)}}>查商品</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{width: 70, backgroundColor: '#CAE1FF', marginRight: 5, borderRadius: 4}}
                            onPress={() => {
                                this.refs.waitTip.open();
                                this.fetchData_ventas();
                            }}
                        >
                            <View style={{padding: 10, alignItems: 'center'}}>
                                <Text style={{fontSize: setSpText(16)}}>查商户</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{

                        borderBottomWidth: 1,
                        borderColor: '#ddd',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        {/*<Text style={{fontSize: 16}}>市场上所有产品列表</Text>*/}
                    </View>
                    <View style={{flex: 5, borderBottomWidth: 1, borderColor: '#ddd'}}>
                        <ScrollView>
                            {listView}
                        </ScrollView>
                    </View>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}>
                    <View style={{flex: 1, backgroundColor: '#CAE1FF'}}>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="商品种类"
                                       onChangeText={(zhonglei) => {
                                           if (zhonglei !== null) {
                                               this.state.shangpinzhonglei = zhonglei;
                                           }
                                       }}
                                       value={this.state.shangpinzhonglei}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           options={this.state.zhongleiList}
                                           renderRow={this.renderRow_zhonglei.bind(this)}
                                           onSelect={(idx, value) => this.resetzhonglei(idx, value)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="省"
                                       onChangeText={(province) => {
                                           if (province !== null) {
                                               this.state.province = province;
                                           }
                                       }}
                                       value={this.state.province}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown options={this.state.provinceList}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           onSelect={(idx, value) => this.resetprovince(idx, value)}
                                           renderRow={this.renderRow_Province.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 8, height: 50, marginLeft: 10}}
                                       placeholder="市"
                                       onChangeText={(city) => {
                                           if (city !== null) {
                                               this.state.city = city;
                                           }
                                       }}
                                       value={this.state.city}
                                       underlineColorAndroid="transparent"
                            />
                            <ModalDropdown options={cityList}
                                           style={styles.dropdown}
                                           dropdownStyle={styles.dropdown_dropdownTextStyle}
                                           onDropdownWillShow={this.state.showDropdown}
                                           onSelect={(idx, value) => this.resetcity(idx, value)}
                                           renderRow={this.renderRow_City.bind(this)}>
                                <Icon1 name="triangle-down" color="blue" size={40}/>
                            </ModalDropdown>
                        </View>
                        <View style={styles.table}>
                            <TextInput style={{flex: 4, height: 50, marginLeft: 10}}
                                       underlineColorAndroid="transparent"
                                       placeholder="条码尾数"
                            />
                            <TouchableOpacity style={{
                                flex: 1, backgroundColor: 'transparent', borderLeftWidth: 1,
                                borderLeftColor: '#ddd',
                            }} onPress={() => {
                                this.setState({cameraModalVisible: true})
                            }}>
                                <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 10}}>
                                    <Text style={{fontSize: setSpText(16)}}>扫码</Text></View>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                flex: 1,
                                backgroundColor: 'white',
                                borderRadius: 4,
                                marginLeft: 120,
                                marginRight: 120,
                                marginBottom: 10,
                                marginTop: 15
                            }} onPress={() => {
                                this.surequary()
                            }
                            }>
                                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontSize: setSpText(20)}}>确定</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </PopupDialog>
                {/*等待提示*/}
                <Modal
                    animationType={"fade"}
                    transparent={true}
                    visible={this.state.showProgress}
                    onRequestClose={() => {
                        this.setState({showProgress: false})
                    }}
                >
                    <View style={[styles.modalContainer, styles.modalBackgroundStyle, {paddingTop: height / 2 - 30,}]}>
                        <ActivityIndicator
                            animating={true}
                            style={[styles.loader, {height: 80}]}
                            size="large"
                            color="#AAAAAA"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#AAAAAA', fontSize: setSpText(18), alignItems: 'center'}}>
                                请求中...
                            </Text>
                        </View>
                    </View>
                </Modal>

                {/*camera part*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.cameraModalVisible}
                    onRequestClose={() => {
                        this.setState({cameraModalVisible: false})
                    }}
                >
                    <Camera
                        ref={(cam) => {
                            this.camera = cam;
                        }}
                        style={styles.preview}
                        aspect={this.state.camera.aspect}
                        captureTarget={this.state.camera.captureTarget}
                        type={this.state.camera.type}
                        flashMode={this.state.camera.flashMode}
                        defaultTouchToFocus
                        mirrorImage={false}
                        onBarCodeRead={(barcode) => {
                            var {type, data, bounds} = barcode;
                            if (data !== undefined && data !== null) {
                                console.log('barcode data=' + data + 'barcode type=' + type);
                                this.state.goods.codeNum = data;
                                var goods = this.state.goods;
                                goods.codeNum = data;
                                this.queryGoodsCode(data);
                                this.closeCamera();
                            }
                        }}
                    />
                    <View style={[styles.box]}>
                    </View>
                    <View style={{
                        position: 'absolute',
                        right: 1 / 2 * width - 100,
                        top: 1 / 2 * height,
                        height: 100,
                        width: 200,
                        borderTopWidth: 1,
                        borderColor: '#e42112',
                        backgroundColor: 'transparent'
                    }}>
                    </View>
                    <View style={[styles.overlay, styles.bottomOverlay]}>
                        <TouchableOpacity
                            style={styles.captureButton}
                            onPress={() => {
                                this.closeCamera()
                            }}
                        >
                            <Icon name="times-circle" size={50} color="#343434"/>
                        </TouchableOpacity>
                    </View>
                </Modal>

                <WaitTip
                    ref="waitTip"
                    tipsName="please wait..."
                />


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
    table: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#343434',
        //marginBottom: 10,
        marginRight: 10,
        marginTop: 15,
        marginLeft: 10,
        backgroundColor: 'white',
        flexDirection: 'row'
    },
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
    },

    box: {
        position: 'absolute',
        right: 1 / 2 * width - 100,
        top: 1 / 2 * height - 100,
        height: 200,
        width: 200,
        borderWidth: 1,
        borderColor: '#387ef5',
        backgroundColor: 'transparent'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },
    dropdown: {
        flex: 1,
        paddingRight: 10,
        backgroundColor: 'transparent',
        borderLeftWidth: 1,
        borderLeftColor: '#ddd',
    },
    dropdown_dropdownTextStyle: {
        width: 200,
        borderWidth: 1,
        paddingLeft: 5,
        borderColor: '#20C3DD'
    },
    dropdown_3_dropdownTextHighlightStyle: {
        backgroundColor: '#fff',
        color: '#000'
    },
});


module.exports = connect(state => ({
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        commodityClassList: state.sale.commodityClassList,
        weightService: state.sale.weightService,
        sessionId: state.user.sessionId,
        password: state.user.password,
        isConnected:state.netInfo.isConnected,
    })
)(Stock);
