/**
 * Created by danding on 16/11/13.
 */

import React from 'react';

var {
    Component
} = React;

import {
    Image,
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableHighlight,
    ActivityIndicator,
    TabBarIOS,
    Dimensions,
    Button,
    ScrollView,
    Alert,
    Modal,
    TouchableOpacity
} from 'react-native';


import {connect} from 'react-redux';

var {height, width} = Dimensions.get('window');

var Platform = require('Platform');
import {loginAction, setTimerAction} from '../action/actionCreator';
import WaitTip from '../components/modal/WaitTip';

var proxy = require('../proxy/Proxy');
import PreferenceStore from '../utils/PreferenceStore';

var thiz = null;

import {setSpText,scaleSize} from '../utils/ScreenUtil'

var Login = React.createClass({

    onLoginPressed: function () {
        var user = this.state.user;
        var username = user.username;
        var password = user.password;
        if (username !== undefined && username !== null && username != '') {
            if (password !== undefined && password !== null && password != '') {
                //this.setState({showProgress: true});
                const {dispatch} = this.props;
                if (Platform.OS === 'android') {
                    this.timer = setInterval(
                        function () {
                            var loginDot = this.state.loginDot;
                            if (loginDot == '......')
                                loginDot = '.';
                            else
                                loginDot += '.';

                            this.setState({loginDot: loginDot});
                        }.bind(this), 600);
                    this.refs.waitTip.open();
                    this.timer = setTimeout(() => {
                        this.refs.waitTip.close();
                    }, 8000);
                    dispatch(loginAction(username, password))
                }

                else {
                   /* this.setState({animating: true, querenstate: true});
                    setTimeout(() => {
                        this.setState({animating: false, querenstate: false})
                    }, 10000);*/
                    this.refs.waitTip.open();
                    this.timer = setTimeout(() => {
                        this.refs.waitTip.close();
                    }, 8000);
                    dispatch(loginAction(username, password))
                }
            } else {
                Alert.alert(
                    '错误',
                    '请填写密码后再点击登录',
                    [
                        {
                            text: 'OK', onPress: () => {
                        }
                        },
                    ]
                );
            }
        } else {
            Alert.alert(
                '错误',
                '请填写用户名后再点击登录',
                [
                    {
                        text: 'OK', onPress: () => {
                    }
                    }
                ]
            );
        }
    },
    //
    componentWillUnmount() {
        // 请注意Un"m"ount的m是小写

        // 如果存在this.timer，则使用clearTimeout清空。
        // 如果你使用多个timer，那么用多个变量，或者用个数组来保存引用，然后逐个clear
        clearTimeout(this.timer);
    },


    closeProgress() {
        this.setState({animating: false, querenstate: false});
    },

    getInitialState: function () {
        return ({
            user: {},
            querenstate: false,
            modalVisible: false,
            showProgress: false,
            loginDot: '.',
            animating: false,
        });
    },


    render: function () {

        const shadowOpt = {
            width: width - 20,
            height: 200,
            color: "#000",
            border: 2,
            radius: 3,
            opacity: 0.2,
            x: 0,
            y: 1.5,
            style: {marginVertical: 5}
        };
        if (Platform.OS === 'android') {
            return (
                <View style={[styles.container]}>

                    <View style={[{
                        backgroundColor: '#387ef5',
                        padding: 10,
                        justifyContent: 'center',
                        flexDirection: 'row'
                    }]}>
                        <Text style={{color: '#fff', fontSize: setSpText(22)}}>supnuevo(6.0)</Text>
                    </View>

                    <View style={{justifyContent: 'center', flexDirection: 'row', padding: 10, marginTop: 10}}>

                        <View style={{
                            position: "relative",
                            width: width - 20,
                            height: 200,
                            backgroundColor: "#fff",
                            borderRadius: 3,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            padding: 15,
                            overflow: "hidden"
                        }}>
                            <Image style={styles.logo} source={require('../img/cart.png')}/>
                        </View>

                    </View>

                    <View style={{padding: 10, paddingTop: 2}}>
                        {/*输入用户名*/}
                        <View style={[styles.row, {borderBottomWidth: 0}]}>

                            <View style={{flex: 1, borderWidth: 1, borderColor: '#ddd', flexDirection: 'row'}}>

                                <View style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: 16,
                                    paddingLeft: 20,
                                    paddingRight: 15,
                                    marginLeft: 10
                                }}>
                                    <Text style={{fontSize: setSpText(16), color: '#444'}}>用户名</Text>
                                </View>


                                <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                    <TextInput
                                        style={{
                                            height: 46,
                                            flex: 1,
                                            paddingLeft: 20,
                                            paddingRight: 10,
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            fontSize: setSpText(16)
                                        }}
                                        onChangeText={(username) => {

                                            this.state.user.username = username;
                                            this.setState({user: this.state.user});
                                        }}
                                        value={this.state.user.username}
                                        placeholder='在此输入用户名'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>
                        </View>


                        {/*输入密码*/}
                        <View style={[styles.row, {borderBottomWidth: 0, borderTopWidth: 0}]}>

                            <View style={{flex: 1, borderWidth: 1, borderColor: '#ddd', flexDirection: 'row'}}>

                                <View style={{
                                    flex: 2,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    padding: 16,
                                    paddingLeft: 20,
                                    paddingRight: 15,
                                    marginLeft: 10
                                }}>
                                    <Text style={{fontSize: setSpText(16), color: '#444'}}>密码</Text>
                                </View>


                                <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                    <TextInput
                                        style={{
                                            height: 46,
                                            flex: 1,
                                            paddingLeft: 20,
                                            paddingRight: 10,
                                            paddingTop: 2,
                                            paddingBottom: 2,
                                            fontSize: setSpText(16)
                                        }}
                                        onChangeText={(password) => {
                                            this.state.user.password = password;
                                            this.setState({user: this.state.user});
                                        }}
                                        secureTextEntry={true}
                                        value={this.state.user.password}
                                        placeholder='在此输入密码'
                                        placeholderTextColor="#aaa"
                                        underlineColorAndroid="transparent"
                                    />
                                </View>
                            </View>
                        </View>

                        {/*登录*/}
                        <View style={[styles.row, {borderBottomWidth: 0, marginTop: 20}]}>

                            <TouchableOpacity style={{
                                flex: 1, backgroundColor: '#387ef5', padding: 12, borderRadius: 6, flexDirection: 'row',
                                justifyContent: 'center'
                            }} onPress={() => {
                                this.onLoginPressed()
                            }}>
                                <Text style={{color: '#fff', fontSize: setSpText(16)}}>登录</Text>
                            </TouchableOpacity>
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
                                    <Text style={{color: '#fff', fontSize: setSpText(16), alignItems: 'center'}}>
                                        登录中
                                    </Text>
                                    <Text style={{color: '#fff', fontSize: setSpText(18), alignItems: 'center'}}>
                                        {this.state.loginDot}
                                    </Text>
                                </View>
                            </View>
                        </Modal>
                        <WaitTip
                            ref="waitTip"
                            tipsName="登录中..."
                        />

                    </View>

                </View>
            );
        } else {
            return (
                <ScrollView>
                    <View style={[styles.container, {height: 800}]}>

                        <View style={[{
                            backgroundColor: '#387ef5',
                            padding: 10,
                            justifyContent: 'center',
                            flexDirection: 'row',
                            paddingTop:40
                        }]}>
                            <Text style={{color: '#fff', fontSize: setSpText(22)}}>supnuevo(5.2)</Text>
                        </View>

                        <View style={{justifyContent: 'center', flexDirection: 'row', padding: 10, marginTop: 10}}>

                            <View style={{
                                position: "relative",
                                width: width - 20,
                                height: 200,
                                backgroundColor: "#fff",
                                borderRadius: 3,
                                justifyContent: 'center',
                                flexDirection: 'row',
                                padding: 15,
                                overflow: "hidden"
                            }}>
                                <Image style={styles.logo} source={require('../img/cart.png')}/>
                            </View>

                        </View>

                        <View style={{padding: 10, paddingTop: 2}}>
                            {/*输入用户名*/}
                            <View style={[styles.row, {borderBottomWidth: 0}]}>

                                <View style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{
                                        flex: 2,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 16,
                                        paddingLeft: 20,
                                        paddingRight: 15,
                                        marginLeft: 10,

                                    }}>
                                        <Text style={{fontSize: setSpText(16), color: '#444'}}>用户名</Text>
                                    </View>


                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 20,
                                                paddingRight: 10,
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                                fontSize: setSpText(16)
                                            }}
                                            onChangeText={(username) => {

                                                this.state.user.username = username;
                                                this.setState({user: this.state.user});
                                            }}
                                            value={this.state.user.username}
                                            placeholder='在此输入用户名'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                            </View>


                            {/*输入密码*/}
                            <View style={[styles.row, {borderBottomWidth: 0, borderTopWidth: 0}]}>

                                <View style={{
                                    flex: 1,
                                    borderWidth: 1,
                                    borderColor: '#ddd',
                                    borderRadius: 6,
                                    flexDirection: 'row'
                                }}>

                                    <View style={{
                                        flex: 2,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                        padding: 16,
                                        paddingLeft: 20,
                                        paddingRight: 15,
                                        marginLeft: 10,

                                    }}>
                                        <Text style={{fontSize: setSpText(16), color: '#444'}}>密码</Text>
                                    </View>


                                    <View style={{flex: 6, flexDirection: 'row', alignItems: 'center'}}>
                                        <TextInput
                                            style={{
                                                height: 46,
                                                flex: 1,
                                                paddingLeft: 20,
                                                paddingRight: 10,
                                                paddingTop: 2,
                                                paddingBottom: 2,
                                                fontSize: setSpText(16)
                                            }}
                                            onChangeText={(password) => {
                                                this.state.user.password = password;
                                                this.setState({user: this.state.user});
                                            }}
                                            secureTextEntry={true}
                                            value={this.state.user.password}
                                            placeholder='在此输入密码'
                                            placeholderTextColor="#aaa"
                                            underlineColorAndroid="transparent"
                                        />
                                    </View>
                                </View>
                            </View>

                            {/*登录*/}
                            <View style={[styles.row, {borderBottomWidth: 0, marginTop: 20}]}>

                                <TouchableOpacity style={{
                                    flex: 1,
                                    backgroundColor: '#387ef5',
                                    padding: 12,
                                    borderRadius: 6,
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                                                  disabled={this.state.querenstate}
                                                  onPress={() => {
                                                      this.onLoginPressed()
                                                  }}>
                                    <Text style={{color: '#fff', fontSize:setSpText(20)}}>登录</Text>
                                </TouchableOpacity>
                            </View>
                            <WaitTip
                                ref="waitTip"
                                tipsName="登录中..."
                            />
                            <View style={[styles.modalContainerIOS]}>
                                <ActivityIndicator
                                    animating={this.state.animating}
                                    color={'#000000'}
                                    size="large"
                                >
                                </ActivityIndicator>
                            </View>
                        </View>
                        {/*IOS端的<Modal>标签无法关闭*/}
                    </View>
                </ScrollView>
            );
        }

    },

    componentDidMount() {

        //fetch username and password
        var username = null;
        var password = null;
        PreferenceStore.get('username').then((val) => {
            username = val;
            return PreferenceStore.get('password');
        }).then((val) => {
            password = val;
            if (username !== undefined && username !== null && username != ''
                && password !== undefined && password !== null && password != '') {
                //TODO:auto-login
                this.setState({
                    user: {
                        username: username,
                        password: password
                    }
                })

            }
        })


    },
});


export default connect(
    (state) => ({
        auth: state.user.auth,

    })
)(Login);


var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
    },
    modalContainerIOS: {
        justifyContent: 'center',
        padding: 8,
    },
    loader: {
        marginTop: 10,

    },
    modalBackgroundStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    logo: {
        width: width / 2,
        height: 170
    },
    heading: {
        fontSize: setSpText(18),
        marginTop: 10
    },
    input: {
        width: 240,
        justifyContent: 'center',
        height: 42,
        marginTop: 10,
        padding: 4,
        fontSize: setSpText(18),
        borderWidth: 1,
        borderColor: '#48bbec',
        color: '#48bbec',
        borderBottomWidth: 0
    },
    title: {
        fontSize: setSpText(18),

    },
    button: {
        marginRight: 10
    },
    buttonText: {
        fontSize: setSpText(18),
        color: 'white',
        alignSelf: 'center'
    },

    error: {
        color: 'red',
        paddingTop: 10,
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#222'
    }

});
