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
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import Config from '../../../config';
import Icon from 'react-native-vector-icons/FontAwesome';
import Camera from 'react-native-camera';
import CoommodityInfo from './CoommodityInfo';
import {setAttachIdList,setPictureUrl} from '../../action/actionCreator'
import {setSpText} from '../../utils/ScreenUtil'

var proxy = require('../../proxy/Proxy');
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
var head="https://supnuevo.s3.sa-east-1.amazonaws.com/";

class CompanyInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showProgress: false,
            ventasInfo: this.props.ventasInfo,

            infoList: [],
            pictureList:[],
            attachIdList:[],

            start: 0,
            picStart:0,
            limit: 10,
            arrlong: 0,
            first :1,
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

    navigatorToCoomodityInfo(priceId){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CoommodityInfo',
                component: CoommodityInfo,
                params: {
                    priceId: priceId,
                    username: this.props.username,
                    sessionId: this.props.sessionId,
                    password: this.props.password,
                }
            })
        }
    }

    getPriceOptionList() {
        let ventasId = this.props.ventasInfo.ventasId;

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

                //this.setState({showProgress: true});

                var start = this.state.start;
                var max = this.state.limit;
                if (this.state.first === 1) {
                    this.setState({first: 2});
                }

                proxy.postes_ventas({
                    url: Config.server2 + "/func/ventas/getVentasCommodityPriceOptionListPerPageFromSupnuevo",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: {
                        ventasId: ventasId,
                        start:start,
                        max:max,
                        merchantId:this.props.merchantId,
                    }
                }).then((json) => {

                    if(json.re==1){
                        var json = json.data
                        var errorMsg = json.message;
                        if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                            alert(errorMsg);
                        } else {
                            var start = this.state.start;
                            var infoListOrigin = this.state.infoList;
                            var attachIdListOrigin = this.state.attachIdList;
                            var infoList = json.ArrayList
                            var attachIdList = [];
                                infoList.map((info) => {
                                    attachIdList.push(info.imageattachid)
                                })

                            infoList = infoListOrigin.concat(infoList);
                            attachIdList = attachIdListOrigin.concat(attachIdList)

                            this.setState({infoList: infoList, showProgress: false,arrlong:json.ArrayList.length});

                            setTimeout(()=>{
                                this.getPictureByAttachIdList(attachIdList,start,json.ArrayList.length)
                            },1000)
                        }
                    }
                }).catch((err) => {
                    alert(err);
                });

            }else{
                this.setState({showProgress: false});
            }

            setTimeout(()=>{
                this.setState({showProgress:false})
            },1000)
        }).catch((err) => {
            alert(err);
            setTimeout(()=>{
                this.setState({showProgress:false})
            },1000)
        });
    }

    getPictureByAttachIdList(imageattachidList,start,arrlong) {

        proxy.postes_ventas({
            url: Config.server2 + "/func/ventas/getImageDataListByAttachIdListFromSupnuevo",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                imageattachidList: imageattachidList,
                start:start,
                arrlong:arrlong,
            }
        }).then((json) => {

            if(json.re==1){
                var json = json.data
                var errorMsg = json.message;
                if (errorMsg !== null && errorMsg !== undefined && errorMsg !== "") {
                    alert(errorMsg);
                } else {
                    var pictureListOrigin = this.state.pictureList;
                    var infoList = this.state.infoList;
                    var pictureurlList = json.pictureurlList;
                    var start = json.start;
                    var arrlong = json.arrlong;
                    var pictureList = pictureListOrigin.concat(pictureurlList)

                    for(var i=0;i<pictureurlList.length;i++){
                        var pictureurl = pictureurlList[i]==null?"":pictureurlList[i];
                        infoList[start+i].pictureurl = pictureurl;
                        //infoList[i].pictureurl = 'http://img5.mtime.cn/mg/2019/04/28/143651.43848115_120X90X4.jpg';
                    }
                    this.setState({infoList:infoList,pictureList:pictureList,showProgress:false})
                }
            }
            setTimeout(()=>{
                this.setState({showProgress:false})
            },1000)

        }).catch((err) => {
            alert(err);
            setTimeout(()=>{
                this.setState({showProgress:false})
            },1000)
        });
    }

    _endReached() {
            this.state.start += this.state.arrlong;
            if (this.state.arrlong === this.state.limit)
                this.getPriceOptionList();
    }

    renderRow(rowData,rowId,sectionId) {
        let commodityId = rowData.commodityId;

        if (commodityId === undefined) {
            var row = (
                <View/>
            )
        } else {
            var descripcion = rowData.descripcion;
            var imageUrl=head+rowData.pictureurl;
            if(descripcion!=null && descripcion!='')descripcion = descripcion.toUpperCase();

            //var pictureurl = rowData.pictureurl;
            //if(pictureurl==null)this.getPictureByAttachId(rowId,rowData.imageattachid)

            var row = (
                    <View style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        borderBottomWidth: 1,
                        borderColor: '#eee',
                        paddingLeft: 6,
                    }}>
                        <TouchableOpacity
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center', justifyContent: 'space-between',
                            }}
                            onPress={() => {
                                this.navigatorToCoomodityInfo(rowData.priceId);
                            }}
                        >
                            <View style={{flex: 1}}>
                                <View style={{paddingTop: 5}}>
                                    <Text style={styles.renderText}>名称: {descripcion}</Text>
                                </View>
                                <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                    <Text style={styles.renderText}>条码: {rowData.codigo}</Text>
                                </View>
                                <View style={{paddingTop: 5, flexDirection: 'row'}}>
                                    <Text style={styles.renderText}>价格: {rowData.price}</Text>
                                </View>
                            </View>
                            {
                                rowData.pictureurl !== null ?
                                    <Image style={{width: 110, height: 110}} source={{uri: imageUrl}}/>
                                    :
                                    <View>
                                    </View>
                            }
                        </TouchableOpacity>
                    </View>
                )
            ;
        }
        return row;
    }

    componentDidMount() {
        this.getPriceOptionList();
    }

    render() {
        var listView = null;
        let ventasInfo = this.props.ventasInfo;
        var infoList = this.state.infoList;
        if (infoList !== undefined && infoList !== null && infoList.length>0) {
            var data = infoList;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            listView =
                <ListView
                    automaticallyAdjustContentInsets={false}
                    dataSource={ds.cloneWithRows(data)}
                    renderRow={this.renderRow.bind(this)}
                    onEndReachedThreshold={20}
                    onEndReached={() => this._endReached()}
                />
        }
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

                <View style={{borderBottomWidth: 1, paddingLeft: 10,borderColor:'#eee'}}>
                        <Text style={{color:'#949494',fontSize:setSpText(16),textAlign: 'center',paddingVertical:5}}>
                            {ventasInfo.nickName} 商家登记商品及价格</Text>
                </View>
                <View style={{flex: 1,paddingBottom:10}}>
                    {listView}
                </View>

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


module.exports = connect(state => ({
        username: state.user.username,
        sessionId: state.user.sessionId,
        attachIdList:state.imageattach.attachIdList,
        pictureUrl:state.imageattach.pictureUrl,
        merchantId:state.user.supnuevoMerchantId,
    })
)(CompanyInfo);
