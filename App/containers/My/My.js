/**
 * Created by danding on 16/11/21.
 */
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
    Platform,
} from 'react-native';
import {connect} from 'react-redux';
import Myinfo from './Myinfo';
import {setSpText} from '../../utils/ScreenUtil'
const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const proxy = require('../../proxy/Proxy');
import Icon from 'react-native-vector-icons/FontAwesome';
import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import DatePicker from 'react-native-datepicker';
import IconM from 'react-native-vector-icons/MaterialCommunityIcons';
import IconMaterialIcons from 'react-native-vector-icons/MaterialIcons';
import QrcodeModal from './QrcodeModal';
import Camera from 'react-native-camera';
import Config from '../../../config';

class My extends Component {
    closeCamera() {
        this.setState({cameraModalVisible: false});
    }

    setMerchantVisible(scan) {
        var scanId = parseInt(scan);
        var sessionId = this.props.sessionId;
        proxy.postes({
            url: Config.server + '/func/merchant/setMerchantVisibleEachOtherMobile',
            headers: {
                //'Authorization': "Basic czZCaGRSa3F0MzpnWDFmQmF0M2JW",
                'Content-Type': 'application/json',
                //'Cookie': sessionId,
            },
            //body: "codigo=" + codeNum + "&merchantId=" + merchantId
            body: {
                scanId: scanId,
            }
        }).then((json) => {
            console.log('setMerchantVisible返回了');

            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                console.log(errMessage);

                setTimeout(() => {
                    Alert.alert(
                        '信息',
                        errMessage,
                        [
                            {text: '确定', onPress: () => this.setState({barcodeFlag: true})},
                        ]
                    )
                }, 900)

            } else {
                console.log('已设置成功');

                setTimeout(() => {
                    Alert.alert(
                        '信息',
                        '已设置成功',
                        [
                            {text: 'OK', onPress: () => this.setState({barcodeFlag: true})},
                        ]
                    )
                }, 900)


            }

        }).catch((err) => {
            alert(err);
        });


    }

    componentDidMount(): void {
        console.log(this.props.unionMemberType)
    }

    constructor(props) {
        super(props);
        this.state = {
            info: null,
            QrcodeModalVisible: false,
            cameraModalVisible: false,
            scanId: null,
            barcodeFlag: true,
            camera: {},
            attachDataUrl:null,
        }

    }





    navigatemyinfo(){

        const {navigator} = this.props;
        var sessionId = this.props.sessionId;


                //TODO:跳转
                navigator.push({
                    name: 'Myinfo',
                    component: Myinfo,
                    params: {
                        // getSupnuevoMerchantInfo: this.getSupnuevoMerchantInfo.bind(this),
                        // info: this.state.info,
                        // attachDataUrl:this.state.attachDataUrl,
                    }
                })
    }



    navigateMySuggestion() {
        var MySuggestion = require('./MySuggestion');
        this.props.navigator.push({
            name: 'MySuggestion',
            component: MySuggestion,
            params: {}
        })
    }

    navigateMyShop() {
        var MyShop = require('./MyShop');
        this.props.navigator.push({
            name: 'MyShop',
            component: MyShop,
            params: {}
        })
    }

    navigateRelMyShop() {
        var relMyShop = require('./relMyShop');
        this.props.navigator.push({
            name: 'relMyShop',
            component: relMyShop,
            params: {}
        })
    }

    navigateMyUnion() {
        var myUnion = require('./MyUnion');
        this.props.navigator.push({
            name: 'myUnion',
            component: myUnion,
            params: {}
        })
    }

    render() {

        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/* header bar */}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>

                        <View>
                            <Text style={{fontSize: setSpText(20), flex: 3, textAlign: 'center', color: '#fff'}}>
                                Supnuevo(6.0)-{this.props.username}
                            </Text>
                        </View>
                    </View>

                    <View style={{height: height - 140,}}>
                        <Image style={{
                            backgroundColor: 'transparent',
                            width: width,
                            flex: 1,
                        }}
                               resizeMode={"center"}
                               source={require('../../img/cart.png')}/>
                        {this.props.unionMemberType == 2 || this.props.unionMemberType == 1 ?
                            <View style={{flex: 2}}>
                                <TouchableOpacity style={[{borderTopWidth: 1}, styles.touch]}
                                                  onPress={() => {
                                                      this.navigatemyinfo();
                                                  }}>
                                    <IconMaterialIcons name="assignment-ind" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的信息</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.setState({QrcodeModalVisible: true});

                                                  }}>
                                    <IconM name="qrcode" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的二维码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.setState({cameraModalVisible: true})
                                                      //this.setMerchantVisible('54');
                                                  }}>
                                    <IconM name="qrcode-scan" color="#515151" size={30}/>
                                    <Text style={styles.text}>扫一扫商家二维码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateMySuggestion()
                                                  }}>
                                    <IconM name="message-text" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的建议</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateMyShop()
                                                  }}>
                                    <IconMaterialIcons name="shopping-cart" color="#515151" size={30}/>
                                    <Text style={styles.text}>我替他们改价</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateRelMyShop()
                                                  }}>
                                    <IconMaterialIcons name="add-shopping-cart" color="#515151" size={30}/>
                                    <Text style={styles.text}>他们替我改价</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateMyUnion()
                                                  }}>
                                    <IconMaterialIcons name="group-work" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的超市联盟</Text>

                                </TouchableOpacity>



                                <View style={{flex: 1}}/>
                            </View>
                            :
                            <View style={{flex: 2}}>
                                <TouchableOpacity style={[{borderTopWidth: 1}, styles.touch]}
                                                  onPress={() => {
                                                      this.navigatemyinfo();
                                                  }}>
                                    <IconMaterialIcons name="assignment-ind" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的信息</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.setState({QrcodeModalVisible: true});

                                                  }}>
                                    <IconM name="qrcode" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的二维码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.setState({cameraModalVisible: true})
                                                      //this.setMerchantVisible('54');
                                                  }}>
                                    <IconM name="qrcode-scan" color="#515151" size={30}/>
                                    <Text style={styles.text}>扫一扫商家二维码</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateMySuggestion()
                                                  }}>
                                    <IconM name="message-text" color="#515151" size={30}/>
                                    <Text style={styles.text}>我的建议</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateMyShop()
                                                  }}>
                                    <IconMaterialIcons name="shopping-cart" color="#515151" size={30}/>
                                    <Text style={styles.text}>我替他们改价</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateRelMyShop()
                                                  }}>
                                    <IconMaterialIcons name="add-shopping-cart" color="#515151" size={30}/>
                                    <Text style={styles.text}>他们替我改价</Text>
                                </TouchableOpacity>




                                <View style={{flex: 1}}/>
                            </View>
                        }
                    </View>

                    {/*我的二维码*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.QrcodeModalVisible}
                        onRequestClose={() => {
                            this.setState({QrcodeModalVisible: false})
                        }}
                    >
                        <QrcodeModal
                            supnuevoMerchantId={this.props.supnuevoMerchantId}
                            username={this.props.username}
                            onClose={() => {
                                this.setState({QrcodeModalVisible: false});
                            }}
                            onConfirm={(price) => {

                            }}
                        />

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

                                    this.state.scanId = data;

                                    if (this.state.barcodeFlag == true) {
                                        this.setState({barcodeFlag: false});
                                        this.setMerchantVisible(this.state.scanId);

                                    }

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

                </View>
            </ScrollView>)
    }
}


var styles = StyleSheet.create
({
    text: {
        fontSize: setSpText(20),
        paddingLeft: 10,
        borderColor: '#DEDEDE',
        borderLeftWidth: 1,
        marginLeft:5,
    },
    touch: {
        flex: 1,
        marginRight: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#DEDEDE',
    },
    card: {
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0,0,0,0.1)',
        shadowColor: '#ccc',
        shadowOffset: {width: 2, height: 2,},
        shadowOpacity: 0.5,
        shadowRadius: 3,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    overlay: {
        position: 'absolute',
        padding: 16,
        right: 0,
        left: 0,
        alignItems: 'center',
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
    bottomOverlay: {
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    captureButton: {
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 40,
    },

});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        supnuevoMerchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
        unionMemberType:state.user.unionMemberType,
    })
)(My);

