import { NavigationActions } from 'react-navigation';

export function redirectToOnBoardingScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'OnBoardingScreen'})
        ]
    });
};

export function redirectToLoginScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen'})
        ]
    });
};

export function redirectToMainScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MainScreen'})
        ]
    });
};

export function redirectToInitializationScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'InitializationScreen'})
        ]
    });
};

export function redirectToMnemonicGenerationScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MnemonicGenerationScreen'})
        ]
    });
};

export function redirectToMnemonicInfoScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MnemonicInfoScreen'})
        ]
    });
};

export function redirectToMnemonicConfirmedScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MnemonicConfirmedScreen'})
        ]
    });
};

export function redirectToMnemonicNotConfirmedScreen(setNewData) {
    return NavigationActions.navigate({ routeName: 'MnemonicNotConfirmedScreen', params: { setNewData } })
};

export function redirectToMnemonicConfirmationScreen(mnemonic) {
    return NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'MnemonicConfirmationScreen', params: { mnemonic } })
        ]
    });
};

export function redirectToRegisterSuccessScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'RegisterSuccessInfoScreen'})
        ]
    });
};

export function redirectToRegisterScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'RegisterScreen'})
        ]
    });
};

export function navigateToFilesScreen(bucketId) {
    return NavigationActions.navigate({ routeName: 'FilesScreen', params: { bucketId } });
}

export function openImageViewer(fileId, localPath, bucketId) {
    return NavigationActions.navigate({ routeName: 'ImageViewerScreen', params: { fileId, localPath, bucketId } });
}

export function navigateBack() {
    return NavigationActions.back();
}

export function dashboardNavigateBack() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'DashboardScreen'})
        ]
    });
}

export function bucketNavigateBack() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'BucketsListScreen'})
        ]
    });
}


export const authNavigationActions = {
    redirectToLoginScreen,
    redirectToMainScreen,
    redirectToMnemonicConfirmationScreen,
    redirectToMnemonicConfirmedScreen,
    redirectToMnemonicGenerationScreen,
    redirectToMnemonicInfoScreen,
    redirectToMnemonicNotConfirmedScreen,
    redirectToRegisterScreen,
    redirectToRegisterSuccessScreen,
    navigateBack
}