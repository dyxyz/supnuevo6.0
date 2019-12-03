import React from 'react';
import { View, StyleSheet, ActivityIndicator, Platform, Text, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import constants from './MapConstants';

export default class MapSearchBar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
      showSearchResult: false,
    }
  }

  render() {
    return (
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TouchableOpacity onPress={this.props._clearSearchInput}>
              <Text style={styles.searchInputLeftTxt}>{constants.CANCEL}</Text>
            </TouchableOpacity>
            <View style={styles.inputContainerStyle}>
              <TextInput
                  ref={ref => this._searchInput = ref}
                  onChangeText={(text) => this.props._searchTextChange(text)}
                  placeholder="搜索地点"
                  underlineColorAndroid="transparent"
                  style={styles.inputStyle}
                  value={this.props.searchText}
                  onFocus={this.props._onSearchInputFocus}
              />
            </View>
          </View>
          {this._renderSearchResult()}
        </View>
    );
  }

  _renderSearchResult = () => {

    const {searchResult, showSearchResult} = this.props;

    if (!showSearchResult) return null;
    if (!searchResult.data) return null;
    if (searchResult.error !== 0) return null;

    let searchResultsCustomStyle = {height: constants.SCREEN_HEIGHT - 80}
    if (searchResult.data.length < 3) {
      searchResultsCustomStyle = {height: 70 * searchResult.data.length}
    }

    let resultView = searchResult.data.map((item, index) => {
      return (
          <TouchableOpacity key={index} onPress={() => {this.props._onSearchResultPress(item)}}>
            <View style={styles.searchResultContainer}>
              <View style={styles.searchResultRightContainer}>
                <Text numberOfLines={1} style={styles.searchResultName}>{item.title}</Text>
                <Text numberOfLines={1} style={styles.searchResultAddr}>{item.address}</Text>
              </View>
            </View>
          </TouchableOpacity>
      )
    })

    return (
        <View style={[styles.searchResultsContainer, searchResultsCustomStyle]}>
          <ScrollView>
            {resultView}
          </ScrollView>
        </View>
    )
  }

}

const styles = StyleSheet.create({
  searchContainer: {
    width: constants.SCREEN_WIDTH,
    backgroundColor: 'white'
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c8c7cc',
  },
  inputContainerStyle: {
    flex: 1,
    margin: 0,
    paddingHorizontal: 10,
    borderBottomWidth: 0,
    borderLeftWidth: StyleSheet.hairlineWidth,
    borderLeftColor: '#c8c7cc',
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
  noSearchResultContainer: {
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c8c7cc',
    borderTopWidth: 0
  },
  noSearchResultTxt: {
    fontSize: 18,
    color: '#030303'
  },
  searchResultsContainer: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#c8c7cc',
    borderTopWidth: 0,
    height: 70,
    width: constants.SCREEN_WIDTH,
  },
  searchResultContainer: {
    height: 70,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#c8c7cc'
  },
  searchResultRightContainer: {
    flex: 1,
    paddingLeft: 20
  },
  searchResultName: {
    fontSize: 18,
    color: '#030303'
  },
  searchResultAddr: {
    fontSize: 12,
    color: '#b2b2b2',
    marginTop: 5
  },
});
