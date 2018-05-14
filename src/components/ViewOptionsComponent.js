import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getHeight, getWidth } from '../utils/adaptive';
import SORTING from '../utils/constants/sortingConstants';
import SyncModule from '../utils/SyncModule';

export default class ViewOptionsComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isSortingShown: false
        }
    }

    closeView() {
        this.props.showOptions();
    }

    setSelectinMode() {
        this.props.enableSelectionMode();     
    }

    renderOptionItem(imageSource, title, onPress) {
        return(
            <TouchableOpacity style = { styles.itemContainer } onPress = { onPress } >
                <View style = { styles.marginImage }>
                    <Image source = { imageSource } style = { styles.iconContainer } resizeMode = 'contain' />
                </View> 
                <View style = { styles.marginLabel }>
                    <Text style = { styles.labelText }>{ title }</Text>
                </View>
            </TouchableOpacity>
        )
    }

    renderMainOptions() {
        return(
            <View style = { styles.mainContainer } >
                {
                    this.renderOptionItem( require('../images/Icons/SortIcon.png'), "Sort items...", () => { this.setState({isSortingShown: true}) })
                }
                {
                    this.props.isGridViewShown ?
                        this.renderOptionItem( 
                            require('../images/Icons/ListIcon.png'), 
                            "List view", 
                            () => {
                                this.props.setListView(); 
                                this.closeView();
                            }
                        ) :
                        this.renderOptionItem( 
                            require('../images/Icons/GridIcon.png'), 
                            "Grid view", 
                            () => {
                                this.props.setGridView();
                                this.closeView();
                            }
                        )   
                }
                {
                    this.renderOptionItem( 
                        require('../images/Icons/SelectItems.png'), 
                        "Select items", 
                        () => {
                            this.setSelectinMode();
                            this.closeView();
                        }
                    )
                }
            </View>
        )
    }

    renderSorting() {
        return(
            <View style = { styles.mainContainer } >
                {
                    this.renderOptionItem( 
                        null, 
                        "Sort by date", 
                        () => { 
                            this.props.setSorting(SORTING.BY_DATE);
                            this.closeView();
                            this.props.getBuckets(SORTING.BY_DATE);
                        }
                    )
                }
                {
                    this.renderOptionItem( 
                        null, 
                        "Sort by name", 
                        () => { 
                            this.props.setSorting(SORTING.BY_NAME);
                            this.closeView();
                            this.props.getBuckets(SORTING.BY_NAME);
                        }
                    )
                }
            </View>
        )
    }

    mainRender() {
        if(this.state.isSortingShown) {
            return this.renderSorting();
        }

        return this.renderMainOptions();
    }

    render() {
        return(
            <View style = { [ styles.backgroundWrapper ] }>  
                <TouchableOpacity style = { [ styles.backgroundWrapper, styles.dimBlack ] } onPress = { () => this.closeView() } />
                {
                    this.mainRender()
                }
            </View>
        )
    }
}

ViewOptionsComponent.propTypes = {
    showOptions: PropTypes.func,
    isGridViewShown: PropTypes.bool,
    setGridView: PropTypes.func,
    setListView: PropTypes.func
}

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: 'white', 
        width: getWidth(355),
        alignSelf: 'center',
        borderRadius: 6,
        marginTop: getHeight(30)
    },
    backgroundWrapper: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        position: 'absolute',
        backgroundColor: 'transparent'
    },
    dimBlack: {
        backgroundColor: 'black',
        opacity: 0.2
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: getHeight(55), 
        borderBottomWidth: 0.5, 
        borderBottomColor: 'rgba(56, 75, 101, 0.2)'
    },
    iconContainer: {
        height: getHeight(24),
        width: getWidth(24)
    },
    labelText: {
        fontFamily: 'Montserrat-Regular',
        fontSize: getHeight(16),
        lineHeight: getHeight(19),
        color: '#2794FF'
    },
    marginImage: {
        marginLeft: getWidth(20)
    },
    marginLabel: {
        marginLeft: getWidth(15)
    }
});