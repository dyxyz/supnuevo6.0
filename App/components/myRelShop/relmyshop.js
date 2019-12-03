import React, {Component} from 'react';

import {
    StyleSheet,
    Image,
    Text,
    View,
    ListView,
    ScrollView,
    Alert,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import {setSpText} from '../../utils/ScreenUtil'
var {height, width} = Dimensions.get('window');


class relmyshop extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rowData: this.props.rowData,
        }
    }

    render() {
        let rowData = this.props.rowData;
        var state = 0;
        var detail_state = '';

        if(rowData.merchantDeleteMark==1){detail_state='对方已删除';}
        else {
            if (rowData.merchantAgreeMark == 0) {
                state = 0
                detail_state = '对方未联通'
            }
            else {
                if (rowData.priceMerchantAgreeMark == 0) {
                    state = 0
                    detail_state = '您未联通'
                }else{
                    //1100
                    state = 1
                    detail_state = ''
                }
            }
        }


        return (
            <View>
            <View style={{paddingRight: 10}}>
                {
                    state==1?
                    <Text style={{flex: 1, fontSize: setSpText(18) , color:'green'}}>已联通</Text>:
                    <Text style={{flex: 1, fontSize: setSpText(18) , color:'red'}}>未联通</Text>
                }
            <Text style={{flex: 1, fontSize: setSpText(14) , color:'#666', marginTop:5}}>{detail_state}</Text>
            </View>
            </View>
        );
    }
}


var styles = StyleSheet.create({});


module.exports = relmyshop;
