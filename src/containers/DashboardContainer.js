import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DashboardComponent from '../components/DashboardComponent';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);
    }

    getFavourites() {

    }

    getRecent() {

    }

    getTrash() {

    }

    render() {
        return(
            <DashboardComponent />
        )
    }
}