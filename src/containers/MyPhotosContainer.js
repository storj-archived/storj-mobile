import React, { Component } from 'react';
import {
    View
} from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class MyPhotosContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <View></View>
    }
}

function mapStateToProps(state) {
    return {
       buckets: state.mainReducer.buckets
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyPhotosContainer);
//TODO: Add prop types