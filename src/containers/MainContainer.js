import {
    View,
    Text
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import StorjLib from '../utils/StorjModule';

class MainContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: null,
            id: null
        };
    };

    componentDidMount() {
        StorjLib.getBuckets().then((value) => {
            if(value.length) 
                value.forEach((bucket) => {
                    this.bucket = bucket;

                    this.setState({
                        name: bucket.name,
                        id: bucket.id
                    });
                });
        });
    };

    static navigationOptions = {
        header: null
    };

    render() {
        return(
            <View>
                <Text>Hello main</Text>
                <Text>{ this.state.name }</Text>
                <Text>{ this.state.id }</Text>
            </View>
        );
    };
}

function mapStateToProps(state) { return { main: {} }; };
function mapDispatchToProps(dispatch) { return bindActionCreators({ mainActions: () => {} }, dispatch); };

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);

MainContainer.PropTypes = {
    main: PropTypes.object
};
