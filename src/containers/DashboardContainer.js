import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { dashboardContainerActions, filesListContainerMainActions } from '../reducers/mainContainer/mainReducerActions';
import { filesListContainerFileActions, mainContainerFileActions } from '../reducers/mainContainer/Files/filesReducerActions';
import { navigateBack, navigateToFilesScreen } from '../reducers/navigation/navigationActions';
import { uploadFileStart, uploadFileSuccess } from '../reducers/asyncActions/fileActionsAsync';
import DashboardListComponent from '../components/DashboardListComponent';
import { sha256 } from '../utils/sha256';
import StorjModule from '../utils/StorjModule';

class DashboardContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            storage: "0.0",
            bandwidth: "0.0"
        }

        this.avgHoursPerMonth = 730;
    }

    async componentDidMount() {        

        let keysResponse = await StorjModule.getKeys();
        let keyResult = JSON.parse(keysResponse.result);

        sha256(keyResult.password).then(async hash => {
            
            let authorization = 'Basic ' + btoa(keyResult.email + ":" + hash);
            let params = {};

            const dateRange = this.getFirstAndLastDayOfCurrentMonth();
            params.user = keyResult.email;
            params.startDate = dateRange.startDate;
            params.endDate = dateRange.endDate;
            params.__nonce = "1453222669376";

            var url = "https://billing.prod.storj.io/debits?" + this.toQueryString(params);
            
            let myRequest = new Request(url, {
                method: 'GET',
                headers: {
                  'Accept': 'application/json, text/plain, */*',
                  'Content-Type': 'application/json',
                  'Connection': 'keep-alive',
                  'Host': 'billing.prod.storj.io',
                  'Authorization': authorization
                },
            });

            let response = await fetch(myRequest);

            if(response.status === 200) {
                let debits = await response.json();
                
                console.log(debits);
                this.getDebits(debits);        
            }
        });
    }

    getDebits(debits) {
        if (debits.length <= 0) {
            this.setState({storage: "0.00", bandwidth: "0.00"});
        }

        let stor = this.getSum(debits, 'storage');
        let currentStor = stor / this.avgHoursPerMonth;
        let roundStor = this.roundToGBAmount(currentStor);

        let band = this.getSum(debits, 'bandwidth');
        let roundBandwidth = this.roundToGBAmount(band, 'bytes');

        console.log(roundBandwidth);

        this.setState({storage: roundStor, bandwidth: roundBandwidth});        
    }

    /**
     * Sums the values of specified field in collection array [{}, {}]
     * @param {Array} arr - collection Array
     * @param {string} field - field in arr to sum up
     * @returns {Number}
     */
    getSum = function (arr, field) {
        console.log("arr", arr)
        console.log("field", field)
        if (!arr || (Array.isArray(arr) && arr.length <= 0)) {
            return 0;
        }
        console.log(field)  
        const sum = arr.reduce((acc, i) => {
            console.log("acc", acc)
            console.log("i", i)
            const add = typeof i[field] === 'undefined' ? 0 : i[field];
            return acc + add;
        }, 0);
    
        return sum;
    };

    /**
     * Prettifies the amount printed in billing history.
     * Returns either a string that lets the user know that the amount that
     * has been used is than 0.01 GB or rounds the amount to two decimal
     * places.
     * @param {Number} num - number in bytes or GB
     * @param {String} type - optional - undefined or 'bytes'
     */
    roundToGBAmount (num, type) {
        const GB = 1000000000;
    
        const numInGB = type === 'bytes' ? num / GB : num;
        const modNum = this.setToTwoDecimalPlaces(numInGB);
    
        // Checks to see if the amount is less than one cent
        if (modNum.indexOf('0.00') === 0) {
            const lessThanOneCent = '< 0.01';
            return lessThanOneCent;
        }

        return modNum + '';
    };

    getFirstAndLastDayOfCurrentMonth = function () {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
      
        let startDate = new Date(currentYear, currentMonth, 1);
        let endDate = new Date(currentYear, currentMonth + 1, 1);
      
        startDate.setUTCHours(0, 0, 0);
        endDate.setUTCHours(0, 0, 0);
      
        return {
          startDate,
          endDate
        };
    };

    /**
     * Rounds a number to two decimal places
     * @param {Number} num
     * @returns {String} num rounded and stringified to two decimal places
     */
    setToTwoDecimalPlaces (num) {
        const roundedToTwoPlaces = Math.round(num * 100) / 100;
        const setToTwoPlaces = roundedToTwoPlaces.toFixed(2);
    
        return setToTwoPlaces;
    };

    toQueryString(obj) {
        var str = [];

        for (var p in obj) {
            if (obj.hasOwnProperty(p)) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
        }       

        return str.join("&");
      }

    render() {        
        return(
            <DashboardListComponent
                files = { this.props.files }
                buckets = { this.props.buckets }
                openBucket = { this.props.openBucket}
                screenName = { this.props.screenName }
                selectItem = { this.props.selectBucket }
                navigateBack = { this.props.navigateBack }
                deselectItem = { this.props.deselectBucket }      
                isSelectionMode = { this.props.isSelectionMode }
                openedBucketId = { this.props.openedBucketId }
                selectedItemId = { this.props.selectedItemId }
                animatedScrollValue = { this.animatedScrollValue  }
                enableSelectionMode = { this.props.enableSelectionMode }
                disableSelectionMode = { this.props.disableSelectionMode }
                onSingleItemSelected = { this.props.onSingleItemSelected }  
                isSingleItemSelected = { this.props.isSingleItemSelected }
                navigateToFilesScreen = { this.props.navigateToFilesScreen }
                setSelectionId = { this.props.setSelectionId } 
                storageAmount = { this.state.storage }
                bandwidthAmount = { this.state.bandwidth }/>
        )
    }
}

function mapStateToProps(state) {
    let routes = state.dashboardScreenNavReducer.routes;
    let index = state.dashboardScreenNavReducer.index;
    let currentBucketScreenName = routes[index].routeName;

    return {
        isSelectionMode: state.mainReducer.isSelectionMode,        
        buckets: state.mainReducer.buckets,
        isSingleItemSelected: state.mainReducer.isSingleItemSelected,
        fileListModels: state.filesReducer.fileListModels,
        files: state.filesReducer.fileListModels,
        screenName: currentBucketScreenName,
        selectedItemId: state.mainReducer.selectedItemId,
        openedBucketId: state.mainReducer.openedBucketId
    };
}
    
function mapDispatchToProps(dispatch) {
    return {
        ...bindActionCreators( { 
            ...dashboardContainerActions, 
            ...filesListContainerFileActions, 
            ...filesListContainerMainActions, 
            navigateBack,
            navigateToFilesScreen
        }, dispatch),
        getUploadingFile: (fileHandle) => dispatch(uploadFileStart(fileHandle)),
        uploadSuccess: (fileHandle, fileId) => dispatch(uploadFileSuccess(fileHandle, fileId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardContainer);