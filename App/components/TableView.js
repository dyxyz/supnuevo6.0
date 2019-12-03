import React from 'react';
import {View, Image, StyleSheet, TextInput, ViewPropTypes, Text, TouchableOpacity,Dimensions} from 'react-native';
import PropTypes from 'prop-types';
var {height, width} = Dimensions.get('window');

export default class TableView extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    headerList: PropTypes.array,
    dataList: PropTypes.array,
    renderAux: PropTypes.func || null,
    totalAmount:PropTypes.string,
    totalFee:PropTypes.string,
    discountFee:PropTypes.string,
    totalFeeFinal:PropTypes.string,
  };

  render() {

    const {title, headerList, dataList,totalAmount,totalFee,discountFee,totalFeeFinal} = this.props;

    return (
        <View style={styles.container}>
          {this._renderTitle(title)}
          {this._renderHeader(headerList)}
          {this._renderInfoList(dataList)}
          {this._renderFooter(totalAmount,totalFee,discountFee,totalFeeFinal)}
          {this.props.renderAux?this.props.renderAux():null}
        </View>
    );
  }

  _renderTitle(title){
    return (
        title !== null?
        <View style={styles.titleWrapperStyle}>
        <Text style={styles.titleStyle}>{title}</Text>
        </View>:null
    );
  }

  _renderHeader(headerList){
    var headerItemList = [];
    headerList.map((headerItem,i)=>{
      headerItemList.push(
          <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{headerItem}</Text></View>
      )
    });
    return(
      <View style={styles.tableWrapperStyle}>{headerItemList}</View>
    );
  }

  _renderInfoList(dataList){
    if(!dataList || dataList.length<=0) return;
    var dataListView = [];
    dataList.map((dataListItem,i)=>{
      const dataRow = dataListItem;
      var dataRowList = [];
      if(dataRow && dataRow.length>0){
        dataRow.map((dataRowItem,i)=>{
          dataRowList.push(
            <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRowItem}</Text></View>
          );
        });
        dataListView.push(
            <View style={styles.tableWrapperStyle}>{dataRowList}</View>
        );}});

    return dataListView;
  }

    _renderFooter(totalAmount,totalFee,discountFee,totalFeeFinal){
        return(
            <View>
              <View style={{justifyContent:"center",alignItems:"center",borderBottomWidth:1,height:height*0.04}}>
                <Text style={styles.titleStyle}>账单小结</Text>
              </View>
              <View style={{flexDirection:"row",marginTop:5}}>
                <View style={{marginLeft:10}}><Text>商品总数：{totalAmount}</Text></View>
                <View style={{position:"absolute",right:10}}><Text>优惠前总价：{totalFee}</Text></View>
              </View>
              <View style={{flexDirection:"row",marginTop:10,marginBottom:5}}>
                <View style={{marginLeft:10}}><Text>优惠金额：{discountFee}</Text></View>
                <View style={{position:"absolute",right:10}}><Text>应付款：{totalFeeFinal}</Text></View>
              </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  titleWrapperStyle:{
    height:40,
    width:"100%",
    justifyContent: "center",
    alignItems: "center"
  },
  titleStyle:{
    fontSize:16,
  },
  tableWrapperStyle:{
    height:45,
    width:"100%",
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    paddingHorizontal:10,
    borderBottomWidth:1,
    borderColor:'#888'
  },
  tableItemStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:10
  },
  headerItemTextStyle:{
    fontSize:14,
    color:'#333'
  },
  dataItemTextStyle:{
    fontSize:14,
    color:'#888'
  },
});
