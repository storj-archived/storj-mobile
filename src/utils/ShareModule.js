import { NativeModules } from "react-native";

export default class ShareModule {
    static share(url) {
        console.log(url);
        NativeModules.ShareModule2.share(url);
    }
}