'use strict';

const {NativeModules, Platform} = require('react-native')
const sha256Module = Platform.OS === "android" ? NativeModules.sha256 : NativeModules.Sha256ModuleIOS;

export function sha256(data) {

  return sha256Module.sha256(data);
}
