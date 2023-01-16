import React, {Component} from 'react';
import {StyleSheet} from 'react-native';
import {Icon} from "native-base";
import {AlertUtil} from "../utilities";

export default class FingerPrint extends Component<Props> {

    render() {
        if (this.props.biometryType === 'FaceID') {
            return (
                <Icon onPress={() => this.props.isEnabled ? this.clickHandler() : null} active
                      type="AntDesign" name="scan1"
                      style={this.props.isEnabled ? [loginStyles.inputIcon, {color: '#3fb2fe'}] : loginStyles.inputIcon}/>
            );
        } else if (this.props.biometryType === 'TouchID' || this.props.biometryType === 'Fingerprint') {
            return (
                <Icon onPress={() => this.props.isEnabled ? this.clickHandler() : null} active
                      type="Ionicons" name="ios-finger-print"

                      style={this.props.isEnabled ? [loginStyles.inputIcon, {color: '#3fb2fe'}] : loginStyles.inputIcon}/>
            );
        }
    }

    /**
     * Function for authenticating FaceID/TouchID
     * @returns {Promise|*|Promise.<T>}
     */
    authenticate = () => {
        return this.props.touchIdLib.authenticate()
            .then(success => {
                this.props.biometricsLogin();
            })
            .catch(error => {
                console.log(error);
                console.log(error.name);
                if (error.name === 'RCTTouchIDUnknownError') {
                    this.props.resetBiometrics(); //reset credentials in case of 3 unsuccessful attempts

                    AlertUtil.showErrorMessage(''+this.props.biometryType+' Disabled : Please verify your '+this.props.biometryType+' using pass code in device settings !');
                }else if(error.name === 'LAErrorTouchIDNotEnrolled'){
                    this.props.resetBiometrics(); //reset credentials in case of 3 unsuccessful attempts
                    AlertUtil.showErrorMessage('Authentication could not start because '+this.props.biometryType+' has not enrolled.');
                }else if(error.name === 'LAErrorTouchIDNotAvailable'){
                    this.props.resetBiometrics(); //reset credentials if FaceID/TouchID is disabled on device
                    AlertUtil.showErrorMessage('Authentication could not start because '+this.props.biometryType+' is disabled on device.');
                }
            });
    };

    /**
     * Handling click function of FaceID/TouchID
     */
    clickHandler = () => {
        this.props.touchIdLib.isSupported()
            .then(this.authenticate)
            .catch(error => {
                AlertUtil.showErrorMessage('TouchID not supported');
            });
    }
}
const loginStyles = StyleSheet.create({
    inputIcon: {
        top: -42,
        paddingRight: 0,
        fontSize: 30,
        width: 30,
        alignSelf: 'flex-end',
        marginBottom: -30
    }
});
