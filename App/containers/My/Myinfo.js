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
import ImagePicker from 'react-native-image-picker';
import Config from "../../../config";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../proxy/Proxy');

var photoOptions={
    title:'请选择',
    cancelButtonTitle:'取消',
    takePhotoButtonTitle:'拍照',
    chooseFromLibraryButtonTitle:'从相册选取',
    quality:0.75,
    allowsEditing:true,
    noData:false,
    storageOptions:{
        skipBackup:true,
        path:'images',
    }
}
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
            shopName:null,
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
            console.log(json);
            var errMessage = json.errMessage;
            if (errMessage !== null && errMessage !== undefined && errMessage !== "") {
                alert(errMessage);

            }
            else {
                var nickName = json.nickName;
                var shopName = json.shopName;
                var attachDataUrl = json.urlAddress;
                var nubre = json.nubre;
                var cuit = json.cuit;
                var direccion = json.direccion;
                var nomroDeTelePhono = json.nomroDeTelePhono;
                var info = {
                    nickName: nickName,
                    shopName: shopName,
                    nubre: nubre,
                    cuit: cuit,
                    direccion: direccion,
                    nomroDeTelePhono: nomroDeTelePhono,

                };
                this.setState({info:info,attachDataUrl: attachDataUrl,isLoading:false,shopName:shopName})
            }
        }).catch((err) => {
            alert(err);
        });
    }

    render() {
        // var info = this.state.info;
        var ts=new Date().getTime();
        var imageurl ="https://supnuevo.s3.sa-east-1.amazonaws.com/"+ this.state.attachDataUrl;
        console.log(imageurl)
        return (
                <View style={{flex: 1}}>
                    {/* header bar */}

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
                                {this.props.username}
                            </Text>
                        </View>
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
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
                    <ScrollView>
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
                                    <Text style={styles.popoverText}>超市招牌：</Text>
                                </View>
                                <View style={{flex:2}}>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            height: 40,
                                            marginLeft: 5,
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            fontSize: setSpText(20),
                                            backgroundColor:"white",
                                            color:"black",

                                        }}
                                        onChangeText={(shopName) => {
                                            this.setState({shopName: shopName});
                                        }}
                                        defaultValue={this.state.shopName}
                                        underlineColorAndroid="transparent"
                                    />
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
                                        onPress={() =>
                                            // {this.startCamera();}
                                            this.openMyCamera()
                                        }
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
                            <View style={[styles.row,{height:80,borderWidth:0,justifyContent:"center",alignItems:"flex-end"}]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.updateInfo();
                                    }}
                                >
                                    <View style={{width:width*0.6,height:45,borderRadius:width*0.1,backgroundColor:'#387ef5',justifyContent:"center",alignItems:"center"}}>
                                        <Text style={{color:'white',fontSize:16}}>修改</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                    </ScrollView>


                </View>


        )
    }

    openMyCamera=()=>{
        ImagePicker.showImagePicker(photoOptions,(response)=>{
            console.log(response)
            if(response.didCancel){
                return
            }
            else if(response.error){
                alert(response.error)
            }
            else{
                this.bridge(response.data)
            }
        })
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
        else{
            this.setState({cameraModalVisible:true});
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
                console.log(path)
                let base64S = await RNFS.readFile(path, 'base64')
                    .then((content) => {
                        return content;
                    })
                    .catch((err) => {
                        alert("unloading error: " + err);
                    });
                console.log(base64S)
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
                imageWidth:480,
                imageHeight:640,
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

    updateInfo(){
        proxy.postes({
            url: Config.server + '/func/merchant/updateMerchantShopNameMobile',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ownerId: this.props.merchantId,
                shopName:this.state.shopName,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("修改成功");

            }
        }).catch((err) => {
            alert(err);
        });
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
    row: {
        height:65,
        borderWidth:1,
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
        shopName:state.user.shopName,

    })
)(Myinfo);

