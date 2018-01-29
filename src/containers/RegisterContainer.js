import PropTypes from 'prop-types';
import { AsyncStorage } from 'react-native';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { registerActionsCreators } from '../reducers/authentification/authActions';
import { RegisterStateModel } from '../models/RegisterStateModel';
import { RegisterErrorModel } from '../models/RegisterErrorModel';
import RegisterComponent from '../components/RegisterComponent';
import StorjModule from '../utils/StorjModule';
import validator from '../utils/validator';
import infoScreensConstants from '../utils/constants/infoScreensConstants';

const FIRST_ACTION = 'FIRST_ACTION';

/**
 * Redux container for register component
 */
export class RegisterContainer extends Component {
	constructor(props) {
        super(props);

        this.state = {
            stateModel: new RegisterStateModel(),
            errorModel: new RegisterErrorModel(),
            isLoading: false
        };
        
    };
    
    /**
     * Remove react-navigation stackNavigator page headers
     */
    static navigationOptions = {
        header: null
    };

    /**
     * Changing internal state when user login inputting
     * @param {*} value current value in Input
     */
    onChangeEmail(value) {
        this.setState({
            stateModel: 
                new RegisterStateModel(
                    value, 
                    this.state.stateModel.password, 
                    this.state.stateModel.passwordRepeat, 
                    this.state.stateModel.areTermsAccepted)
        });
    };

    /**
     * Changing internal state when user inputting password
     * @param {*} value current value in Input
     */
    onChangePassword(value) {
        this.setState({
            stateModel: 
            new RegisterStateModel(
                this.state.stateModel.email, 
                value, 
                this.state.stateModel.passwordRepeat, 
                this.state.stateModel.areTermsAccepted)
            });
    };

    /**
     * Changing internal state when user repeating password
     * @param {*} value current value in Input
     */
    onChangePasswordRepeat(value) {
        this.setState({
            stateModel: 
                new RegisterStateModel(
                    this.state.stateModel.email, 
                    this.state.stateModel.password, 
                    value, 
                    this.state.stateModel.areTermsAccepted)
            });
    };

    /**
     * Changing internal state when user selects terms of use checkbox
     * @param {bool} value current value in Input
     */
    onChangeTermsAcceptence(value) {
        this.setState({
            stateModel: 
                new RegisterStateModel(
                    this.state.stateModel.email, 
                    this.state.stateModel.password, 
                    this.state.stateModel.passwordRepeat, 
                    value)
            });
    };
    
    /**
     * Handle if was allready in use
     */
    async handleFirstLaunch() {
        if(!await AsyncStorage.getItem(FIRST_ACTION)) 
            await AsyncStorage.setItem(FIRST_ACTION, 'true');
        
    };

    /**
     * Submit registration info
     */
    async onSubmit() {
        if(this.state.isLoading) return;
        
        this.setState({ isLoading: true });
        let isEmailValid = validator.isEmail(this.state.stateModel.email);
        let isPasswordValid = this.state.stateModel.password;
        let isPasswordMatch = this.state.stateModel.password === this.state.stateModel.passwordRepeat;

        if(isEmailValid && isPasswordValid && isPasswordMatch 
           && this.state.stateModel.areTermsAccepted) {
               await this.register();          
        } else {
            this.setState({
                errorModel: new RegisterErrorModel(
                    !isEmailValid,
                    !isPasswordValid,
                    !isPasswordMatch,
                    !this.state.stateModel.areTermsAccepted)
            });
        }

        this.setState({
            isLoading: false
        });
    };

    /**
    * Preparing data and calling StorjLib register function
    */
    async register() {
        this.props.register(this.state.stateModel.email, this.state.stateModel.password);

        const registrationResult = await StorjModule.register(
            this.state.stateModel.email, 
            this.state.stateModel.password, 
            this.registerErrorCallback.bind(this));


        if(!registrationResult.isSuccess) {
            const errorMessage = registrationResult.errorMessage;
            this.props.registerError(errorMessage);

            //TODO: improve in future, we need better error codes from StorjLib
            if(errorMessage.includes('is already registered')) { 
                this.props.redirectToAuthFailureScreen({ 
                    mainText: infoScreensConstants.registerFailureMainText, 
                    additionalText: infoScreensConstants.registerFailureAdditionalText 
                });
            }    
            
            return;
        }
        
        this.props.registerSuccess(registrationResult.mnemonic);
        this.handleFirstLaunch();
        this.props.redirectToRegisterSuccessScreen(registrationResult.mnemonic, this.state.stateModel.email);    
    };

    /**
    * Error callback for register method from StorjLib.
    */
    registerErrorCallback(error) {  
        this.setState({ isLoading: false });
        this.props.registerError(error.message);
    
        this.props.redirectToAuthFailureScreen({ 
            mainText: 'Something Went Wrong', 
            additionalText: error.message
        });
    };

    /**
    * Navigate back to previous screen
    */
    navigateBack() {
        this.props.navigateBack();
    };

    /**
     * Navigate to TermsOfUseScreen
     */
    redirectToTermsOfUse() {
        this.props.redirectToTermsOfUse();
    }

    /**
    * Navigate to LoginScreen
    */
    redirectToLoginScreen() {
        this.props.redirectToLoginScreen();
    };

	render() {
		return(
                <RegisterComponent
                    isLoading = { this.state.isLoading }
                    onSubmit = { this.onSubmit.bind(this) }
                    onChangeEmail = { this.onChangeEmail.bind(this) }
                    onChangePassword = { this.onChangePassword.bind(this) }
                    onChangePasswordRepeat = { this.onChangePasswordRepeat.bind(this) }
                    onChangeTermsAcceptence = { this.onChangeTermsAcceptence.bind(this) }
                    navigateBack = { this.navigateBack.bind(this) }
                    redirectToTermsOfUse = { this.redirectToTermsOfUse.bind(this) }
                    redirectToLoginScreen = { this.redirectToLoginScreen.bind(this) }
                    isEmailError = { this.state.errorModel.isEmailError }
                    isPasswordError = { this.state.errorModel.isPasswordError }
                    isPasswordMatchError = { this.state.errorModel.isPasswordMatchError }
                    isTermsAcceptedError = { this.state.errorModel.isTermsAcceptedError } />
		);
	};
}

/**
* connecting state and action creators to component props 
*/
function mapStateToProps(state) { return { user: state.authReducer.user }; };
function mapDispatchToProps(dispatch) { return bindActionCreators(registerActionsCreators, dispatch); };

/**
* Creating RegisterContainer mappings
*/
export default connect(mapStateToProps, mapDispatchToProps)(RegisterContainer);

/**
* Checking RegisterContainer correct prop types
*/
RegisterContainer.propTypes = {
    user: PropTypes.shape({
        isLoggedIn: PropTypes.bool,
        email: PropTypes.string,
        password: PropTypes.string,
        mnemonic: PropTypes.string,
        isLoading: PropTypes.bool,
        error: PropTypes.string
    })
};
