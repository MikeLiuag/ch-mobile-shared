import React, {Component} from 'react';
import {Button, Header, Container, Content, Left, Right, Title, Body, Form, Input, Item, Label, Text} from 'native-base';
import {Keyboard, StatusBar, StyleSheet, Platform, TouchableWithoutFeedback} from 'react-native';
import {addTestID,AlertUtil, getHeaderHeight} from '../../utilities';
import {Colors, TextStyles} from '../../styles';
import AntIcon from "react-native-vector-icons/AntDesign";
import Loader from "../Loader";
import {PASSWORD_REGEX} from '../../constants';
const HEADER_SIZE = getHeaderHeight();


export class ChangePasswordComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            currentPasswordFocus: false,
            hasCurrentPasswordError: null,
            newPasswordFocus: false,
            hasNewPasswordError: null,
            confirmPasswordFocus: false,
            hasConfirmPasswordError: null,
        };

        this.form = {
            currentPasswordField: '',
            newPasswordField: '',
            confirmPasswordField: '',
            submitBtn: null
        };
    }

    /**
     * @function validateCurrentPassword
     * @description This method is used to validate current password.
     */

    validateCurrentPassword = () => {
        const {currentPassword} = this.state;
        this.setState({currentPasswordFocus: false});
        let hasCurrentPasswordError = false;
        if (currentPassword === null || currentPassword === '') {
            hasCurrentPasswordError = true;
        }
        this.setState({hasCurrentPasswordError});

        return !hasCurrentPasswordError;
    };


    /**
     * @function validateNewPassword
     * @description This method is used to validate new password.
     */
    validateNewPassword = () => {
        const {newPassword} = this.state;
        this.setState({newPasswordFocus: false});
        let hasNewPasswordError = false;
        if (newPassword === null || newPassword === '') {
            hasNewPasswordError = true;
        } else if (newPassword && newPassword !== '') {
            hasNewPasswordError = !PASSWORD_REGEX.test(newPassword);
        }
        this.setState({hasNewPasswordError});
        return !hasNewPasswordError;
    };

    /**
     * @function validateConfirmPassword
     * @description This method is used to validate confirm password
     */
    validateConfirmPassword = () => {
        const {confirmPassword} = this.state;
        this.setState({confirmPasswordFocus: false});
        let hasConfirmPasswordError = false;
        if (confirmPassword === null || confirmPassword === '') {
            hasConfirmPasswordError = true;
        } else if (confirmPassword && confirmPassword !== '') {
            hasConfirmPasswordError = !PASSWORD_REGEX.test(confirmPassword);
        }
        this.setState({hasConfirmPasswordError});
        return !hasConfirmPasswordError;
    };


    /**
     * @function isFormValid
     * @description This method is used to validate form.
     */
    isFormValid = () => {
        const {currentPassword,newPassword,confirmPassword} = this.state;
        if (!currentPassword && !newPassword && !confirmPassword) {
            AlertUtil.showErrorMessage('All fields are required');
            return false;
        }
        else if (!currentPassword) {
            let currentPasswordErrorMsg = "Current password is required";
            this.setState({currentPasswordErrorMsg});
            return false;
        }
        else if (!newPassword) {
            let newPasswordErrorMsg = "New password is required";
            this.setState({newPasswordErrorMsg});
            return false;
        }
        else if (!confirmPassword) {
            let confirmPasswordErrorMsg = "Confirm password is required";
            this.setState({confirmPasswordErrorMsg});
            return false;
        }
        else if(newPassword !== confirmPassword){
            let hasConfirmPasswordError = true;
            let confirmPasswordErrorMsg = "New password and confirm password does not match";
            this.setState({confirmPasswordErrorMsg,hasConfirmPasswordError});
            return false;
        }
        else {
            if (!this.validateCurrentPassword()) {
                AlertUtil.showErrorMessage('Current password is invalid');
                return false;
            }
            if (!this.validateNewPassword()) {
                AlertUtil.showErrorMessage('New password is invalid');
                return false;
            }
            if (!this.validateConfirmPassword()) {
                AlertUtil.showErrorMessage('Confirm password is invalid');
                return false;
            }
        }
        return true;
    };


    /**
     * @function changePassword
     * @description This method is used to update password.
     */
    changePassword = () => {
        const {currentPassword,newPassword,confirmPassword} = this.state;
        Keyboard.dismiss();
        if (this.isFormValid()) {
            this.props.changePassword({confirmPassword, currentPassword, newPassword});
        }

    }

    render() {
        if (this.props.isLoading) {
            return (
                <Loader/>
            )
        }
        const {currentPassword,newPassword,confirmPassword,currentPasswordFocus,hasCurrentPasswordError,
            currentPasswordErrorMsg,newPasswordFocus,hasNewPasswordError, newPasswordErrorMsg,confirmPasswordFocus,
            hasConfirmPasswordError,confirmPasswordErrorMsg} = this.state;
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container>
                    <Header noShadow transparent style={styles.settingHeader}>
                        <StatusBar
                            backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                            translucent
                            barStyle={'dark-content'}
                        />
                        <Left>
                            <Button
                                {...addTestID('back')}
                                transparent
                                style={styles.backButton}
                                onPress={() => {
                                    this.props.backClicked();
                                }}
                            >
                                <AntIcon name="close" size={25} color={Colors.colors.blue3}/>
                            </Button>
                        </Left>
                        <Body style={Platform.OS === 'ios' ? { flex: 2 } : { flex: 2, paddingLeft: 20}}>
                            <Title style={styles.settingTitle}>Change Password</Title>
                        </Body>
                        <Right>
                            <Button
                                {...addTestID('change-password')}
                                transparent
                                style={styles.saveBtn}
                                onPress={this.changePassword}
                                ref={btn => {
                                    this.form.submitBtn = btn;
                                }}
                            >
                                <Text style={styles.saveText} uppercase={false}>Save</Text>
                            </Button>
                        </Right>
                    </Header>
                    <Content style={styles.wrapper}>
                        <Text style={styles.resetMain}>Create new password</Text>
                        <Text style={styles.resetSub}>Your password must be 8 characters long, contain at least one numeric, one special character & a mixture of upper & lowercase letters.</Text>
                        <Form>
                            <Item
                                floatingLabel
                                style={currentPasswordFocus ? [styles.inputFields, {borderColor: Colors.colors.blue3}] : styles.inputFields}
                                error={hasCurrentPasswordError}
                                success={hasCurrentPasswordError === false}>
                                <Label
                                    style={hasCurrentPasswordError || currentPasswordErrorMsg ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {currentPasswordErrorMsg ? currentPasswordErrorMsg : (!hasCurrentPasswordError ? 'Enter your current password' : 'Incorrect Password')}
                                </Label>
                                <Input
                                    {...addTestID('current-password-input')}
                                    style={styles.inputBox}
                                    onBlur={this.validateCurrentPassword}
                                    onFocus={() => {
                                        this.setState({currentPasswordFocus: true});
                                    }}
                                    returnKeyType="next"
                                    secureTextEntry={true}
                                    getRef={field => {
                                        this.form.currentPasswordField = field;
                                    }}
                                    onSubmitEditing={() => {
                                        this.form.newPasswordField._root.focus();
                                    }}
                                    textContentType="password"
                                    value={currentPassword}
                                    onChangeText={passwordValue => {
                                        let currentPassword = null;
                                        if (passwordValue !== '') {
                                            currentPassword = passwordValue;
                                        }
                                        this.setState({
                                            hasCurrentPasswordError: null,
                                            currentPasswordErrorMsg: null,
                                            currentPassword: currentPassword
                                        });
                                    }}

                                />
                            </Item>

                            <Item
                                floatingLabel
                                style={newPasswordFocus ? [styles.inputFields, {borderColor: Colors.colors.blue3}] : styles.inputFields}
                                error={hasNewPasswordError}
                                success={hasNewPasswordError === false}>
                                <Label
                                    style={hasNewPasswordError || newPasswordErrorMsg ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {newPasswordErrorMsg ? newPasswordErrorMsg : (!hasNewPasswordError ? 'Enter new password' : 'Incorrect Password')}
                                </Label>
                                <Input
                                    {...addTestID('new-password-input')}
                                    style={styles.inputBox}
                                    onBlur={this.validateNewPassword}
                                    onFocus={() => {
                                        this.setState({newPasswordFocus: true});
                                    }}
                                    returnKeyType="next"
                                    secureTextEntry={true}
                                    getRef={field => {
                                        this.form.newPasswordField = field;
                                    }}
                                    onSubmitEditing={() => {
                                        this.form.confirmPasswordField._root.focus();
                                    }}
                                    textContentType="password"
                                    value={newPassword}
                                    onChangeText={passwordValue => {
                                        let newPassword = null;
                                        if (passwordValue !== '') {
                                            newPassword = passwordValue;
                                        }
                                        this.setState({
                                            hasNewPasswordError: null,
                                            newPasswordErrorMsg: null,
                                            newPassword: newPassword
                                        });
                                    }}
                                />
                            </Item>

                            <Item
                                floatingLabel
                                style={confirmPasswordFocus ? [styles.inputFields, {borderColor: Colors.colors.blue3}] : styles.inputFields}
                                error={hasConfirmPasswordError}
                                success={hasConfirmPasswordError === false}>
                                <Label
                                    style={hasConfirmPasswordError || confirmPasswordErrorMsg ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {confirmPasswordErrorMsg ? confirmPasswordErrorMsg : (!hasConfirmPasswordError ? 'Repeat new password' : 'Incorrect Password')}
                                </Label>
                                <Input
                                    {...addTestID('validate-confirm-password-input')}
                                    style={styles.inputBox}
                                    onBlur={this.validateConfirmPassword}
                                    onFocus={() => {
                                        this.setState({confirmPasswordFocus: true});
                                    }}
                                    returnKeyType="next"
                                    secureTextEntry={true}
                                    getRef={field => {
                                        this.form.confirmPasswordField = field;
                                    }}
                                    onSubmitEditing={() => {
                                        this.form.submitBtn.props.onPress();
                                    }}
                                    textContentType="password"
                                    value={confirmPassword}
                                    onChangeText={passwordValue => {
                                        let confirmPassword = null;
                                        if (passwordValue !== '') {
                                            confirmPassword = passwordValue;
                                        }
                                        this.setState({
                                            hasConfirmPasswordError: null,
                                            confirmPasswordErrorMsg: null,
                                            confirmPassword: confirmPassword
                                        });
                                    }}
                                />
                            </Item>

                        </Form>
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        );
    }
}

const styles = StyleSheet.create({
    settingHeader: {
        height: HEADER_SIZE,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        paddingLeft: 0
    },
    settingTitle: {
        ...TextStyles.mediaTexts.TextH7,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.darkBlue,
        textAlign: 'center'
    },
    backButton: {
        marginLeft: 15,
        width: 45,
    },
    saveBtn: {
        marginRight: 0,
        paddingRight: 12
    },
    saveText: {
        color: Colors.colors.blue3,
        ...TextStyles.mediaTexts.TextH7,
        ...TextStyles.mediaTexts.manropeBold,
        textAlign: 'center'
    },
    wrapper: {
        paddingRight: 24,
        paddingLeft: 10,
    },
    resetMain: {
        color: Colors.colors.darkBlue,
        ...TextStyles.mediaTexts.TextH7,
        ...TextStyles.mediaTexts.manropeBold,
        paddingLeft: 15,
        marginTop: 20,
        marginBottom: 8
    },
    resetSub: {
        color: Colors.colors.lightText2,
        ...TextStyles.mediaTexts.TextH7,
        ...TextStyles.mediaTexts.manropeRegular,
        paddingLeft: 15,
        marginBottom: 15
    },
    inputFields: {
        ...TextStyles.mediaTexts.TextH7,
        ...TextStyles.mediaTexts.manropeRegular,
        color: Colors.colors.darkBlue,
        marginBottom: 5,
        elevation: 0,
        borderBottomWidth: 1
    },
    inputLabel: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.inputLabel,
        color: Colors.colors.inputPlaceholder,
        paddingLeft: 0,
    },
    inputBox: {
        color: Colors.colors.inputValue,
        height: 55,
        fontSize: 15,
        paddingLeft: 0
    },
});
