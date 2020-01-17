/**
 * Created by imac on 2017/7/27.
 */
/**
 * Created by dingyiming on 2017/7/25.
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
    View,
    Alert,
    Modal,
    TouchableOpacity,
    ListView,
    Platform
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
import IconA from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import {setSpText} from "../../utils/ScreenUtil";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import Config from "../../../config";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');


class Myinfo extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    componentDidMount(): void {
        this.getSupnuevoMerchantInfo();

    }

    constructor(props) {
        super(props);
        this.state = {
            info: null,
            nickName:this.props.nickName,
            nubre:this.props.nubre,
            cuit:this.props.cuit,
            direccion:this.props.direccion,
            nomroDeTelePhono:this.props.nomroDeTelePhono,
            cameraModalVisible:false,
            pictureUri:null,
            attachDataUrl:null,
            isLoading:true,
        };
    }

    //获取商户信息
    getSupnuevoMerchantInfo() {

        proxy.postes({
            url: Config.server + "/func/merchant/getSupnuevoMerchantInfoMobile",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                merchantId:this.props.merchantId,
            }
        }).then((json) => {


            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                alert(errMessage);

            }
            else {
                var nickName = json.nickName;
                var attachDataUrl = json.urlAddress;
                var nubre = json.nubre;
                var cuit = json.cuit;
                var direccion = json.direccion;
                var nomroDeTelePhono = json.nomroDeTelePhono;
                var info = {
                    nickName: nickName,
                    nubre: nubre,
                    cuit: cuit,
                    direccion: direccion,
                    nomroDeTelePhono: nomroDeTelePhono,

                };
                this.setState({info:info,attachDataUrl: attachDataUrl,isLoading:false})
            }
        }).catch((err) => {
            alert(err);
        });
    }

    render() {
        // var info = this.state.info;
        var ts=new Date().getTime();
        var imageurl ="https://supnuevo.s3.sa-east-1.amazonaws.com/"+ this.state.attachDataUrl+"?"+ts;
        return (
                <View style={{flex: 1}}>
                    {/* header bar */}

                    <View style={{
                        backgroundColor: '#387ef5',
                        height: 55,
                        padding: 12,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row'
                    }}>
                        <TouchableOpacity style={{
                            flex: 1,
                            height: 45,
                            marginRight: 10,
                            marginTop: 10
                        }}
                                          onPress={() => {
                                              this.goBack();
                                          }}>
                            <Icon name="angle-left" color="#fff" size={40}></Icon>
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: setSpText(22),
                            marginTop: 7,
                            flex: 3,
                            textAlign: 'center',
                            color: '#fff'
                        }}>
                            {this.props.username}
                        </Text>
                        <View style={{flex: 1}}>

                        </View>
                    </View>

                    {/*相机组件*/}
                    <Modal
                        animationType={"slide"}
                        transparent={false}
                        visible={this.state.cameraModalVisible}
                        onRequestClose={() => {
                            this.setState({cameraModalVisible: false});
                        }}
                    >
                        <Camera
                            ref={(ref) => {
                                this.camera = ref;
                            }}
                            style={styles.preview}
                            playSoundOnCapture={false}
                            fixOrientation={true}
                            captureQuality="medium"
                            captureTarget={Camera.constants.CaptureTarget.temp}
                            aspect={Camera.constants.Aspect.fill}
                            permissionDialogTitle={'Permission to use camera'}
                            permissionDialogMessage={'We need your permission to use your camera phone'}
                        />
                        <View style={{
                            height: 100,
                            flexDirection: 'row',
                            backgroundColor: 'transparent',
                            justifyContent: 'center',
                        }}>
                            <TouchableOpacity
                                onPress={() => this.takePicture()}
                                style={[styles.capture, {
                                    backgroundColor: 'transparent',
                                }]}
                            >
                                <IconE name="camera" color="#222" size={30}/>

                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setState({cameraModalVisible: false})
                                }}
                                style={[styles.capture, {
                                    backgroundColor: 'transparent',
                                }]}
                            >
                                <IconE name="circle-with-cross" color="#222" size={30}/>

                            </TouchableOpacity>
                        </View>
                    </Modal>

                    {/* body */}
                    {this.state.isLoading == true ?
                        null
                        :
                        <View style={{padding: 10, marginTop: 20}}>

                            <View style={styles.row}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>昵称：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.popoverText}>{this.state.info.nickName}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>商户名称：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.popoverText}>{this.state.info.nubre}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>税号：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.popoverText}>{this.state.info.cuit}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>地址：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.popoverText}>{this.state.info.direccion}</Text>
                                </View>
                            </View>
                            <View style={styles.row}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>telephone：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <Text style={styles.popoverText}>{this.state.info.nomroDeTelePhono}</Text>
                                </View>
                            </View>
                            <View style={[styles.row,{height:height*0.2}]}>
                                <View style={{flex:1}}>
                                    <Text style={styles.popoverText}>商户LOGO：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <TouchableOpacity
                                        //ref="picture1"
                                        onPress={() => {
                                            this.startCamera();
                                        }}
                                    >
                                        <View style={styles.picstyle}>
                                            {this.state.attachDataUrl == null ?
                                                <IconI name="ios-add" size={40} color="#222"/>
                                                :
                                                <Image resizeMode="contain" style={{
                                                    width: 120,
                                                    height: 120,
                                                }}
                                                       source={{uri:imageurl}}
                                                />

                                            }
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }

                </View>


        )
    }



    startCamera(){
        if(Platform.OS === 'ios') {
            if(Camera){
                Camera.checkDeviceAuthorizationStatus()
                    .then(access => {
                        if(!access) {
                            Alert.alert('相机权限没打开', '请在iPhone的设置中,允许访问您的摄像头')
                            this.setState({cameraModalVisible:false})
                        }
                        else this.setState({cameraModalVisible:true});
                    });
            }
        }
    }

    takePicture = async function () {
        let _this = this;

        if (this.camera) {
            try {
                // this.show("11");
                // const options = {quality: 0.2};
                let path = await this.camera.capture()
                    .then(function (data) {
                        return data.path;
                        // path = data.path;
                    })
                    .catch(err => this.show(err));
                // this.show("33");
                let base64S = await RNFS.readFile(path, 'base64')
                    .then((content) => {
                        return content;
                    })
                    .catch((err) => {
                        alert("unloading error: " + err);
                    });
                // this.show("22");
                this.bridge(base64S);

                // if(flag==0){_this.getSupnuevoMerchantInfo();return;}



                // {_this.setState({cameraModalVisible: false});return;}

                this.setState({pictureUri: path, cameraModalVisible: false});
                _this.setState({cameraModalVisible: false});
                // let permission = this.requestExternalStoragePermission(data);
            }
            catch
                (e) {
                console.log(e);
            }

        }
    };

    bridge(fileData){
        this.uploadMerchantImage(fileData);

    }

    uploadMerchantImage(fileData){
        proxy.postes({
            url: Config.server + '/func/comm/uploadAttachData',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ownerId: this.props.merchantId,
                fileData: fileData,
                folder:"supnuevo/merchant/logo",
                beanName:"supnuevoMerchantProcessRmi",
                fileName:this.props.merchantId+".jpg",
                // remark:"",
                attachType:"91",
                imageWidth:100,
                imageHeight:200,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("头像上传成功");

            }
            // this.getSupnuevoMerchantInfo();
            this.setState({attachDataUrl:json.urlAddress})
        }).catch((err) => {
            alert(err);
        });
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
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    popoverText: {

        fontSize: setSpText(16)
    },
    picstyle: {
        width: 120,
        height: 120,
        //padding: 10,
        //marginTop: 30,
        //marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
});


module.exports = connect(state => ({

        username: state.user.username,
        merchantId: state.user.supnuevoMerchantId,

    })
)(Myinfo);

