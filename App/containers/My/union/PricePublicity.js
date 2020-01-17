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
    Platform,
} from 'react-native';

import {connect} from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome';
// import IconA from 'react-native-vector-icons/AntDesign';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import {setSpText} from "../../../utils/ScreenUtil";
import Ionicons from 'react-native-vector-icons/Ionicons'
import Camera from 'react-native-camera';
import RNFS from 'react-native-fs';
import goods from "../../../test/goods";
import Config from "../../../../config";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');

const is_not_alive_icon = <Ionicons name={"md-radio-button-off"} size={25}/>;
const is_alive_icon = <Ionicons name={"md-checkmark-circle-outline"} size={25}/>;

class PricePublicity extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            advertisements:[],
            cameraModalVisible:false,
            attachId:null,
            pictureUri:null,
            adInfo:[],
            refresh:false,
            advertisementNum:null,
            advertisementId:null,
        };
    }

    componentDidMount(): void {
        this.getAdvertisementList();
    }

    render() {
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

        var advertisementListView=

                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(this.state.advertisements)}
                    renderRow={this.renderRow.bind(this)}
                />

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
                            Supnuevo(6.0)-{this.props.username}
                        </Text>
                    </View>
                    {this.props.unionMemberType==2?
                        <TouchableOpacity
                            style={{position:"absolute",
                                    right:15,
                                    top:38,
                                    height: 30,}}
                            onPress={
                                ()=>{
                                    this.addPromotion();
                                }
                            }>
                            <IconI name="ios-add-circle-outline" size={30} color="#fff" />
                        </TouchableOpacity>

                        :
                        null

                    }


                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                <View style={{height:height*0.8}}>
                    <ScrollView>
                        {advertisementListView}
                    </ScrollView>
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
            </View>



        )
    }

    renderRow(rowData) {
        var imageuri ="https://supnuevo.s3.sa-east-1.amazonaws.com/"+ rowData.urlAddress;
        // const image = rowData.url?{uri:rowData.image}:require('../../../img/img_logo.png');
        // var isAlive=rowData.isAlive
        if(this.props.unionMemberType==2){
            var row =
                <TouchableOpacity
                    onPress={()=>this.checkAlive(rowData.isAlive,rowData.advertisementId)}
                    onLongPress={()=>{this.deleteAdvertisement(rowData.advertisementId)}}
                >
                    <View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>
                        {rowData.isAlive === 1?is_alive_icon:is_not_alive_icon}
                    </View>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                    }}>
                        <Image source={{uri:imageuri}} resizeMode={"contain"} style={styles.image}/>
                    </View>
                </TouchableOpacity>;
        }
        else{
            var row=
                <View>
                    <View style={{paddingTop: 5, flexDirection: 'row',alignItems:"flex-end",justifyContent:'flex-end'}}>
                        {rowData.isAlive === 1?is_alive_icon:is_not_alive_icon}
                    </View>
                    <View style={{
                        flex: 1, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'flex-start', backgroundColor: '#fff',width:width
                    }}>
                        <Image source={{uri:imageuri}} resizeMode={"contain"} style={styles.image}/>
                    </View>
                </View>
        }

        return row;
    }



    addPromotion(){
        if(Platform.OS === 'ios') {
            if(Camera){
                Camera.checkDeviceAuthorizationStatus()
                    .then(access => {
                        if(!access) {
                            Alert.alert('相机权限没打开', '请在iPhone的设置选项中,允许访问您的摄像头')
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
                this.saveAdvertisement(base64S);

                // {this.state.advertisementNum}



                {_this.setState({cameraModalVisible: false});return;}

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

    getAdvertisementList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionAdvertisementFormList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {

                unionId: this.props.unionId,
            }

        }).then((json)=> {
            if(json.re == 1){
                this.setState({advertisements:json.data})
            }
        }).catch((err)=>{alert(err);});
    }

    saveAdvertisement(base64S){
        proxy.postes({
            url: Config.server + '/func/union/createSupnuevoBuyerUnionAdvertisement',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                // advertisementId:advertisementId,
            }
        }).then((json) => {
            var advertisementNum=json.data.advertisementNum
            var advertisementId=json.data.advertisementId
            // this.setState({advertisementNum:advertisementNum})
            // this.setState({advertisementId:json.data.advertisementId})
            this.uploadAdvertisementImage(base64S,advertisementNum,advertisementId);
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("上传成功");

            }

        }).catch((err) => {
            alert(err);
        });
    }

    uploadAdvertisementImage(fileData,advertisementNum,advertisementId){
        proxy.postes({
            url: Config.server + '/func/comm/uploadAttachData',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ownerId: advertisementId,
                fileData: fileData,
                beanName:"supnuevoBuyerUnionAdvertisementProcessRmi",
                folder:"supnuevo/union/advertisement",
                fileName:this.props.unionId+'/'+advertisementNum+".jpg",
                remark:"supnuevo",
                attachType:"97",
                imageWidth:200,
                imageHeight:100,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            }
            this.getAdvertisementList();
        }).catch((err) => {
            alert(err);
        });
    }

    deleteAdvertisement(advertisementId){
        proxy.postes({
            url: Config.server + '/func/union/deleteSupnuevoBuyerUnionAdvertisement',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                advertisementId:advertisementId,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("删除成功");
                this.getAdvertisementList()
            }
        }).catch((err) => {
            alert(err);
        });
    }

    checkAlive(isAlive,advertisementId){
        if(isAlive==1){
            this.setAdvertisementIsAlive(advertisementId,0)
        }
        if(isAlive==0){
            this.setAdvertisementIsAlive(advertisementId,1)
        }
    }
    setAdvertisementIsAlive(advertisementId,AliveState){
        proxy.postes({
            url: Config.server + '/func/union/setSupnuevoBuyerUnionAdvertisementIsAlive',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                advertisementId:advertisementId,
                isAlive:AliveState,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                alert("设置成功");
                this.getAdvertisementList()
            }
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
    popoverText: {
        fontSize: 16
    },
    image:{
        width: width,
        height: 100,
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,
    })
)(PricePublicity);

