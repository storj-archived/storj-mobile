import StorjLib from '../utils/StorjModule';
import { StackNavigator } from 'react-navigation';
import InitializationScreen from '../containers/InitializeContainer';
import OnBoardingScreen from '../components/OnBoardingComponent';
import RegisterScreen from '../containers/RegisterContainer';
import LoginScreen from '../containers/LoginContainer';
import MainScreen from '../containers/MainContainer';
import AuthFailureInfoScreen from '../components/AuthFailureComponent';
import RegisterSuccessInfoScreen from '../components/RegisterSuccessComponent';
import TermsOfUseScreen from '../components/TermsOfUseComponent';
import MnemonicGenerationScreen from '../components/Mnemonic/MnemonicGenerationComponent';
import QRScannerScreen from '../containers/QRScannerContainer';
import ImageViewerScreen from '../containers/ImageViewerContainer';
import MnemonicInfoScreen from '../components/Mnemonic/MnemonicInfoComponent';
import MnemonicConfirmationScreen from '../components/Mnemonic/MnemonicConfirmationComponent';
import MnemonicConfirmedScreen from '../components/Mnemonic/MnemonicConfirmedComponent';
import MnemonicNotConfirmedScreen from '../components/Mnemonic/MnemonicNotConfirmedComponent';
import MnemonicHelpScreen from '../components/Mnemonic/MnemonicHelpComponent';

/**
 * Creating program main navigator
 */
const StackNav = StackNavigator(
    {
        InitializationScreen: {
            screen: InitializationScreen,
            routeName: 'InitializationScreen'
        },
        OnBoardingScreen: {
            screen: OnBoardingScreen,
            routeName: 'OnBoardingScreen'
        },
        LoginScreen: {
            screen: LoginScreen,
            routeName: 'LoginScreen'
        },
        RegisterScreen: {
            screen: RegisterScreen,
            routeName: 'RegisterScreen'
        },
        MainScreen: {
            screen: MainScreen,
            routeName: 'MainScreen'
        },
        AuthFailureInfoScreen: {
            screen: AuthFailureInfoScreen,
            routeName: 'AuthFailureInfoScreen'
        },
        RegisterSuccessInfoScreen: {
            screen: RegisterSuccessInfoScreen,
            routeName: 'RegisterSuccessInfoScreen'
        },
        TermsOfUseScreen: {
            screen: TermsOfUseScreen,
            routeName: 'TermsOfUseScreen'
        },
        MnemonicInfoScreen: {
            screen: MnemonicInfoScreen,
            routeName: 'MnemonicInfoScreen'
        },
        MnemonicGenerationScreen: {
            screen: MnemonicGenerationScreen,
            routeName: 'MnemonicGenerationScreen'
        },
        QRScannerScreen: {
            screen: QRScannerScreen,
            routeName: 'QRScannerScreen'
        },
        ImageViewerScreen: {
            screen: ImageViewerScreen,
            routeName: "ImageViewerScreen"
        },
        MnemonicConfirmationScreen: {
            screen: MnemonicConfirmationScreen,
            routeName: 'MnemonicConfirmationScreen'
        },
        MnemonicConfirmedScreen: {
            screen: MnemonicConfirmedScreen,
            routeName: 'MnemonicConfirmedScreen'
        },
        MnemonicNotConfirmedScreen: {
            screen: MnemonicNotConfirmedScreen,
            routeName: 'MnemonicNotConfirmedScreen'
        },
        MnemonicHelpScreen: {
            screen: MnemonicHelpScreen,
            routeName: 'MnemonicHelpScreen'
        }
    },
    {
        headerMode: 'none',
        initialRouteName: 'InitializationScreen',
        navigationOptions: {
            header:null,
            gesturesEnabled: false
        },
        cardStyle: { 
            backgroundColor: "transparent", 
            opacity: 1,
            shadowRadius: 0
        },
        transitionConfig: () => {
            containerStyle: {
                backgroundColor: "transparent"
            }
        }
    }
);

export default StackNav;

