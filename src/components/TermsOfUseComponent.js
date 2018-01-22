import {
    WebView,
    StyleSheet
} from 'react-native';
import React, { Component } from 'react';

/**
 * Terms of use component
 */
const TermsOfUseComponent = (props) => {

    return(
        <WebView source={{uri: 'https://storj.io/terms-of-use.html'}}>
            
        </WebView>
    );
}

export default TermsOfUseComponent;

const styles = StyleSheet.create({
    
});