import {
    View,
    Text,
    StyleSheet} from 'react-native';
import React from 'react';
import SearchComponent from './SearchComponent';
import { getWidth, getHeight } from '../../utils/adaptive';
import Button from "../Common/ButtonComponent";
import PropTypes from 'prop-types';

export default BucketsScreenHeaderComponent = (props) => {

    return(
        <View style = { styles.mainContainer }>
            <AnimatedHeader
                lastSync = { props.lastSync }
                searchSubSequence = { props.searchSubSequence }
                placeholder = { props.placeholder }
                setSearch = { props.setSearch }
                clearSearch = { props.clearSearch }
                searchIndex = { props.searchIndex }
                isSelectBucketScreen = { props.isSelectBucketScreen } 
                isFilesScreen = { props.isFilesScreen } 
                selectedItemsCount = { props.selectedItemsCount }
                showOptions = { props.showOptions }
                buckets = { props.buckets }
                openedBucketId = { props.openedBucketId }
                navigateBack = { props.navigateBack }
                isSelectionMode = { props.isSelectionMode }
                disableSelectionMode = { props.disableSelectionMode }
                animatedScrollValue = { props.animatedScrollValue }
                selectAll = { props.selectAll }
                deselectAll = { props.deselectAll } />
        </View>
    );
}

AnimatedHeader = (props) => {

    renderSearchComponent = () => {
        return(
            <View style = { styles.searchWrapper }>
                <View style = { styles.searchWrapperInner }>
                    <SearchComponent
                        lastSync = { props.lastSync }
                        searchSubSequence = { props.searchSubSequence }
                        placeholder = { props.placeholder }
                        searchIndex = { props.searchIndex }
                        setSearch = { props.setSearch }
                        clearSearch = { props.clearSearch }                    
                        isSelectBucketScreen = { props.isSelectBucketScreen }
                        isFilesScreen = { props.isFilesScreen }
                        showOptions = { props.showOptions }
                        buckets = { props.buckets }
                        openedBucketId = { props.openedBucketId }
                        styleContainer = { styles.searchComponent }
                        navigateBack = { props.navigateBack } />
                </View>
            </View>
        );
    };

    onSelectAllPress = () => {
        props.selectAll(props.openedBucketId, props.isFilesScreen);
    };

    renderSelectComponent = () => {   
        let count = props.selectedItemsCount;
        return(
            <View style = { styles.selectionContainer }>
                <View style = { styles.selectionWrapper }>
                    <View style = { styles.flexRow }>
                    <Button
                        onPress = { props.deselectAll }
                        source = { require('../../images/Icons/BlueCross.png') } />
                    <Text style = { styles.selectionText }>{ count + " selected" }</Text>
                    </View>
                    <Text
                        onPress = { onSelectAllPress  }
                        style = { styles.textDone }>Select all</Text>
                </View>
            </View>
        );
    };

    const selectionMode = props.isSelectionMode ? null: styles.justifyContentFlexEnd;

    return(
        <View style = { [ styles.headerContainer, selectionMode ] } >
            {
                props.isSelectionMode ? renderSelectComponent() : renderSearchComponent()
            }
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        position: 'absolute',
        height: getHeight(80),
        top: 0,
        right: 0,
        left: 0
    },
    headerContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'flex-end',
        borderBottomWidth: 0,
        paddingBottom: getHeight(10),
        borderColor: 'gray'
    },
    justifyContentFlexEnd: {
        justifyContent: 'flex-end'
    },
    backButton: {
        height: getHeight(16),
        width: getWidth(16)
    },
    backButtonWrapper: {
        padding: getWidth(20)
    },
    searchWrapper: {
        paddingHorizontal: getWidth(6),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchWrapperInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 0.97
    },
    selectionContainer: {
        flex: 1
    },
    selectionWrapper: {
        paddingRight: getWidth(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    selectionText: {
        marginLeft: getWidth(5),
        fontSize: getHeight(30), 
        color: '#384B65',
        fontFamily: 'montserrat_bold'
    },
    textDone: {
        fontSize: getHeight(18),
        color: '#2794FF',
        fontFamily: 'montserrat_medium'
    },
    searchComponent: {
        paddingVertical: getHeight(10),
        flex: 1
    }, 
    imageContainer: {
        justifyContent: 'center'
    },
    image: {
        height: getHeight(24),
        width: getWidth(24)
    },
    flexRow: {
        flexDirection: 'row'
    }
});

BucketsScreenHeaderComponent.propTypes = {
    animatedScrollValue: PropTypes.object,
    buckets: PropTypes.array,
    disableSelectionMode: PropTypes.func,
    isSelectBucketScreen: PropTypes.bool,
    isFilesScreen: PropTypes.bool,
    isSelectionMode: PropTypes.bool,
    navigateBack: PropTypes.func,
    openedBucketId: PropTypes.string,
    selectedItemsCount: PropTypes.number,
    showOptions: PropTypes.func,
    clearSearch: PropTypes.func,
    deselectAll: PropTypes.func,
    searchIndex: PropTypes.number,
    selectAll: PropTypes.func,
    setSearch: PropTypes.func
};
