
import React, {Component} from 'react';

import  {
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
    TouchableOpacity
} from 'react-native';

import {connect} from 'react-redux';

import Camera from 'react-native-camera';
import IconE from 'react-native-vector-icons/Entypo';
import IconI from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome';
import {setSpText} from "../../../utils/ScreenUtil";
import RNFS from 'react-native-fs';
import Config from "../../../../config";
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var proxy = require('../../../proxy/Proxy');
var count=0;

class UnionRule extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            orderMinLimit:0,
            discountScale: 0,
            regulation: "说明文字",
            picture:null,
            cameraModalVisible:false,
            pictureuri: null,
            attachId:null,
            attachDataUrl:null,
        };
    }

    componentDidMount(): void {
        this.getUnionRegulation();
    }

    render() {
        var mini=this.state.orderMinLimit;
        var discount=this.state.discountScale;
        var imageurl ="https://supnuevo.s3.sa-east-1.amazonaws.com/"+ this.state.attachDataUrl;
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
                    <TouchableOpacity style={{flex: 1, height: 45, marginRight: 10, marginTop:10}}
                                      onPress={() => {
                                          this.goBack();
                                      }}>
                        <Icon name="angle-left" color="#fff" size={40}/>
                    </TouchableOpacity>
                    <Text style={{fontSize: 22, marginTop:7,flex: 3, textAlign: 'center',color: '#fff'}}>
                        Supnuevo(6.0)-{this.props.username}
                    </Text>
                    <View style={{flex:1}}>

                    </View>
                </View>
                {/* body */}
                {this.props.unionMemberType == 2 ?  //对登陆者的身份进行判断显示不同的界面
                    <ScrollView style={{marginTop: 20}}>
                        <View style={[{borderTopWidth: 1}, styles.touch]}>
                            <Text style={styles.text}>本店最低最终最小购买量为：</Text>
                            <View style={styles.change}>
                                <View style={{borderBottomWidth:2}}>
                                    {this.state.orderMinLimit==null?
                                        <TextInput
                                            style={styles.input}
                                            // defaultValue={}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({orderMinLimit: value})
                                            }}
                                        />
                                        :
                                        <TextInput
                                            style={styles.input}
                                            defaultValue={mini.toString()}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({orderMinLimit: value})
                                            }}
                                        />
                                    }
                                </View>
                                <Text style={[styles.text, {marginTop: 20}]}>peso</Text>
                            </View>
                        </View>

                        <View style={[{borderTopWidth: 1}, styles.touch]}>
                            <Text style={styles.text}>本店折扣商品占总购买量的百分比为：</Text>
                            <View style={styles.change}>
                                <View style={{borderBottomWidth:2}}>
                                    {this.state.discountScale==null?
                                        <TextInput
                                            style={styles.input}
                                            // defaultValue={}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({discountScale: value})
                                            }}
                                        />
                                        :
                                        <TextInput
                                            style={styles.input}
                                            defaultValue={discount.toString()}
                                            placeholderTextColor={"black"}
                                            underlineColorAndroid={"transparent"}
                                            onChangeText={(value) => {
                                                this.setState({discountScale: value})
                                            }}
                                        />
                                    }
                                </View>
                                <Text style={[styles.text, {marginTop: 20}]}>%</Text>
                            </View>
                        </View>

                        <View style={[{borderTopWidth: 1}, styles.touch]}>
                            <Text style={styles.text}>本店其他关于购买及送货的文字说明为（西语）：</Text>
                            <View style={[{borderWidth: 1}, styles.regulation]}>
                                <View>
                                    <TextInput style={[styles.textInput,{textAlignVertical: 'top'}]}
                                               defaultValue={this.state.regulation}
                                               placeholderTextColor={"black"}
                                               multiline={true}
                                               underlineColorAndroid={"transparent"}
                                               onChangeText={(value) => {this.setState({regulation:value})}}
                                    />
                                </View>
                            </View>
                        </View>

                        {/*上传图片*/}

                        <View style={[{borderTopWidth: 1}, styles.touch,{paddingTop:10}]}>
                            <View style={styles.headphoto}><Text style={{fontSize:setSpText(20)}}>联盟头像</Text></View>
                            <TouchableOpacity
                                //ref="picture1"
                                onPress={() => {
                                    this.testButton(1);
                                    //this.selectPic(1);
                                }}
                                onLongPress={() => {
                                    // this.onLongPress(1);
                                    this.deleteButton(1);
                                }}
                            >
                                <View style={styles.picstyle}>
                                    {this.state.attachDataUrl === null ?
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

                        {/*保存按钮*/}

                        <View style={[{borderTopWidth: 1}, styles.touch]}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.updateSupnuevoBuyerUnion()
                                }}
                            >
                                <View style={styles.but}>
                                    <Text>保存修改</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </ScrollView>
                    :

                    <ScrollView style={{marginTop: 20,flex:1}}>
                        <View style={[{borderTopWidth: 1}, styles.readonly]}>
                            <Text style={styles.text}>本店最低最终最小购买量为：</Text>
                            <Text style={[styles.text,{marginTop:20}]}>{this.state.orderMinLimit} peso</Text>
                        </View>

                        <View style={[{borderTopWidth: 1}, styles.readonly]}>
                            <Text style={styles.text}>本店折扣商品占总购买量的百分比为：</Text>
                            <Text style={[styles.text,{marginTop:20}]}>{this.state.discountScale} %</Text>
                        </View>

                        <View style={[{borderTopWidth: 1}, styles.readonly]}>
                            <Text style={styles.text}>本店其他关于购买及送货的文字说明为（西语）：</Text>
                            <View style={[{borderWidth: 1}, styles.textInput]}>
                                <Text style={styles.text}>{this.state.regulation} </Text>
                            </View>
                        </View>
                    </ScrollView>
                }
            </View>

        )
    }

    testButton(){
        count++;
        this.timer = setTimeout(() => {

            if (count === 1) {
                this.selectPic();
            }
            if (count === 2) {
                this.onLongPress()
            }
            count = 0;
            clearTimeout(this.timer);

        }, 500);
    }

    selectPic() {//点击图片
        if (this.state.picture === null) {
            this.setPicture(1);
        }
        else {
            this.setState({pictureuri: this.state.picture});
        }
    }

    setPicture() {
        this.setState({cameraModalVisible: true});
    }

    //获取用户相册权限，用来保存照片
    requestExternalStoragePermission = async (data) => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title':_name.申请相册权限,
                    'message': 'We need your permission to use your album',
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("现在你获得摄像头权限了");
                this.saveImg(data.uri);
            } else {
                console.log("获取权限失败");

            }
        } catch (err) {
            alert(err);
            console.warn(err)
        }
    };

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
                var flag = this.uploadCommodityImage(base64S);

                if(flag==0){_this.setState({cameraModalVisible: false});return;}

                this.setState({picture: path, cameraModalVisible: false});
                _this.setState({cameraModalVisible: false});
                // let permission = this.requestExternalStoragePermission(data);
            }
            catch
                (e) {
                console.log(e);
            }

        }
    };

    uploadCommodityImage(fileData){
        proxy.postes({
            url: Config.server + '/func/comm/uploadAttachData',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                ownerId: this.props.unionId,
                fileData: fileData,
                folder:"supnuevo/union/logo",
                beanName:"supnuevoBuyerUnionProcessRmi",
                fileName:this.props.unionId+".jpg",
                // remark:"",
                attachType:"93",
                imageWidth:120,
                imageHeight:120,
            }
        }).then((json) => {
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);

            } else {
                //this.closeCamera();
                alert("ok");
                this.getUnionRegulation()

            }
        }).catch((err) => {
            alert(err);
        });
    }

    // deleteButton(){
    //     Alert.alert("确定删除图片？")
    // }

    getUnionRegulation(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionRegulationInfo",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re == 1){
                var orderMinLimit = json.data.orderMinLimit;
                var discountScale = json.data.discountScale;
                var regulation = json.data.regulation;
                var attachId=json.data.attachId;
                var attachDataUrl=json.data.attachDataUrl;
                this.setState({orderMinLimit:orderMinLimit, discountScale:discountScale, regulation:regulation,attachId:attachId,attachDataUrl:attachDataUrl})
            }
        }).catch((err)=>{alert(err);});
    }

    updateSupnuevoBuyerUnion(){


        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnion",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
                orderMinLimit:parseFloat(this.state.orderMinLimit),
                discountScale:parseFloat(this.state.discountScale),
                regulation: this.state.regulation,
            }
        }).then((json)=> {
            if(json.re === 1){
                alert('修改成功')
                this.getUnionRegulation()
            }
        }).catch((err)=>{alert(err);});
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
    touch: {
        flex: 1,
        padding:25,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'column',
        borderColor: '#DEDEDE',
    },
    readonly:{
        flex: 1,
        padding:25,
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent:'center',
        flexDirection: 'column',
        borderColor: '#DEDEDE',
    },
    text: {
        fontSize: setSpText(20),
        paddingLeft: 10,
        borderColor: '#DEDEDE',
        borderLeftWidth: 1,
        marginLeft:5,
    },
    regulation:{
        //flex:1,
        width:width-40,
        // margin:10,
        // padding:10,
        height:height*0.3,
        justifyContent:"center",
        alignItems:"center",
        borderWidth:1,
        // borderColor:"blue",
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
    but:{
        alignItems:"center",
        justifyContent:"center",
        borderWidth:1,
        width:width*0.4,
        height:40,
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
    input:{
        width:width*0.2,
        height:height*0.07,
        // borderWidth:1,
        // borderColor:"green",
        marginTop:10,
        // paddingTop:15,
        paddingLeft:20,
        fontSize: setSpText(20),
    },
    change:{
        flexDirection:"row",
        justifyContent:"center",
        // borderWidth:1,
        // borderColor:"red",
        height:height*0.09,
    },
    textInput:{
        //flex:1,
        width:width-50,
        // margin:10,
        // padding:10,
        height:height*0.3-20,
        // borderWidth:1,
        // borderColor:"red",
        fontSize: setSpText(20),
    },
    headphoto:{
        width:width,
        marginBottom:10,
        alignItems:"center",
        justifyContent:"center",
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
        unionMemberType:state.user.unionMemberType,

    })
)(UnionRule);

