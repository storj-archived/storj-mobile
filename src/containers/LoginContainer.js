import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Linking } from 'react-native';
import { 
    setAccountNotExist,
    setAccountExist,
    setEmailNotConfirmed,
    setEmailConfirmed,
    loginSuccess,
    loginError,
    login,
    navigateToRegisterScreen,
    redirectToAuthFailureScreen,
    redirectToMainScreen,
    redirectToInitializeScreen,
    redirectToQRScannerScreen 
} from '../reducers/authentification/authActions';
import StorjLib from '../utils/StorjModule';
import SyncModule from "../utils/SyncModule";
import LoginComponent from '../components/LoginComponent';
import validator from '../utils/validator';
import { LoginStateModel } from '../models/LoginStateModel';
import { LoginErrorModel } from '../models/LoginErrorModel';
import infoScreensConstants from '../utils/constants/infoScreensConstants';
import { getEmail, getMnemonic, getPassword, getFirstAction, setFirstAction } from '../utils/AsyncStorageModule';
import PropTypes from 'prop-types';

/**
 * Container for LoginComponent
 */
class LoginContainer extends Component {
	constructor(props) {
        super(props);

        this.state = {
            stateModel: new LoginStateModel(),
            errorModel: new LoginErrorModel(),
            isLoading: false
        };
    };

    /**
     * Hiding navigation header
     */
    static navigationOptions = {
        header: null
    };

    /**
     * Fill local state from store on component did mount
     */
    async componentDidMount() {
        let email, password, mnemonic;

        if(this.props.user.mnemonic) {
            email = this.props.user.email;
            password = this.props.user.password;
            mnemonic = this.props.user.mnemonic;
        } else {
            email = await getEmail(),
            password = await getPassword(),
            mnemonic = await getMnemonic()   
        }

        this.setState({
            stateModel: new LoginStateModel(email, password, mnemonic)
        });
    };

    /**
     * Changing internal state when user login inputting
     * @param {string} value current value in Input
     */
    onChangeEmailInput(value) {
        this.setState({
            stateModel: new LoginStateModel(
                value,
                this.state.stateModel.password,
                this.state.stateModel.mnemonic
            )
        });
    };

    /**
     * Changing internal state when user password inputting
     * @param {string} value current value in Input
     */
    onChangePasswordInput(value) {
        this.setState({
            stateModel: new LoginStateModel(
                this.state.stateModel.email,
                value,
                this.state.stateModel.mnemonic
            )
        });
    };
    /**
     * Changing internal state when user password inputting
     * @param {string} value current value in Input
     */
    onChangeMnemonicInput(value) {
        this.setState({
            stateModel: new LoginStateModel(
                this.state.stateModel.email,
                this.state.stateModel.password,
                value
            )
        });
    };

    /**
     * Handle if was allready in use
     */
    async handleFirstLaunch(email) {
        if(!await getFirstAction()) {
            await setFirstAction();
        }

        SyncModule.insertSyncSetting(email);
    };

    /**
     * try validate login as email and invokes actionCreators  
     * to change userInfo in store
     */
	async tryLogin() {
        if(this.state.isLoading) return;
        this.setState({ isLoading: true });

        let isEmailValid = validator.isEmail(this.state.stateModel.email);
        let isPasswordValid = this.state.stateModel.password ? true : false;
        let isMnemonicValid = await StorjLib.checkMnemonic(this.state.stateModel.mnemonic);

        if(isEmailValid && isPasswordValid && isMnemonicValid) {
            await this.login();
        } else {
            this.setState({
                errorModel: new LoginErrorModel(
                    !isEmailValid,
                    !isPasswordValid,
                    !isMnemonicValid,
                    this.state.errorModel.isCredentialsError
                )
            });
        }

        this.setState({ isLoading: false });
    };

