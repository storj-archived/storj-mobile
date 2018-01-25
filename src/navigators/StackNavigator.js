import StorjLib from '../utils/StorjModule';
import { StackNavigator } from 'react-navigation';
import InititializationScreen from '../containers/InitializeContainer';
import OnBoardingScreen from '../components/OnBoardingComponent';
import RegisterScreen from '../containers/RegisterContainer';
import LoginScreen from '../containers/LoginContainer';
import MainScreen from '../containers/MainContainer';
import AuthFailureInfoScreen from '../components/AuthFailureComponent';
import RegisterSuccessInfoScreen from '../components/RegisterSuccessComponent';
import TermsOfUseScreen from '../components/TermsOfUseComponent';
import MnemonicGenerationScreen from '../components/MnemonicGenerationComponent';

/**
 * Creating program main navigator
 */
const StackNav = StackNavigator(
    {
        InititializationScreen: {
            screen: InititializationScreen,
            routeName: 'InititializationScreen'
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
        MnemonicGenerationScreen: {
            screen: MnemonicGenerationScreen,
            routeName: 'MnemonicGenerationScreen'
        }
    },
    {
        headerMode: 'none',
        initialRouteName: 'InititializationScreen'
    }
);

export default StackNav;

