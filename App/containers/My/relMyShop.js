import React, {Component} from 'react';
import {
    NetInfo,
    AppRegistry,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Image,
    Button,
    Text,
    ListView,
    TextInput,
    View,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';
import RelMyshop from '../../components/myRelShop/relmyshop';
import {SwipeListView, SwipeRow} from 'react-native-swipe-list-view';
import IconE from 'react-native-vector-icons/EvilIcons';
import {setSpText} from '../../utils/ScreenUtil'
const proxy = require('../../proxy/Proxy');
const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');

class relMyShop extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            data: null,
            ModalVisible: false,
            username: null,
            password: null,
            wait: false,
        };
    }

    getRelMerchant() {
        var data = this.state.data;
        proxy.postes({
            url: Config.server + "/func/merchant/getRelMerchantListOfMerchantMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                type: 1,
            }
        }).then((json) => {
            var errorMsg = json.errMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
            else {
                if (json !== null && json.ArrayList !== undefined) {
                    if (json.ArrayList.length !== 0) {
                        this.setState({data: json.ArrayList});
                    }else{
                        this.setState({data:[]})
                    }
                }
                else {
                    alert("商户的相关商户为空");
                }
            }
        }).catch((err) => {
            alert(err);
        });
    }

    updateMerchant(relId, state) {
        proxy.postes({
            url: Config.server + "/func/merchant/updateSupnuevoMerchantPriceOperRel",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                type: 1,
                relId: relId,
                state: state,
            }
        }).then((json) => {
            var errorMsg = json.data;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
            else {
                this.getRelMerchant()
            }
        }).catch((err) => {
            alert(err);
        });
    }

    addRelMerchant() {
        var username = this.state.username;
        let note = this.state.note;
        this.setState({wait: true, ModalVisible: false});
        if (username === null) {
            alert("请填写账号");
            return;
        }
        proxy.postes({
            url: Config.server + "/func/merchant/addSupnuevoMerchantPriceOperRel",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                nickName: username,
                type: 1,
                note: note,
            }
        }).then((json) => {
            this.setState({wait: false});
            var errorMsg = json.errMassage;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            }
        }).catch((err) => {
            alert(err);
        });
    }

    setModalVisible(visible) {
        this.setState({ModalVisible: visible});
    }

    renderRow(rowData) {
        this.state.merchantId = rowData.merchantId;
        var row =
            <View style={{borderBottomWidth: 1, backgroundColor: '#fff', borderColor: '#9999'}}>
                <View style={{
                    flex: 1, padding: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center'
                }}>
                    <View style={{
                        flex: 3,
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                    }}>
                        <Text style={{flex: 1, fontSize: setSpText(16)}}>用户名：{rowData.nickName}</Text>
                        <Text style={{flex: 1, fontSize: setSpText(16), marginTop:5}}>备注：{rowData.note}</Text>

                    </View>

                    <RelMyshop rowData={rowData}>
                    </RelMyshop>

                </View>
            </View>;
        return row;
    }

    render() {
        var listView = null;
        var data = this.state.data;
        if (data !== undefined && data !== null) {
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
                            {
                                data.priceMerchantAgreeMark === 0 ?

                                    <TouchableOpacity
                                        style={{
                                            width:60,
                                            paddingHorizontal: 10,
                                            backgroundColor: "green",
                                            textAlign:'center',
                                            justifyContent:'center',
                                        }}
                                        onPress={() => {
                                            this.updateMerchant(data.relId,1);
                                        }}>
                                        <Text style={{paddingVertical:20,flex:1,color: '#fff', textAlign: 'center',fontSize:setSpText(16)}}>联通</Text>
                                        </TouchableOpacity>

                                    :

                                    <TouchableOpacity
                                        style={{
                                            width:60,
                                            paddingHorizontal: 10,
                                            backgroundColor: "#444",
                                            alignItems:'center',
                                            justifyContent:'center',
                                        }}
                                        onPress={() => {
                                            this.updateMerchant(data.relId,2);
                                        }}>
                                        <Text style={{paddingVertical:20,flex:1,color: '#fff', textAlign: 'center',fontSize:setSpText(16)}}>断开</Text>
                                        </TouchableOpacity>

                            }

                            <TouchableOpacity
                                style={{
                                    width:60,
                                    paddingHorizontal: 10,
                                    backgroundColor: "red",
                                }}
                                onPress={() => {
                                    this.updateMerchant(data.relId,0);
                                }}>
                                <Text style={{paddingVertical:20,color: '#fff',fontSize:setSpText(16),textAlign:'center',flex:1}}>删除</Text>
                                </TouchableOpacity>
                        </View>
                    )}
                    rightOpenValue={-120}
                />
        } else {
            this.state.data = [];
            this.getRelMerchant();
        }
        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={{
                    backgroundColor: '#387ef5',
                    height: 65,
                    alignItems: 'center',
                    flexDirection: 'row'
                }}>
                    <TouchableOpacity style={{
                        height: 45,
                        marginRight: 10,
                        marginTop: 10,
                        paddingLeft: 10,
                    }}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: setSpText(22), marginTop: 7, textAlign: 'center', color: '#fff'}}>
                        Supnuevo-{this.props.username}
                    </Text>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <TouchableOpacity style={{
                            borderRadius: 4,
                            marginTop: 10,
                            marginLeft: 20,
                            marginRight: 10,
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          onPress={() => {
                                              this.setModalVisible(true)
                                          }}>
                            <IconE name="plus" color="#fff" size={40}/>
                        </TouchableOpacity>
                    </View>
                </View>
                {/* body */}
                <View style={{
                    borderBottomWidth: 1, borderColor: '#9999', alignItems: 'center',
                    flexDirection: 'row', justifyContent: 'space-around'
                }}>
                    <Text style={{padding: 10, fontSize: setSpText(20), color: '#444'}}>
                        关联用户
                    </Text>
                    <Text style={{padding: 10, fontSize: setSpText(20), color: '#444'}}>
                        状态
                    </Text>
                </View>
                <ScrollView>
                    <View style={{
                        flex: 1,
                    }}>
                        <View style={{flex: 5, borderBottomWidth: 1, borderColor: '#ddd'}}>
                            {listView}
                        </View>
                    </View>

                </ScrollView>
                {/*添加商户*/}
                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.ModalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}
                >
                    <View style={{height: 300, marginTop: 100,alignItems:'center',justifyContent:'center'}}>
                        <View style={{height: 30, marginTop: 20}}>
                            <Text style={{fontSize: setSpText(20), color: '#444'}}>
                                请输入要关联的用户：
                            </Text>
                        </View>
                        <View style={{height: 50, borderWidth: 1, borderColor: '#ddd', flexDirection: 'row',marginTop:20}}>

                            <View style={{
                                flex: 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                padding: 16,
                                paddingLeft: 20,
                                paddingRight: 15,
                                marginLeft: 10
                            }}>
                                <Text style={{fontSize: setSpText(20), color: '#444'}}>用户名：</Text>
                            </View>


                            <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={{
                                        height: 46,
                                        flex: 1,
                                        paddingLeft: 20,
                                        paddingRight: 10,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        fontSize: setSpText(16)
                                    }}
                                    onChangeText={(username) => {
                                        this.setState({username: username})
                                    }}
                                    placeholder='在此输入用户名'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                        <View style={{height: 50, borderWidth: 1, borderColor: '#ddd', flexDirection: 'row'}}>

                            <View style={{
                                flex: 2,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'flex-start',
                                padding: 16,
                                paddingLeft: 20,
                                paddingRight: 15,
                                marginLeft: 10
                            }}>
                                <Text style={{fontSize: setSpText(16), color: '#444'}}>备注：</Text>
                            </View>


                            <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput
                                    style={{
                                        height: 46,
                                        flex: 1,
                                        paddingLeft: 20,
                                        paddingRight: 10,
                                        paddingTop: 2,
                                        paddingBottom: 2,
                                        fontSize: setSpText(16)
                                    }}
                                    onChangeText={(note) => {
                                        this.setState({note: note})
                                    }}
                                    placeholder='在此输入说明'
                                    placeholderTextColor="#aaa"
                                    underlineColorAndroid="transparent"
                                />
                            </View>
                        </View>
                        <TouchableOpacity style={{
                            width:200,
                            height:50,
                            marginTop: 30,
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: '#387ef5',
                            padding: 10,
                            borderRadius: 4, flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          onPress={() => {
                                              this.addRelMerchant()
                                          }}>
                            <Text style={{fontSize: setSpText(18), color: '#fff'}}>添加</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            width:200,
                            height:50,
                            marginTop: 30,
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: '#387ef5',
                            padding: 10,
                            borderRadius: 4, flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                                          onPress={() => {
                                              this.setModalVisible(false)
                                          }}>
                            <Text style={{fontSize: setSpText(18), color: '#fff'}}>关闭</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>

        )
    }
}

module.exports = connect(state => ({
        username: state.user.username,
    })
)(relMyShop);