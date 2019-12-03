import React, { PureComponent } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Image,Dimensions } from 'react-native';
var {height, width} = Dimensions.get('window');

import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-datepicker'

const componentStyles = StyleSheet.create({
  calenderButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: '100%',
    paddingRight: 10,
  },
  containerStyle: {
    width:width,
    height:44,
  },
  titleWrapperStyle:{
    flex:1,
    height:44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapperStyle: {
    width: 300,
    height: 44,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: "#666",
  },
  titleStyle:{
    color: '#555',
    fontSize: 14
  },
  textStyle:{
    color: 'black',
    fontSize: 14
  },
  dataPickerContainerStyle:{
    width:40
  },
});

const dataPickerCustomStyles = {
  placeholderText:{color:'transparent',fontSize:12},
  dateInput:{height:30,borderWidth:0},
  dateTouchBody:{marginRight:0,height:25,borderWidth:0},
}

export default class InputWithCalendar extends PureComponent {
  static contextTypes = {
    styles: () => null,
  };

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const inputWidth = 300 - 40;
    const {title, date} = this.props;

    return (
          <View style={[componentStyles.containerStyle, { flexDirection: 'row' }]}>
            <View style={componentStyles.titleWrapperStyle}>
              <Text style={componentStyles.titleStyle}>{title}</Text>
            </View>
            <View style={[componentStyles.textWrapperStyle , { flexDirection: 'row' }]}>
              <Text style={[componentStyles.textStyle, { width: inputWidth, flexGrow: 1, borderWidth: 0 }]} >{date}</Text>
              <TouchableOpacity onPress={this._onPressOptions} style={componentStyles.optionButtonContainer}>
                <DatePicker
                    style={componentStyles.dataPickerContainerStyle}
                    customStyles={dataPickerCustomStyles}
                    placeholder={"请选择"}
                    mode="date"
                    format="YYYY-MM-DD"
                    minDate={"2019-01-01"}
                    confirmBtnText={"确认"}
                    cancelBtnText={"取消"}
                    showIcon={true}
                    onDateChange={(date) => {this.props.onDateChange(date)}}
                />
              </TouchableOpacity>
              {this.props.children}
            </View>
          </View>
    );
  }
}
