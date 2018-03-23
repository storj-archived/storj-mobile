'use strict';

const {NativeModules} = require('react-native')
const sha256Module = NativeModules.sha256;

export function sha256(data) {    
  return sha256Module.sha256(data);
}
