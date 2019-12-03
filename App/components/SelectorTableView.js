import React from 'react';
import {View, Image, StyleSheet, TextInput, ViewPropTypes, Text, TouchableOpacity, ScrollView,Alert} from 'react-native';
import PropTypes from 'prop-types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Config from "../../config";
var proxy = require('../proxy/Proxy');

var uncheckedIcon = <Ionicons name={"md-square-outline"} size={18}/>;
var checkedIcon = <Ionicons name={"md-checkbox-outline"} size={18}/>;

export default class TableView extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    headerList: PropTypes.array,
    // dataList: PropTypes.array,
    onItemSelected:PropTypes.func || null,
    renderAux: PropTypes.func || null,
  };

    // componentDidMount(): void {
    //     // 获取联盟价格种类表
    //     this.getSupnuevoBuyerUnionPriceClassList();
    // }

  constructor(props) {
    super(props);
    this.state = {
        selectedIdx:-1,
        dataList:this.props.dataList,
      // merchantCount:null,
    };
  }

  render() {

    const {title, headerList} = this.props;
    const {selectedIdx,dataList} = this.state;

    return (
        <ScrollView style={styles.container}>
          {this._renderTitle(title)}
          {this._renderHeader(headerList)}
          {this._renderInfoList(dataList, selectedIdx)}
          {this.props.renderAux?this.props.renderAux():null}
          {/*<Text>{dataList.count}</Text>*/}
        </ScrollView>
    );
  }

  _renderTitle(title){
    return (
        title !== null?
        <View style={styles.titleWrapperStyle}>
          <View>
            <Text style={styles.titleStyle}>{title}</Text>
          </View>
        </View>:null
    );
  }

  // _renderHeader(headerList){
  //   var headerItemList = [];
  //   headerList.map((headerItem,i)=>{
  //     headerItemList.push(<View style={styles.tableItemStyle}/>);
  //     headerItemList.push(
  //         <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{headerItem}</Text></View>
  //     )
  //   });
  //   return(
  //     <View style={styles.tableWrapperStyle}>{headerItemList}</View>
  //   );
  // }

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

    _renderInfoList(dataList, selectedIdx){
        if(dataList == null || dataList == undefined) return;
        var dataListView = [];
        dataList.map((dataListItem,i)=>{
            const dataRow = dataListItem;
            var dataRowList = [];
            if(dataRow){
                dataRowList.push(
                    <TouchableOpacity
                        // style={styles.tableItemStyle}
                        style={{flexDirection:"row"}}
                        onPress={()=>{
                            this.setState({selectedIdx:i});
                            this.setUnionCurrentMerchantCount(dataRow.priceCount);
                            this.props.onItemSelected(i)}}
                    >
                      <View style={styles.tableItemStyle}>{dataRow.select == 1?checkedIcon:uncheckedIcon}</View>
                      <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRow.priceCount}</Text></View>
                      <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRow.count}</Text></View>
                    </TouchableOpacity>
                )
                ;

                // dataRow.map((dataRowItem,i)=>{
                //     dataRowList.push(
                //         <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRowItem.count}{dataRowItem.priceCount}</Text></View>
                //     );
                // });
                dataListView.push(
                    <View style={styles.tableWrapperStyle}>{dataRowList}</View>
                );}});

        return dataListView;
    }

  // _renderInfoList(dataList, selectedIdx){
  //   if(!dataList || dataList.length<=0) return;
  //   var dataListView = [];
  //   dataList.map((dataListItem,i)=>{
  //     const dataRow = dataListItem;
  //     var dataRowList = [];
  //     if(dataRow && dataRow.length>0){
  //       dataRowList.push(
  //           <TouchableOpacity
  //               style={styles.tableItemStyle}
  //               onPress={()=>{
  //                 this.setState({selectedIdx:i,merchantCount:dataRow[1]});
  //                 this.setUnionCurrentMerchantCount();
  //                 this.props.onItemSelected(i)}}
  //           >{selectedIdx === i || dataRow[0]==1?checkedIcon:uncheckedIcon}</TouchableOpacity>);
  //
  //       dataRow.map((dataRowItem,i)=>{
  //         dataRowList.push(
  //           <View style={styles.tableItemStyle}><Text style={styles.headerItemTextStyle}>{dataRowItem}</Text></View>
  //         );
  //       });
  //       dataListView.push(
  //           <View style={styles.tableWrapperStyle}>{dataRowList}</View>
  //       );}});
  //
  //   return dataListView;
  // }

    // setUnionCurrentMerchantCount(merchantCount){
    //
    //     proxy.postes({
    //         url: Config.server + "/func/union/setUnionCurrentMerchantCount",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: {
    //             unionId: this.props.unionId,
    //             merchantCount:merchantCount,
    //         }
    //     }).then((json)=> {
    //         if(json.re === 1){
    //             Alert.alert("设置成功");
    //             this.props.getSupnuevoBuyerUnionPriceClassList();
    //         }
    //     }).catch((err)=>{alert(err);});
    // }
    //
    // getSupnuevoBuyerUnionPriceClassList(){
    //     proxy.postes({
    //         url: Config.server + "/func/union/getSupnuevoBuyerUnionPriceClassList",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: {
    //             unionId: this.props.unionId,
    //         }
    //     }).then((json)=> {
    //         if(json.re === 1){
    //             var dataList = json.data;
    //             // this.setState({priceClassList:this._transformPriceClassToArray(dataList)})
    //             this.setState({dataList:dataList})
    //         }
    //     }).catch((err)=>{alert(err);});
    // }

}

const styles = StyleSheet.create({
  container: {
    flex:1
  },
  titleWrapperStyle:{
    height:40,
    width:"100%",
    justifyContent: "center",
    alignItems: "center",
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
    // borderColor:'#888'
    //   borderColor:"red",
  },
  tableItemStyle:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    paddingVertical:10,
      // borderColor:"red",
      // borderWidth:1,
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
