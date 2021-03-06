import React from 'react';
import {
    AppState,
    Modal,
    NetInfo,
    View,
    StyleSheet,
    Text,
    TabBarIOS,
    BackAndroid,
    Platform,
    ToastAndroid,
    Vibration
} from 'react-native';
import {Navigator} from 'react-native-deprecated-custom-components';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome.js';

var proxy = require('../proxy/Proxy');
import Config from "../../config";

import ScrollableTabView, {DefaultTabBar, ScrollableTabBar} from 'react-native-scrollable-tab-view';
import TabNavigator from 'react-native-tab-navigator';

import Login from '../containers/Login';
import Query from '../containers/Query';

import Announcement from '../containers/Announcement';
import Advertisement from '../containers/Advertisement';

import Sale from '../containers/Sale/Sale';
import Stock from './Stock/Stock.js';
import My from './My/My';


import {getSession, setNetInfo,loginAction} from '../action/actionCreator';
import {setSpText} from '../utils/ScreenUtil'
const tabBarTintColor = '#f8f8f8';// 标签栏的背景颜色
const tabTintColor = '#3393F2'; // 被选中图标颜色

class App extends React.Component {

    constructor(props) {
        super(props);
        const {dispatch} = this.props;
        this.state = {
            tab: '进货',
            selectedTab: '进货',
            isConnected: null,
            number:0,
            oldNumber:0
        }
    }

    componentDidMount(){
        NetInfo.addEventListener(
            'change',
            this._handleConnectionInfoChange.bind(this)
        );
        if (Platform.OS === 'android') {
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }

        this.getOrderListOfDate(null,0);
        this.getOrderRobList();



    }

    componentDidUpdate(){
        clearInterval(this.timer);
        console.log(this.props.auth)
        let auth = this.props.auth;
        if (auth == true) {
            if(this.props.unionId){
                // this.startTImer();
            }
            console.log(this.props.unionId)
        }

    }

    startTImer(){

            this.timer=setInterval(()=>{
                this.setState({oldNumber:this.state.number})
                this.setState({number:0})
                this.getOrderListOfDate(null,0);
                this.getOrderRobList();
            },10000);



    }

