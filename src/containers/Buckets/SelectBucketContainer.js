import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Platform, BackHandler } from 'react-native';
import { getShortBucketName } from "../../utils/fileUtils";
import {
    redirectToMainScreen,
    navigateToFilesScreen
} from '../../reducers/navigation/navigationActions';
import { 
    setSearch,
    clearSearch,
    setBucketIdToCopy,
    openBucket
} from '../../reducers/mainContainer/mainReducerActions';
import SelectBucketComponent from '../../components/Buckets/SelectBucketComponent';
import BaseListContainer from "../BaseListContainer";

/**
 * Container for SelectBucketComponent
 */
class SelectBucketContainer extends BaseListContainer {
	constructor(props) {
        super(props);

        this.onHardwareBackPress = this.onHardwareBackPress.bind(this);

        this.emptyFunction = () => {};
        this.onBucketPress = this.onBucketPress.bind(this);
        this._onRef = this._onRef.bind(this);
    };

    componentDidMount() {
		if(Platform.OS === 'android') {
			BackHandler.addEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
    }
    
    componentWillUnmount() {
		if(Platform.OS === 'android') {
			BackHandler.removeEventListener("hardwareBackPress", this.onHardwareBackPress);
		}
    }
    
    onHardwareBackPress() {
		this.props.redirectToMainScreen();
    }
    
    _onRef(ref) {
        this._selectBucketComponent = ref;
    }

    getBucketName() {
        let bucketName = this.props.bucketIdToCopy ? 
            this.props.buckets.filter(bucket =>
                bucket.getId() === this.props.bucketIdToCopy
            )[0].entity.name : this.props.buckets[0].entity.name ;

        return bucketName;
    }

    getBucketToCopyId() {
        let id = this.props.bucketIdToCopy ? 
            this.props.bucketIdToCopy :
            this.props.buckets[0].getId();
        
        return id;
    }

    onBucketPress(bucket) {
        this._selectBucketComponent.getBucketId(bucket);
        this._selectBucketComponent.showSelection();
    }

	render() {

		return(
            <SelectBucketComponent
                ref = { this._onRef }
                getItemSize = { this.emptyFunction }
                isLoading = { false }
                searchSubSequence = { this.props.searchSubSequence }
                sortingMode = { null }
                onRefresh = { this.emptyFunction }
                isGridViewShown = { this.props.isGridViewShown }
                onPress = { this.onBucketPress }
                onLongPress = { this.emptyFunction }
                onDotsPress = { this.emptyFunction }
                onCancelPress = { this.emptyFunction }
                selectedItemId = { null }
                data = { this.props.buckets }
                isListActionsDisabled = { true }
                bucketToCopyName = { this.getBucketName() }
                getBucketName = { getShortBucketName }
                setSearch = { this.props.setSearch }
                clearSearch = { this.props.clearSearch }
                searchIndex = { 5 } 
                bucketIdToCopy = { this.getBucketToCopyId() }
                copyFiles = { this.props.navigation.state.params.callback }
                setBucketIdToCopy = { this.props.setBucketIdToCopy }
                showOptions = { this.emptyFunction }
                openBucket = { this.props.openBucket }
                navigateToFilesScreen = { this.props.navigateToFilesScreen }
                navigateBack = { this.props.redirectToMainScreen } />
		);
	};
}

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { 
    return { 
        buckets: state.bucketReducer.buckets,
        isGridViewShown: state.mainReducer.isGridViewShown,
        searchSubSequence: state.mainReducer.selectBucketsSearchSubSequence,
        bucketIdToCopy: state.mainReducer.bucketIdToCopy
    }; 
};
function mapDispatchToProps(dispatch) { 
    return bindActionCreators({
        redirectToMainScreen, 
        setSearch, 
        clearSearch,
        setBucketIdToCopy,
        openBucket,
        navigateToFilesScreen
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectBucketContainer);

