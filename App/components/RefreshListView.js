
import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, ViewPropTypes } from 'react-native';

// 刷新状态
export const RefreshState = {
  Idle: 0,
  HeaderRefreshing: 1,
  FooterRefreshing: 2,
  NoMoreData: 3,
  Failure: 4,
  EmptyData: 5,
};

export const RefreshString = {
  noData: "暂时没有相关数据",
  loadError: "点击重新加载",
  noMore: "已加载全部数据",
  loading: "数据加载中...",
};

const log = (text: string) => {};

type Props = {
  refreshState: number,
  onHeaderRefresh: Function,
  onFooterRefresh?: Function,
  data: Array<any>,

  listRef?: any,

  footerRefreshingText?: string,
  footerFailureText?: string,
  footerNoMoreDataText?: string,
  footerEmptyDataText?: string,

  footerRefreshingComponent?: any,
  footerFailureComponent?: any,
  footerNoMoreDataComponent?: any,
  footerEmptyDataComponent?: any,

  renderItem: Function,
}

type State = {

}

class RefreshListView extends PureComponent<Props, State> {
  static defaultProps = {
    footerRefreshingText: RefreshString.loading,
    footerFailureText: RefreshString.loadError,
    footerNoMoreDataText: RefreshString.noMore,
    footerEmptyDataText: RefreshString.noData,
  };

  componentWillReceiveProps(nextProps: Props) {
    log(`[RefreshListView]  RefreshListView componentWillReceiveProps ${nextProps.refreshState}`);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    log(`[RefreshListView]  RefreshListView componentDidUpdate ${prevProps.refreshState}`);
  }

  onHeaderRefresh = () => {
    log('[RefreshListView]  onHeaderRefresh');

    if (this.shouldStartHeaderRefreshing()) {
      log('[RefreshListView]  onHeaderRefresh');
      this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
    }
  };

  onEndReached = (info: {distanceFromEnd: number}) => {
    log(`[RefreshListView]  onEndReached   ${info.distanceFromEnd}`);

    if (this.shouldStartFooterRefreshing()) {
      log('[RefreshListView]  onFooterRefresh');
      this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing);
    }
  };

  shouldStartHeaderRefreshing = () => {
    log('[RefreshListView]  shouldStartHeaderRefreshing');

    if (this.props.refreshState === RefreshState.HeaderRefreshing
      || this.props.refreshState === RefreshState.FooterRefreshing) {
      return false;
    }

    return true;
  };

  shouldStartFooterRefreshing = () => {
    log('[RefreshListView]  shouldStartFooterRefreshing');

    const { refreshState, data } = this.props;
    if (data.length === 0) {
      return false;
    }

    return (refreshState === RefreshState.Idle);
  };

  renderFooter = () => {
    let footer = null;

    const {
      footerRefreshingText,
      footerFailureText,
      footerNoMoreDataText,
      footerEmptyDataText,

      footerRefreshingComponent,
      footerFailureComponent,
      footerNoMoreDataComponent,
      footerEmptyDataComponent,
    } = this.props;

    switch (this.props.refreshState) {
      case RefreshState.Idle:
        footer = (<View style={styles.footerContainer} />);
        break;
      case RefreshState.Failure: {
        footer = (
          <TouchableOpacity onPress={() => {
            if (this.props.data.length === 0) {
              this.props.onHeaderRefresh && this.props.onHeaderRefresh(RefreshState.HeaderRefreshing);
            } else {
              this.props.onFooterRefresh && this.props.onFooterRefresh(RefreshState.FooterRefreshing);
            }
          }}
          >
            {footerFailureComponent || (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{footerFailureText}</Text>
              </View>
            )}
          </TouchableOpacity>
        );
        break;
      }
      case RefreshState.EmptyData: {
        footer = (
          <View>
            {footerEmptyDataComponent || (
              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>{footerEmptyDataText}</Text>
              </View>
            )}
          </View>
        );
        break;
      }
      case RefreshState.FooterRefreshing: {
        footer = footerRefreshingComponent || (
          <View style={styles.footerContainer}>
            <ActivityIndicator color="#888888" size="small" />
            <Text style={[styles.footerText, { marginLeft: 7 }]}>{footerRefreshingText}</Text>
          </View>
        );
        break;
      }
      case RefreshState.NoMoreData: {
        footer = footerNoMoreDataComponent || (
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>{footerNoMoreDataText}</Text>
          </View>
        );
        break;
      }
      default:
        break;
    }

    return footer;
  }

  render() {
    log(`[RefreshListView]  render  refreshState:${this.props.refreshState}`);

    const { renderItem, ...rest } = this.props;

    return (
      <FlatList
        ref={this.props.listRef}
        ListFooterComponent={this.renderFooter}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={0.1}
        onRefresh={this.onHeaderRefresh}
        refreshing={this.props.refreshState === RefreshState.HeaderRefreshing}
        renderItem={renderItem}
        {...rest}
      />
    );
  }
}

const styles = StyleSheet.create({
  footerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: 50,
  },
  footerText: {
    fontSize: 14,
    color: '#555555',
  },
});

export default RefreshListView;
