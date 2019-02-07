import { Dimensions} from 'react-native';

const design = {
    height: 667,
    width: 375,
    deviceHeight: Dimensions.get('window').height,
    deviceWidth: Dimensions.get('window').width,
};

export const statusBarHeightIos = 20;

export function getDeviceWidth() {
    return design.deviceWidth;
};

export function getDeviceHeight() {
    return design.deviceHeight;
};

export function getWidth(elementWidth) {
    let ratio = elementWidth/design.width;

    return Math.round(design.deviceWidth * ratio);
};

export function getHeight(elementHeight) {
    let ratio = elementHeight/design.height;

    return Math.round(design.deviceHeight * ratio);
};