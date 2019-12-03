import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Dimensions} from 'react-native';
var {height, width} = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';

var primaryDarkGray = "#666";

export default class AISearchBar extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        }
    }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding">
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <TouchableOpacity style={styles.searchIcon} onPress={this.props._onMicrophonePress}>
                        <Ionicons name={'md-mic'} size={25} color={primaryDarkGray}/>
                    </TouchableOpacity>
                    <View style={styles.inputContainerStyle}>
                        <TextInput
                            ref={ref => this._searchInput = ref}
                            underlineColorAndroid="transparent"
                            style={styles.inputStyle}
                            value={this.props.searchText}
                            onChangeText={(text) => this.props._searchTextChange(text)}
                            onFocus={this.props._onSearchInputFocus}
                        />
                    </View>
                    <TouchableOpacity style={styles.searchIcon} onPress={this.props._onSearchPress}>
                        <Ionicons name={'md-search'} size={25} color={primaryDarkGray}/>
                    </TouchableOpacity>
                </View>
            </View>
            </KeyboardAvoidingView>
        );
    }

}

const styles = StyleSheet.create({
    searchContainer: {
        width: width,
        backgroundColor: 'white',
    },
    searchInputContainer: {
        height: Platform.OS === 'ios' ? 49 : 55,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c8c7cc',
    },
    searchIcon:{
        width:30,
        height:30,
        alignItems:'center',
        justifyContent: 'center',
    },
    inputContainerStyle: {
        flex: 1,
        margin: 0,
        paddingHorizontal: 10,
        borderBottomWidth: 0,
        borderLeftWidth: StyleSheet.hairlineWidth,
        borderLeftColor: '#c8c7cc',
        borderRightWidth: StyleSheet.hairlineWidth,
        borderRightColor: '#c8c7cc',
    },
    inputStyle: {
        height: 30,
        padding: 0,
        margin: 0,
    },
    searchInputLeftTxt: {
        fontSize: 16,
        color: "#387ef5",
        paddingRight: 10,
    },
});
