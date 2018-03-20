import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MyAccountNavComponent from '../components/MyAccount/MyAccountNavComponent';
import { redirectToStorageScreen } from '../reducers/navigation/navigationActions';

class MyAccountContainer extends Component {
    constructor(props) {
        super(props);
    }
    
    // navigateBack() {
    //     this.props.bucketNavigateBack();
    //     this.props.closeBucket();
    // }

    render() {
        return(
            <MyAccountNavComponent 
                redirectToInitializationScreen = { this.props.screenProps.redirectToInitializationScreen }
                showQR = { this.props.screenProps.showQR }
                showStorageInfo = { this.props.screenProps.showStorageInfo }
                showCredits = { this.props.screenProps.showCredits } /> 
        );
    }
}

function mapStateToProps(state) {
    let routes = state.myAccountScreenNavReducer.routes;
    let index = state.myAccountScreenNavReducer.index;
    let currentScreenName = routes[index].routeName;

    return {};
}
    
function mapDispatchToProps(dispatch) {
    return bindActionCreators( { }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAccountContainer);

//TODO: Add prop types