
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
import {setSpText} from '../../../utils/ScreenUtil'
const Dimensions = require('Dimensions');
const {height, width} = Dimensions.get('window');
import Icon from 'react-native-vector-icons/FontAwesome';
import OrderDiscount from './OrderDiscount';
import CommodityDiscount from './CommodityDiscount';
import AllCommodityDiscount from "./CommodityDiscoutList.js"

class PricePromotion extends Component {
    cancel() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
        }
    }

    navigateToOrderDiscount(){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'OrderDiscount',
                component: OrderDiscount,
                params: {
                }
            })
        }
    }

    navigateToCommodityDiscoutList(){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'AllCommodityDiscount',
                component: AllCommodityDiscount,
                params: {
                }
            })
        }
    }

    navigateToCommodityDiscount(){
        const {navigator} = this.props;
        if (navigator) {
            navigator.push({
                name: 'CommodityDiscount',
                component: CommodityDiscount,
                params: {
                }
            })
        }
    }

    render() {
        return (
            <ScrollView>
                <View style={{flex: 1}}>
                    {/*header*/}
                    <View style={[{backgroundColor:'#387ef5',padding:4,paddingTop:Platform.OS=='ios'?40:15,justifyContent: 'center',alignItems: 'center',flexDirection:'row'},styles.card]}>
                        <View style={{flex:1,paddingLeft:10}}>
                            <TouchableOpacity
                                style={{flexDirection:'row',height:40,paddingTop:5}}
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

                    <View style={{height: height*0.8}}>
                        <View style={{flex: 2}}>
                            <TouchableOpacity style={[{borderTopWidth: 1}, styles.touch]}
                                              onPress={() => {this.navigateToCommodityDiscount()}}>
                                <Text style={styles.text}>免量折扣</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.touch}
                                              onPress={() => {this.navigateToOrderDiscount()}}>
                                <Text style={styles.text}>总量百分比折扣</Text>
                            </TouchableOpacity>
                            {/*<TouchableOpacity style={styles.touch}*/}
                                              {/*onPress={() => {}}>*/}
                                {/*<Text style={styles.text}>积分</Text>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity style={styles.touch}*/}
                                              {/*onPress={() => {}}>*/}
                                {/*<Text style={styles.text}>折扣券</Text>*/}
                            {/*</TouchableOpacity>*/}
                            {/*<TouchableOpacity style={styles.touch}*/}
                                              {/*onPress={() => {}}>*/}
                                {/*<Text style={styles.text}>本次折扣纵览</Text>*/}
                            {/*</TouchableOpacity>*/}

                            {/*<View style={{flex: 1}}/>*/}
                        </View>
                    </View>
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
        // flex: 1,
        marginRight: 10,
        marginLeft: 10,
        borderBottomWidth: 1,
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: '#DEDEDE',
        height:height*0.15,
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
        merchantId: state.user.supnuevoMerchantId,
        username: state.user.username,
        supnuevoMerchantId: state.user.supnuevoMerchantId,
        sessionId: state.user.sessionId,
    })
)(PricePromotion);

