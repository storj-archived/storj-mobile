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

/**
 * Navigation action that provides navigation to MnemonicHelpScreen
 */
export function redirectToMnemonicHelpScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MnemonicHelpScreen'})
        ]
    });
};

export function navigateToFilesScreen(bucketId) {
    return NavigationActions.navigate({ routeName: 'FilesScreen', params: { bucketId } });
}

export function openImageViewer(fileId, bucketId, fileName) {
    return NavigationActions.navigate({ routeName: 'ImageViewerScreen', params: { fileId, bucketId, fileName } });
}

export function openFilePreview(fileId, bucketId, fileName) {
    return NavigationActions.navigate({ routeName: 'FilePreviewScreen', params: { fileId, bucketId, fileName } });
}

export function openSelectBucketScreen(callback) {
    return NavigationActions.navigate({ routeName: 'SelectBucketScreen', params: { callback } });
}

export function navigateBack() {
    return NavigationActions.back();
}

export function dashboardNavigateBack() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'DashboardDefaultScreen'})
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

export function navigateToDashboardFilesScreen(bucketId) {
    return NavigationActions.navigate({ routeName: 'DashboardFilesScreen', params: { bucketId } });
}

export function redirectToBalanceScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'BalanceScreen'})
        ]
    });
}

export function redirectToChangePasswordScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'ChangePasswordScreen'})
        ]
    });
}

export function redirectToSettingsScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'SettingsScreen'})
        ]
    });
}

export function redirectToPinCodeGenerationScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'PinCodeGenerationScreen'})
        ]
    });
}

export function redirectToStorageScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'StorageScreen'})
        ]
    });
}

export function redirectToMyAccountScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MyAccountMainPageScreen'})
        ]
    });
}

export function redirectToFavoriteBucketsScreen(itemType) {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'FavoriteBucketsScreen', params: { itemType }})
        ]
    });
}

export function redirectToFavoriteFilesScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'FavoriteFilesScreen' })
        ]
    });
}

export function redirectToRecentSyncFilesScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({ routeName: 'RecentSyncFilesScreen' })
        ]
    });
}

export function redirectToMyAccountMnemonicScreen() {
    return NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'MyAccountMnemonicScreen' })
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
    redirectToFavoriteBucketsScreen,
    redirectToFavoriteFilesScreen,
    navigateBack
}

export const myAccountNavigationActions = {
    redirectToMyAccountScreen,
    redirectToBalanceScreen,
    redirectToChangePasswordScreen,
    redirectToPinCodeGenerationScreen,
    redirectToSettingsScreen,
    redirectToStorageScreen,
    redirectToMyAccountMnemonicScreen,
    navigateBack
}