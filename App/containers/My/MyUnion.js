
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
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import Config from '../../../config';
import {setSpText} from '../../utils/ScreenUtil'
const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
const proxy = require('../../proxy/Proxy');
import Icon from 'react-native-vector-icons/FontAwesome';
import UnionList from "../Stock/UnionList";

class MyUnion extends Component {
    componentDidMount(): void {
        // 获取联盟价格种类表

        // this.getSupnuevoBuyerUnionPriceClassList();


    }

    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            priceClassList:this.props.priceClassList,
            selectedIdx:this.props.selectedIdx,
            showProgress:false
        }

    }


    navigatorUnionList() {
        var UnionList = require('../Stock/UnionList');
        this.props.navigator.push({
            name: 'UnionList',
            component: UnionList,
            params: {}
        })
    }

    navigateUnionRule() {
        var unionRule = require('./union/UnionRule');
        this.props.navigator.push({
            name: 'unionRule',
            component: unionRule,
            params: {}
        })
    }

    navigateCommodityCategory() {
        let _this = this;
        var commodityCategory = require('./union/CommodityCategory');
        // this.getSupnuevoBuyerUnionPriceClassList();
        this.props.navigator.push({
            name: 'commodityCategory',
            component: commodityCategory,
            params: {
                // getUser: function(priceClassList) {
                //     _this.setState({
                //         priceClassList: priceClassList
                //     })
                // },
                // priceClassList:this.state.priceClassList,
                // selectedIdx:this.state.selectedIdx,
            }
        })
    }

    navigateCommodityPrice() {
        var commodityPrice = require('./union/CommodityPrice');
        this.props.navigator.push({
            name: 'commodityPrice',
            component: commodityPrice,
            params: {}
        })
    }

    navigatePricePromotion() {
        var pricePromotion = require('./union/PricePromotion');
        this.props.navigator.push({
            name: 'pricePromotion',
            component: pricePromotion,
            params: {}
        })
    }

    navigatePricePublicity() {
        var pricePublicity = require('./union/PricePublicity');
        this.props.navigator.push({
            name: 'pricePublicity',
            component: pricePublicity,
            params: {}
        })
    }

    navigateMemberList() {
        var memberList = require('./union/MemberList');
        this.props.navigator.push({
            name: 'memberList',
            component: memberList,
            params: {}
        })
    }

    navigateUnionOrder() {
        var unionOrder = require('./union/UnionOrder');
        this.props.navigator.push({
            name: 'unionOrder',
            component: unionOrder,
            params: {}
        })
    }

    navigateLackCommodity() {
        var LackCommodity = require('./union/LackCommodity');
        this.props.navigator.push({
            name: 'LackCommodity',
            component: LackCommodity,
            params: {}
        })
    }
    navigateAuditCustomer() {
        var auditCustomer = require('./union/AuditCustomer');
        this.props.navigator.push({
            name: 'auditCustomer',
            component: auditCustomer,
            params: {}
        })
    }

    navigateIncompleteCommodity() {
        var IncompleteCommodity = require('./union/IncompleteCommodity');
        this.props.navigator.push({
            name: 'IncompleteCommodity',
            component: IncompleteCommodity,
            params: {}
        })
    }

    navigateCodigoRelation() {
        var CodigoRelation = require('./union/CodigoRelation');
        this.props.navigator.push({
            name: 'CodigoRelation',
            component: CodigoRelation,
            params: {}
        })
    }

    navigateModifyTime() {
        var ModifyTime = require('./union/ModifyTime');
        this.props.navigator.push({
            name: 'ModifyTime',
            component: ModifyTime,
            params: {}
        })
    }





    updatePriceList(){
        this.setState({showProgress:true})
        proxy.postes({
            url: Config.server + "/func/union/updateSupnuevoBuyerUnionAllPriceInfo",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            console.log(json)
            this.setState({showProgress:false})
            if(json.re == 1){
                Alert.alert("更新成功")
            }


        }).catch((err)=>{alert(err);});
    }



    render() {
        // this.refs.modal.close();
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/*header*/}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1,paddingLeft:10}}>
                            <TouchableOpacity
                                style={{flexDirection:'row',height:40,paddingTop:3}}
                                onPress={
                                    ()=>{
                                        this.cancel();
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
                        <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                        </View>
                    </View>

                    <View style={{height: height - 140,}}>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={[{borderTopWidth: 1}, styles.touch]}
                                              onPress={() => {
                                                  this.navigateUnionRule();
                                              }}>
                                <Text style={styles.text}>本联盟规定</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigateCommodityCategory();
                                              }}>
                                <Text style={styles.text}>我们的商品种类</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigateCommodityPrice();
                                              }}>
                                <Text style={styles.text}>我们的商品价格</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigatePricePromotion();
                                              }}>
                                <Text style={styles.text}>我们的促销策略</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigatePricePublicity()
                                              }}>
                                <Text style={styles.text}>我们的促销宣传单</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigateMemberList()
                                              }}>
                                <Text style={styles.text}>我们的成员</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                   this.navigateUnionOrder()
                                              }}>
                                <Text style={styles.text}>我的超市联盟订单</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {
                                                  this.navigateLackCommodity()
                                              }}>
                                <Text style={styles.text}>缺货商品</Text>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={styles.touch}*/}
                                              {/*onPress={() => {*/}
                                                  {/*this.navigateAuditCustomer()*/}
                                              {/*}}>*/}
                                {/*<Text style={styles.text}>审核注册用户</Text>*/}
                            {/*</TouchableOpacity>*/}
                            {this.props.unionMemberType == 2?
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateIncompleteCommodity()
                                                  }}>
                                    <Text style={styles.text}>信息不完整商品</Text>

                                </TouchableOpacity>
                                :
                                null
                            }
                            {this.props.unionMemberType == 2?
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateCodigoRelation()
                                                  }}>
                                    <Text style={styles.text}>条码级联</Text>

                                </TouchableOpacity>
                                :
                                null
                            }
                            {this.props.root?
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.navigateModifyTime()
                                                  }}>
                                    <Text style={styles.text}>商品改价时间</Text>

                                </TouchableOpacity>
                                :
                                null
                            }
                            {this.props.unionMemberType == 2?
                                <TouchableOpacity style={styles.touch}
                                                  onPress={() => {
                                                      this.updatePriceList()
                                                  }}>
                                    <Text style={styles.text}>更新价格表</Text>

                                </TouchableOpacity>
                                :
                                null
                            }
                            {this.state.showProgress==true?
                                <View style={[styles.touch,{justifyContent:'center',borderBottomWidth:0}]}>
                                    <ActivityIndicator
                                        animating={this.state.showProgress}
                                        style={[{height: 80}]}
                                        size="large"
                                        color="red"
                                    />
                                    <View style={{flexDirection: 'row', justifyContent: 'center',alignItems:'center'}}>
                                        <Text style={{color: 'red', fontSize: 22, alignItems: 'center'}}>
                                            更新中...
                                        </Text>
                                    </View>
                                </View>
                                :
                                null
                            }


                            <View style={{flex: 1}}/>
                        </View>
                    </View>
                </View>
                {/*<Modal*/}
                    {/*animationType={"fade"}*/}
                    {/*transparent={true}*/}
                    {/*ref={"modal"}*/}
                    {/*visible={this.state.showProgress}*/}
                    {/*onRequestClose={() => {*/}
                        {/*this.setState({showProgress: false})*/}
                    {/*}}*/}
                {/*>*/}

                {/*</Modal>*/}
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
        unionId: state.user.unionId,
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        supnuevoMerchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
        unionMemberType:state.user.unionMemberType,
        root: state.user.root,
    })
)(MyUnion);

