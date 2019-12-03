'use strict';

import React, {Component} from 'react';

import {
    StyleSheet,
    Text,
    View,
    Modal,
    ActivityIndicator,
    Dimensions,
    BackAndroid,
    Platform
} from 'react-native';
import {setSpText} from '../../utils/ScreenUtil'
let {height, width} = Dimensions.get('window');

export default class WaitTip extends Component {

    static defaultProps = {
        tipsName: 'please wait...'
    };

    propTypes = {};

    open() {
        this.setState({modalShow: true});
    }

    constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            tipsName: null,
        }
    }

    close() {
        this.setState({modalShow: false})
    }

    // componentDidMount() {
    //     setTimeout(() => {
    //         this.state.modalShow === true ?
    //             this.close() : console.log(this.state.modalShow);
    //     }, 1000);
    // }

    render() {
        let tipsName = null;
        if (this.props.tipsName !== undefined && this.props.tipsName !== null) {
            tipsName = this.props.tipsName;
        }
        if (this.state.modalShow) {
            setTimeout(() => {
                this.close()
            }, 10000);
        }

        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.modalShow}
                onRequestClose={() => {
                    this.setState({modalShow: false})
                }}
            >
                <View style={styles.viewStyle}>
                    <ActivityIndicator
                        animating={true}
                        style={styles.acStyle}
                        size="large"
                        color="#fff"
                    />
                    <View style={styles.viewInsideStyle}>
                        <Text style={styles.textStyle}>
                            {tipsName}
                        </Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

WaitTip.propTypes = {
    tipsName: React.PropTypes.func.string,
};


WaitTip.defaultProps = {};

let styles = StyleSheet.create({
    viewStyle: {
        flex: 1,
        justifyContent: 'center',
        padding: 8,
        backgroundColor: 'rgba(0,0,0,0.3)'
    },
    acStyle: {
        marginTop: 10,
        height: 80
    },
    viewInsideStyle: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    textStyle: {
        color: '#fff',
        fontSize: setSpText(18),
        alignItems: 'center'
    }

});

module.exports = WaitTip;
