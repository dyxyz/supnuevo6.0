/**
 * Infomation.js
 * 显示信息栏
 * type = 1 表示文字信息
 * type = 2 表示头像信息
 */

import React from 'react';
import { TouchableOpacity, View, ViewPropTypes, Text, StyleSheet, Image, Dimensions} from 'react-native';
import PropTypes from 'prop-types';
var {height, width} = Dimensions.get('window');

const TYPE_TEXT = 1
const TYPE_AVATAR = 2

class InformationItem extends React.PureComponent {

  render() {
    const {title, content, type} = this.props;

    return (
        <View style={styles.containerStyle}>
          <View style={styles.titleWrapperStyle}>
            <Text style={styles.titleTextStyle}>{title}</Text>
          </View>
          <View style={styles.contentWrapperStyle}>
            {this._renderInformation(type, content)}
          </View>
        </View>
    );
  }

    _renderInformation = (type, content) => {
      switch (type) {
        case TYPE_TEXT: return (<Text style={styles.contentTextStyle}>{content}</Text>);
        case TYPE_AVATAR: return (<Image resizeMode="stretch" style={styles.avatarStyle} source={{uri: content}}/>);
        default: break;
      }
  }
};

var styles = StyleSheet.create({
  containerStyle:{
    flexDirection:'row',
    flex:1,
    width:width,
    paddingHorizontal:10,
    paddingVertical:5,
    borderBottomWidth:1,
    borderColor:'#eee'
  },
  titleWrapperStyle: {
    flex:1,
    flexDirection:'row',
    alignItems:'center'
  },
  contentWrapperStyle: {
    flex:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'flex-end',
    paddingVertical: 8,
  },
  titleTextStyle: {
    color:'#555',
    fontSize:14
  },
  contentTextStyle: {
    fontSize:14,
    color:'#222',
    justifyContent:'flex-end',
    textAlign:'right',
    flex:3
  },
  avatarStyle: {
    height: 40,
    width: 40,
    borderRadius: 20
  }
})

const informationItem ={
  get InformationItem() {return InformationItem},
  get TYPE_TEXT() {return TYPE_TEXT},
  get TYPE_AVATAR() {return TYPE_AVATAR},
}

module.exports = informationItem