    getOrderRobList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfUnionCanGrab",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            console.log(json)
            if(json.re === 1){
                var data = json.data;
                this.setState({number:this.state.number+data.length})
                if(this.state.number>this.state.oldNumber){
                    Vibration.vibrate(4000, false)
                }
            }
        }).catch((err)=>{alert(err);});
    }

    getOrderListOfDate(orderDate,orderState){
        var merchantId=null
        if(!this.props.root){
            merchantId=this.props.merchantId
        }
        console.log(this.props.root)
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoCustomerOrderListOfDateByUnion",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                orderDate: orderDate,
                unionId: this.props.unionId,
                orderState:orderState,
                merchantId:merchantId,
            }
        }).then((json)=> {
            if(json.re == -2){
                this.props.dispatch(loginAction(username, password))
            }
            console.log(json)
            if(json.re === 1){
                var data = json.data;
                this.setState({number:this.state.number+data.length})
                if(this.state.number>this.state.oldNumber){
                    Vibration.vibrate(4000, false)
                }
            }
        }).catch((err)=>{alert(err);});
    }

    _createNavigatorItem(route, icon) {

        var component = Announcement;
        switch (route) {
            case '公告':
                component = Announcement
                break;
            case '改价':
                component = Query;
                break;
            case '收银':
                component = Sale;
                break;
            case '进货':
                component = Stock;
                break;
            case '我的':
                component = My;
                break;
            // case '广告':
            //     component=Advertisement;
            //     break;
            default:
                break;
        }
        if(route=='我的'){
            return(
                <TabNavigator.Item
                    selected={this.state.selectedTab === route}
                    title={route}
                    titleStyle={{color: '#C6C5CA', fontSize: setSpText(13)}}
                    renderIcon={() => <Icon name={icon} size={setSpText(20)}/>}
                    renderSelectedIcon={() => <Icon name={icon} size={setSpText(20)} color='#387ef5'/>}
                    badgeText={this.state.number}
                    onPress={() => {
                        this.setState({selectedTab: route});
                    }}
                    tabStyle={{backgroundColor: 'transparent',}}
                    onSelectedStyle={{backgroundColor: '#eeecf3',}}
                >
                    <View style={{flex: 1,height:42}}>
                        <Navigator
                            ref="navigator"
                            initialRoute={{name: route, component: component}}
                            configureScene={(route) => {
                                return ({
                                    ...Navigator.SceneConfigs.PushFromRight,
                                    gestures: null
                                });
                            }}
                            renderScene={(route, navigator) => {
                                let Component = route.component;
                                //this.props.dispatch(updateNavigator({route:route.name,navigator:navigator}))
                                return (<Component {...route.params} navigator={navigator}/>);

                            }}

                        />


                    </View>
                </TabNavigator.Item>
            )
        }
        else{
            return (

                <TabNavigator.Item
                    selected={this.state.selectedTab === route}
                    title={route}
                    titleStyle={{color: '#C6C5CA', fontSize: setSpText(13)}}
                    renderIcon={() => <Icon name={icon} size={setSpText(20)}/>}
                    renderSelectedIcon={() => <Icon name={icon} size={setSpText(20)} color='#387ef5'/>}
                    onPress={() => {
                        this.setState({selectedTab: route});
                    }}
                    tabStyle={{backgroundColor: 'transparent',}}
                    onSelectedStyle={{backgroundColor: '#eeecf3',}}
                >
                    <View style={{flex: 1,height:42}}>
                        <Navigator
                            ref="navigator"
                            initialRoute={{name: route, component: component}}
                            configureScene={(route) => {
                                return ({
                                    ...Navigator.SceneConfigs.PushFromRight,
                                    gestures: null
                                });
                            }}
                            renderScene={(route, navigator) => {
                                let Component = route.component;
                                //this.props.dispatch(updateNavigator({route:route.name,navigator:navigator}))
                                return (<Component {...route.params} navigator={navigator}/>);

                            }}

                        />


                    </View>
                </TabNavigator.Item>
            );
        }


    }

    render() {
        let auth = this.props.auth;
        if (auth == true) {

            var defaultStyle = {
                backgroundColor: '#eeecf3',
                paddingBottom: 5,
                paddingTop: 5,
                height: 70
            }

            var defaultSceneStyle = {}

            // if(tab.hidden==true)
            // {
            //     defaultStyle.height=0
            //     defaultStyle.paddingBottom=0
            //     defaultStyle.paddingTop=0
            //     defaultSceneStyle.paddingBottom=0
            // }

            return (

                <TabNavigator tabBarStyle={defaultStyle} sceneStyle={defaultSceneStyle}>
                    {/*{this._createNavigatorItem('广告','home')}*/}
                    {this._createNavigatorItem('改价', 'edit')}
                    {this._createNavigatorItem('收银', 'search')}
                    {this._createNavigatorItem('进货', 'tag')}
                    {this._createNavigatorItem('我的', 'user-o')}
                    {this._createNavigatorItem('公告', 'home')}
                </TabNavigator>

                // <Navigator
                //     initialRoute={{ name: 'query', component:Query }}
                //     configureScene={(route) => {
                //         return Navigator.SceneConfigs.HorizontalSwipeJumpFromRight;
                //       }}
                //     renderScene={(route, navigator) => {
                //         let Component = route.component;
                //         this.navigator=navigator;
                //         return <Component {...route.params} navigator={navigator} />
                //       }} />

            );
        }
        else {
            return (<Login/>);
        }
    }

    componentWillMount() {

    }



    _handleConnectionInfoChange(connectionInfo) {
        const connectionInfoHistory = this.props.connectionInfoHistory.slice();
        connectionInfoHistory.push(connectionInfo);
        const {dispatch} = this.props;
        dispatch(setNetInfo(connectionInfoHistory));

    }

    componentWillUnmount() {

        NetInfo.removeEventListener(
            'change',
            this._handleConnectionInfoChange
        );

        if (Platform.OS === 'android') {
            BackAndroid.removeEventListener('hardwareBackPress', this.onBackAndroid.bind(this));
        }
    }

    /*    onBackAndroid=()=>{
            var nav = this.navigator;
            const routers = nav.getCurrentRoutes();
            var route=routers[routers.length-1];
            if (routers.length ==1) {
                if(this.lastBackPressed&&this.lastBackPressed+4000>=Date.now())
                {
                    //BackAndroid.exitApp();
                    return false;
                }else{
                    this.lastBackPressed = Date.now();
                    ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
                    return true;
                }
            }else{
                //执行浏览历史的回退
                if(route.params.reset)
                    route.params.reset();
                nav.pop();
                return true;
            }

        };*/
    onBackAndroid = () => {
        const {dispatch} = this.props;
        //const {navigator} = this.props;
        if (this.props.auth == true) {
            let routers;
            if (this.refs.navigator !== undefined) {
                routers = this.refs.navigator.getCurrentRoutes();
                if (routers.length > 1) {
                    this.refs.navigator.pop();
                    return true;
                }
            } else {
                // dispatch(getSession(null));
                return false;
            }
        }

        if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
            //最近2秒内按过back键，可以退出应用。
            // dispatch(getSession(null));
            return false;
        }
        this.lastBackPressed = Date.now();
        ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
        return true;
    };
}

var styles = StyleSheet.create({
    heading: {
        fontSize: setSpText(30),
        marginTop: 10
    },
    container: {
        flex: 1,
        alignItems: 'center',
        marginTop: 60
    },
    text: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: setSpText(16),
        textAlign: 'center'
    },
    wrapper: {},
    slide1: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#97CAE5'
    },
    slide3: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#92BBD9'
    }
});


export default connect(
    (state) => ({
        root: state.user.root,
        unionId: state.user.unionId,
        merchantId: state.user.supnuevoMerchantId,
        auth: state.user.auth,
        connectionInfoHistory: state.netInfo.connectionInfoHistory,
    })
)(App);