    async login() {
        this.props.login(
            this.state.stateModel.email, 
            this.state.stateModel.password,
            this.state.stateModel.mnemonic);

        let areCredentialsValid = await StorjLib.verifyKeys(
            this.state.stateModel.email, 
            this.state.stateModel.password);
            
        if(!areCredentialsValid.isSuccess) {
            this.setState({
                errorModel: new LoginErrorModel(
                    this.state.errorModel.isEmailError,
                    this.state.errorModel.isPasswordError,
                    this.state.errorModel.isMnemonicError,
                    !areCredentialsValid.isSuccess
                )
            });

            switch (areCredentialsValid.error.errorCode) {
                case 403: this.props.setEmailNotConfirmed();
                break;
                case 401: this.props.setAccountNotExist();
                break;
                default: this.props.redirectToAuthFailureScreen({ 
                    mainText: infoScreensConstants.loginFailureMainText, 
                    additionalText: infoScreensConstants.loginFailureAdditionalText 
                });
            }

            this.props.loginError();
            
            return;
        }

        let areKeysImported = await StorjLib.importKeys(
            this.state.stateModel.email,
            this.state.stateModel.password,
            this.state.stateModel.mnemonic,
            ''
        );
        
        if(areKeysImported) {
            await this.handleFirstLaunch(this.state.stateModel.email);
            this.props.setEmailConfirmed();
            this.props.setAccountExist();
            this.props.loginSuccess();
            this.props.redirectToInitializeScreen();
        } else {
            this.props.loginError();
            this.props.redirectToAuthFailureScreen({ 
                mainText: infoScreensConstants.loginFailureMainText, 
                additionalText: infoScreensConstants.loginFailureAdditionalText 
            });
        }
    };

    /**
     * invokes actionCreators that provides navigations
     */
    redirectToRegisterScreen() {
        this.props.setAccountExist();
        this.props.setEmailConfirmed();
		this.props.navigateToRegisterScreen();
    };
    redirectToMainPageScreen() {
		this.props.redirectToMainScreen();
    };
    redirectToQRScannerScreen() {
        this.props.setAccountExist();
        this.props.setEmailConfirmed();
        this.props.redirectToQRScannerScreen();
    };

    redirectToForgotPassword() {
        let forgotPasswordURL = 'https://app.storj.io/password-reset';
        Linking.openURL(forgotPasswordURL);
    }

    redirectToMnemonicInfo() {
        // let mnemonicInfoURL = '';
        // Linking.openURL(mnemonicInfoURL);
    }

	render() {
		return(
            <LoginComponent
                isLoading = { this.state.isLoading }
                email = { this.state.stateModel.email }
                password = { this.state.stateModel.password }
                mnemonic = { this.state.stateModel.mnemonic }
                isRedirectedFromRegister = { this.props.user.isRedirectedFromRegister }
                isEmailError = { this.state.errorModel.isEmailError }
                isPasswordError = { this.state.errorModel.isPasswordError }
                isMnemonicError = { this.state.errorModel.isMnemonicError }
                onChangeLogin = { this.onChangeEmailInput.bind(this) }
                onChangePassword = { this.onChangePasswordInput.bind(this) }
                onChangeMnemonic = { this.onChangeMnemonicInput.bind(this) }
                redirectToForgotPassword = { this.redirectToForgotPassword.bind(this) }
                redirectToMnemonicInfo = { this.redirectToMnemonicInfo.bind(this) }
                onSubmit = { this.tryLogin.bind(this) }
                redirectToQRScannerScreen = { this.redirectToQRScannerScreen.bind(this) }
                registerButtonOnPress = { this.redirectToRegisterScreen.bind(this) }
            />
		);
	};
}

/**
 * connecting reducer to component props 
 */
function mapStateToProps(state) { return { user: state.authReducer.user }; };
function mapDispatchToProps(dispatch) { 
    return bindActionCreators({
            setAccountNotExist,
            setAccountExist,
            setEmailNotConfirmed,
            setEmailConfirmed,
            loginSuccess,
            loginError,
            login,
            navigateToRegisterScreen,
            redirectToAuthFailureScreen,
            redirectToMainScreen,
            redirectToInitializeScreen,
            redirectToQRScannerScreen}, dispatch);
};

/**
 * Creating LoginScreen container
 */
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);

/**
 * Checking LoginContainer correct prop types
 */
LoginContainer.propTypes = {
    user: PropTypes.shape({
        isLoggedIn: PropTypes.bool,
        email: PropTypes.string,
        password: PropTypes.string,
        mnemonic: PropTypes.string,
        isLoading: PropTypes.bool,
        error: PropTypes.string
    })
};
