
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
    TouchableOpacity,
    ListView,
    Platform
} from 'react-native';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
var Dimensions = require('Dimensions');
var {height, width} = Dimensions.get('window');
import {MicrosoftMap} from "../../../components/rnMap/index";
import Config from "../../../../config";
import {setSpText} from '../../../utils/ScreenUtil'
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
var proxy = require('../../../proxy/Proxy');

class MemberList extends Component {

    goBack() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            memberList:[],
            edgeList:[],
        };
    }

    componentDidMount(): void {
        this.getMemberList();
    }

    render() {

        const {edgeList,memberList } = this.state;

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
                    <View style={{flex:1,marginRight:10,flexDirection:'row',justifyContent:'center'}}>
                    </View>
                </View>
                {/* body */}
                <View style={{flex:1}}>
                    <MicrosoftMap edges={edgeList} merchants={memberList}/>
                    <View style={styles.listViewWrapper}>
                        <ListView
                            style={styles.listView}
                            automaticallyAdjustContentInsets={false}
                            dataSource={ds.cloneWithRows(memberList)}
                            enableEmptySections={true}
                            renderRow={this.renderRow.bind(this)}/>

                    </View>
                </View>
            </View>
        )
    }

    renderRow(rowData) {
        var imageUri="https://supnuevo.s3.sa-east-1.amazonaws.com/"+rowData.urlAddress
        var row =
            <TouchableOpacity onPress={() => {}}>
                <View style={{flexDirection:"row",height:height*0.2,width:width}}>
                    <View style={{flex:2,alignItems:"center",justifyContent:"center"}}>
                        {
                            rowData.urlAddress==null?
                                <Icon name="photo" size={90} color='rgb(112, 112, 112)'/>
                                :
                                <Image source={{uri:imageUri}} resizeMode={"contain"} style={styles.image}/>
                        }

                    </View>
                    <View style={{
                        flex: 5, padding: 10, borderBottomWidth: 1, borderColor: '#ddd',
                        justifyContent: 'center', backgroundColor: '#fff'
                    }}>

                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>商户名：{rowData.nickName}</Text>
                        </View>
                        <View style={{paddingTop: 5, flexDirection: 'row'}}>
                            <Text style={styles.renderText}>商户地址：{rowData.direccion}</Text>
                        </View>
                        {/*<View style={{paddingTop: 5, flexDirection: 'row'}}>*/}
                            {/*<Text style={styles.renderText}>公司名：{rowData.nubre}</Text>*/}
                        {/*</View>*/}
                        {/*<View style={{paddingTop: 5, flexDirection: 'row'}}>*/}
                            {/*<Text style={styles.renderText}>uri：{imageUri}</Text>*/}
                        {/*</View>*/}
                    </View>
                </View>
            </TouchableOpacity>;
        return row;
    };

    getMemberList(){
        proxy.postes({
            url: Config.server + "/func/union/getSupnuevoBuyerUnionMemberFormList",
            headers: {
                'Content-Type': 'application/json',
            },
            body: {
                unionId: this.props.unionId,
            }
        }).then((json)=> {
            if(json.re == 1){
                this.setState({memberList:json.data})
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
    image:{
        width: 100,
        height: 100,
    },
    popoverText: {
        fontSize: 16
    },
    listViewWrapper:{
        width:width,
        height:height/3,
    },
    listView:{
        flex:1,
    },
    listItemStyle:{
        flex:1,
        borderBottomWidth: 0.8,
        borderColor: "#eee",
    },
    renderText: {
        fontSize: setSpText(18),
        alignItems: 'center'
    },
});


module.exports = connect(state => ({
        unionId: state.user.unionId,
        username: state.user.username,
    })
)(MemberList);

