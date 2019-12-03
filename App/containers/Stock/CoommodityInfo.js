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
    ActivityIndicator,
    ListView,
    Platform,
    ProgressBarAndroid
} from 'react-native';
import Camera from 'react-native-camera';
import MyOffer from './MyOffer';
import ImageViewer from 'react-native-image-zoom-viewer';
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconF from 'react-native-vector-icons/Feather';
import IconFo from 'react-native-vector-icons/FontAwesome';
import {setSpText} from '../../utils/ScreenUtil'
var proxy = require('../../proxy/Proxy');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');

class CoommodityInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            tamanoBulto1: null,
            tamanoBulto2: null,
            tamanoBulto3: null,
            tamanoBulto4: null,
            tamanoBulto5: null,
            codigo: null,
            descripcion: null,
            price: null,
            codigoBulto1: null,
            codigoBulto2: null,
            codigoBulto3: null,
            codigoBulto4: null,
            codigoBulto5: null,
            priceBulto1: null,
            priceBulto2: null,
            priceBulto3: null,
            priceBulto4: null,
            priceBulto5: null,

            picnum1url:null,
            picnum2url:null,
            picnum3url:null,
            picnum4url:null,
            picnum5url:null,
            mainattachid:null,
            images:[],
            imageModalVisible:false,
            index:0,

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

    fetchData(priceId) {

        let sessionId = this.props.sessionId;
        let password = this.props.password;
        let username = this.props.username;

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
                    url: Config.server2 + "/func/ventas/getCommodityPriceFormByPriceId",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        priceId: priceId * 1,
                        merchantId:this.props.merchantId,
                    }
                }).then((json) => {
                    if(json.re==1){
                        var json = json.data;
                        var errorMsg = json.message;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            alert(errorMsg);
                        } else {
                            this.setCommogity(json);
                            this.getCommodityPicList(json.commodityId)
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

    getCommodityPicList(commodityId){

        if (commodityId === null || commodityId === undefined) {
            this.setState({picturenum1:null,picturenum2:null,picturenum3:null,picturenum4:null,picturenum5:null});
            return;
        }
        proxy.postes_ventas({
            url: Config.server2 + '/func/ventas/getSupnuevoVentasCommodityImageNew',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                commodityId: commodityId * 1,
            }
        }).then((json) => {
            if(json.re==1){
            var json = json.data;
            var errorMsg = json.errorMsg;
            if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                alert(errorMsg);
            } else {
                var picturenum1 = json[0];
                var picturenum2 = json[1];
                var picturenum3 = json[2];
                var picturenum4 = json[3];
                var picturenum5 = json[4];
                var mainattachid = json.mainattachid;
                var images = [];

                if (picturenum1 != null) images.push({url: picturenum1});
                if (picturenum2 != null) images.push({url: picturenum2});
                if (picturenum3 != null) images.push({url: picturenum3});
                if (picturenum4 != null) images.push({url: picturenum4});
                if (picturenum5 != null) images.push({url: picturenum5});

                this.setState({
                    picnum1url: "https://supnuevo.s3.sa-east-1.amazonaws.com/"+picturenum1,
                    picnum2url: picturenum2,
                    picnum3url: picturenum3,
                    picnum4url: picturenum4,
                    picnum5url: picturenum5,
                    mainattachid: mainattachid,
                    images: images
                });
            }
        }
        }).catch((err) => {
            alert(err);
        });

    }

    setCommogity(json) {
        let goodInfo = json;//price传过来是Integer，Textinput只显示String
        if (goodInfo.priceBulto1 === undefined || goodInfo.priceBulto1 === null) {
            goodInfo.priceBulto1 = "";
        }
        if (goodInfo.priceBulto2 === undefined || goodInfo.priceBulto2 === null) {
            goodInfo.priceBulto2 = "";
        }
        if (goodInfo.priceBulto3 === undefined || goodInfo.priceBulto3 === null) {
            goodInfo.priceBulto3 = "";
        }
        if (goodInfo.priceBulto4 === undefined || goodInfo.priceBulto4 === null) {
            goodInfo.priceBulto4 = "";
        }
        if (goodInfo.priceBulto5 === undefined || goodInfo.priceBulto5 === null) {
            goodInfo.priceBulto5 = "";
        }
        if (goodInfo.price === undefined || goodInfo.price === null) {
            goodInfo.price = "";
        }
        this.setState({
            descripcion: goodInfo.descripcion,
            commodityId: goodInfo.commodityId,
            codigoBulto1: goodInfo.codigoBulto1,
            tamanoBulto1: goodInfo.tamanoBulto1,
            codigoBulto2: goodInfo.codigoBulto2,
            tamanoBulto2: goodInfo.tamanoBulto2,
            codigoBulto3: goodInfo.codigoBulto3,
            tamanoBulto3: goodInfo.tamanoBulto3,
            codigoBulto4: goodInfo.codigoBulto4,
            tamanoBulto4: goodInfo.tamanoBulto4,
            codigoBulto5: goodInfo.codigoBulto5,
            tamanoBulto5: goodInfo.tamanoBulto5,
            priceBulto1: goodInfo.priceBulto1 + "",
            priceBulto2: goodInfo.priceBulto2 + "",
            priceBulto3: goodInfo.priceBulto3 + "",
            priceBulto4: goodInfo.priceBulto4 + "",
            priceBulto5: goodInfo.priceBulto5 + "",
            codigo: goodInfo.codigo,
            price: goodInfo.price + "",
        });
    }

    componentDidMount() {
        // this.getCommodityPicList(commodityId)
        let priceId = this.props.priceId;
        if (priceId !== undefined && priceId !== null)
            this.fetchData(priceId);
    }

    render() {
        // var ProgressBar=
        //     <ProgressBarAndroid  color="red" styleAttr='Inverse'/>

        let picnum1url = this.state.picnum1url;
        let picnum2url = this.state.picnum2url;
        let picnum3url = this.state.picnum3url;
        let picnum4url = this.state.picnum4url;
        let picnum5url = this.state.picnum5url;
        let mainattachid = this.state.mainattachid;

        if (mainattachid === null || mainattachid === undefined) {
            picnum1url = this.state.picnum1url;
            picnum2url = this.state.picnum2url;
            picnum3url = this.state.picnum3url;
            picnum4url = this.state.picnum4url;
            picnum5url = this.state.picnum5url;
        } else if (mainattachid === 1) {
            picnum1url = this.state.picnum1url;
            picnum2url = this.state.picnum2url;
            picnum3url = this.state.picnum3url;
            picnum4url = this.state.picnum4url;
            picnum5url = this.state.picnum5url;
        } else if (mainattachid === 2) {
            picnum1url = this.state.picnum2url;
            picnum2url = this.state.picnum1url;
            picnum3url = this.state.picnum3url;
            picnum4url = this.state.picnum4url;
            picnum5url = this.state.picnum5url;
        } else if (mainattachid === 3) {
            picnum1url = this.state.picnum3url;
            picnum2url = this.state.picnum1url;
            picnum3url = this.state.picnum2url;
            picnum4url = this.state.picnum4url;
            picnum5url = this.state.picnum5url;
        } else if (mainattachid === 4) {
            picnum1url = this.state.picnum4url;
            picnum2url = this.state.picnum1url;
            picnum3url = this.state.picnum2url;
            picnum4url = this.state.picnum3url;
            picnum5url = this.state.picnum5url;
        } else if (mainattachid === 5) {
            picnum1url = this.state.picnum5url;
            picnum2url = this.state.picnum1url;
            picnum3url = this.state.picnum2url;
            picnum4url = this.state.picnum3url;
            picnum5url = this.state.picnum4url;
        }

        var descripcion = this.state.descripcion;
        if(descripcion!=null && descripcion!='')descripcion = descripcion.toUpperCase();

        return (
            <View style={{flex: 1}}>
                {/* header bar */}
                <View style={[{
                    backgroundColor: '#387ef5',
                    paddingTop:Platform.OS=='ios'?40:10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                }, styles.card]}>
                    <View style={{flex: 1}}>
                        <TouchableOpacity onPress={() => {
                            this.goBack()
                        }}>
                            <Icon name="chevron-left" color="#fff" size={25}></Icon>
                        </TouchableOpacity>
                    </View>
                    <Text style={{fontSize: setSpText(22), flex: 3, textAlign: 'center', color: '#fff'}}>
                        {this.props.username}
                    </Text>
                    <View style={{flex: 1, marginRight: 10, flexDirection: 'row', justifyContent: 'center'}}>
                    </View>
                </View>
                <ScrollView>
                    <View>

                        <View style={{flex: 1,marginTop:10}}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={true}
                                pagingEnabled={true}
                            >
                                {this.state.picnum1url !== null?
                                    <View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.setState({imageModalVisible:true})
                                            }}
                                        >
                                        <Image resizeMode="contain"
                                               style={styles.picstyle}
                                               source={{uri: picnum1url}}/>
                                        </TouchableOpacity>
                                    </View>
                                    :
                                    <View style={[styles.picstyle, styles.horizontal]}>
                                        <IconFo name="camera" color="#B2B2B2" size={100}/>
                                        <Text>没东西</Text>
                                        <Text>{this.state.picnum1url}</Text>
                                    </View>
                                }
                                {picnum2url !== null ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({imageModalVisible:true})
                                    }}
                                    >
                                            <Image resizeMode="contain"
                                                   style={styles.picstyle}
                                                   source={{uri: picnum2url}}
                                            />
                                        <Text>{this.state.picnum2url}</Text>
                                    </TouchableOpacity>
                                    :
                                    <View style={[styles.picstyle, styles.horizontal]}>
                                        <IconFo name="camera" color="#B2B2B2" size={100}/>
                                        <Text>没东西</Text>
                                    </View>
                                }
                                {picnum3url !== null ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({imageModalVisible:true})
                                        }}
                                    >
                                    <Image resizeMode="contain"
                                           style={styles.picstyle}
                                           source={{uri: picnum3url}}/>
                                    </TouchableOpacity>
                                    :
                                    <View style={[styles.picstyle, styles.horizontal]}>
                                        <IconFo name="camera" color="#B2B2B2" size={100}/>
                                        <Text>没东西</Text>
                                    </View>
                                }
                                {picnum4url !== null ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({imageModalVisible:true})
                                        }}>
                                            <Image resizeMode="contain"
                                                   style={styles.picstyle}
                                                   source={{uri: picnum4url}}
                                            />
                                    </TouchableOpacity>
                                    :
                                    <View style={[styles.picstyle, styles.horizontal]}>
                                        <IconFo name="camera" color="#B2B2B2" size={100}/>
                                        <Text>没东西</Text>
                                    </View>
                                }
                                {picnum5url !== null ?
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({imageModalVisible:true})
                                        }}>
                                                <Image resizeMode="contain"
                                                        style={styles.picstyle}
                                                        //indicator={ProgressBar}
                                                        source={{uri: picnum5url}}
                                                /></TouchableOpacity>
                                    :
                                    <View style={[styles.picstyle, styles.horizontal]}>
                                        <IconFo name="camera" color="#B2B2B2" size={100}/>
                                        <Text>没东西</Text>
                                    </View>
                                }
                            </ScrollView>
                        </View>

                        <View style={styles.leftSite}>
                            <Text style={[styles.titletext, {
                                paddingVertical: 5,
                                paddingHorizontal: 5
                            }]}>商品条码:{this.state.codigo}</Text>
                        </View>
                        <View style={styles.leftSite}>
                            <Text style={[styles.titletext, {
                                paddingHorizontal: 5
                            }]}>商品名称:{descripcion}</Text>
                        </View>
                        <View style={[styles.leftSite]}>
                            <Text style={[styles.titletext, {
                                paddingVertical: 5,
                                paddingHorizontal: 5
                            }]}>商品价格:{this.state.price}</Text>
                        </View>


                    </View>
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
                            color="#fff"
                        />
                        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                            <Text style={{color: '#fff', fontSize: setSpText(18), alignItems: 'center'}}>
                                加载中。。
                            </Text>
                            <Text style={{color: '#fff', fontSize: setSpText(24), alignItems: 'center'}}>
                                {this.state.loginDot}
                            </Text>
                        </View>
                    </View>
                </Modal>

                <Modal
                    visible={this.state.imageModalVisible}
                    transparent={true}
                    onRequestClose={() => this.setState({ imageModalVisible: false })}
                >
                    <ImageViewer
                        imageUrls={this.state.images}
                        index={this.state.index}
                        onSwipeDown={() => {
                        this.setState({imageModalVisible:false})
                        }}
                        enableSwipeDown={true}
                        onClick={()=>{
                            this.setState({imageModalVisible:false})
                        }}
                        enableImageZoom={true} // 是否开启手势缩放
                    />
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
    titletext: {
        color: '#222',
        fontSize: setSpText(18),
    },
    //水平排列格式
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 5,
        paddingRight: 10,
    },
    leftSite: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },
    picstyle: {
        width: width - 20,
        height: width - 40,
        marginLeft: 10,
        marginRight: 10,
        borderWidth: 1,
        borderColor: "black",
    },
    //图片格式
    smallpicstyle: {
        width: 120,
        height: 120,
        padding: 10,
        marginTop: 30,
        marginHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: "black",
    },
});


module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
        merchantId:state.user.supnuevoMerchantId,
    })
)(CoommodityInfo);
