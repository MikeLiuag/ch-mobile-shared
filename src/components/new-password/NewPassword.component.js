import React, {Component} from 'react';
import {Platform, StatusBar, StyleSheet} from 'react-native';
import {Button, Container, Content, Form, Input, Item, Label, View} from 'native-base';
import {Colors} from '../../styles';
import GradientButton from '../../components/GradientButton';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import HeaderAlfie from '../../components/HeaderAlfie';
import AlfieLoader from '../../components/Loader';
import {AlertUtil,addTestID} from "../../utilities";

export class NewPasswordComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            newPassword: '',
            confirmPassword: '',
            hasPasswordError: null,
            hasConfirmPasswordError: null,
            isLoading: false,
            passwordFocus: false,
            conformPasswordFocus: false,
        };
        this.form = {
            newPassword: null,
            confirmPassword: null
        };
        this.email = this.props.email;
        this.recoveryCode = this.props.recoveryCode;
    }

    backClicked = () => {
        this.props.backClicked();
    };

    validatePassword = () => {
        this.setState({passwordFocus: false});
        let hasPasswordError = false;
        if (!this.state.newPassword || this.state.newPassword === '') {
            hasPasswordError = true;
        }
        // Can have max length validations here.x
        this.setState({hasPasswordError});
        return !hasPasswordError;
    };

    validateConfirmPassword = () => {
        this.setState({confirmPasswordFocus: false});
        let hasConfirmPasswordError = false;
        if (!this.state.confirmPassword || this.state.confirmPassword === '') {
            hasConfirmPasswordError = true;
        }
        // Can have max length validations here.x
        this.setState({hasConfirmPasswordError});
        return !hasConfirmPasswordError;
    };

    updatePassword = async () => {
        if (!this.validatePassword()) {
            AlertUtil.showErrorMessage('Invalid New Password');
        } else if (!this.validateConfirmPassword()) {
            AlertUtil.showErrorMessage('Invalid Confirm Password');
        } else if (this.state.newPassword !== this.state.confirmPassword) {
            AlertUtil.showErrorMessage('Both passwords must match');
        } else {
            this.props.updatePassword({
                email: this.email,
                newPassword: this.state.newPassword,
                confirmPassword: this.state.confirmPassword,
                code: this.recoveryCode,
                userType: this.props.userType
            });
        }


    };

    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);

        if(this.props.auth.isLoading){
            return <AlfieLoader />
        }else{
            if (this.props.auth.error) {
                AlertUtil.showErrorMessage(this.props.auth.errorMsg, this.props.clearErrors);
            } else if (this.props.auth.passwordUpdated) {
                AlertUtil.showSuccessMessage('Password updated successfully');
                this.props.resetAction();
            }
        }
        return (
            <Container style={passwordStyles.wrapper}>
                <StatusBar backgroundColor="#fff" translucent={false} barStyle={'dark-content'} showHideTransition="slide"/>
                <View>
                    <Button
                        {...addTestID('back')}
                        onPress={this.backClicked} transparent style={passwordStyles.backButton}>
                        <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                    </Button>
                </View>

                <HeaderAlfie />
                <Content>
                    <Form>
                        <Item
                            floatingLabel
                            style={this.state.passwordFocus? [passwordStyles.inputFields, { borderColor: '#3fb2fe' }] : passwordStyles.inputFields}
                            error={this.state.hasPasswordError}
                            success={this.state.hasPasswordError === false}>
                            <Label style={ this.state.hasPasswordError? [passwordStyles.inputLabel, { color : Colors.colors.lightRed}] : passwordStyles.inputLabel}>
                                {this.state.hasPasswordError? 'Invalid Password' : 'New Password' }
                            </Label>
                            <Input
                                {...addTestID('password-input')}
                                style={passwordStyles.inputBox}
                                clearTextOnFocus={false}
                                onBlur={this.validatePassword}
                                onFocus={()=>{this.setState({passwordFocus: true}); }}
                                textContentType="password" returnKeyType="next"
                                secureTextEntry={true}
                                ref={(field) => {
                                    this.form.newPassword = field;
                                }}
                                onSubmitEditing={() => {
                                    this.form.confirmPassword._root.focus();
                                }}
                                onChangeText={(newPassword) => {
                                    this.setState({newPassword});
                                }}/>
                        </Item>
                        <Item
                            floatingLabel
                            style={this.state.confirmPasswordFocus? [passwordStyles.inputFields, { borderColor: '#3fb2fe' }] : passwordStyles.inputFields}
                            error={this.state.hasConfirmPasswordError}
                            success={this.state.hasConfirmPasswordError === false}>
                            <Label style={ this.state.hasConfirmPasswordError? [passwordStyles.inputLabel, { color : Colors.colors.lightRed}] : passwordStyles.inputLabel}>
                                {this.state.hasConfirmPasswordError? 'Invalid Confirm Password' : 'Confirm Password' }
                            </Label>
                            <Input
                                {...addTestID('confirm-password-input')}
                                style={passwordStyles.inputBox}
                                clearTextOnFocus={false}
                                textContentType="password" returnKeyType="send"
                                secureTextEntry={true}
                                onBlur={this.validateConfirmPassword}
                                onFocus={()=>{this.setState({confirmPasswordFocus: true}); }}
                                ref={(field) => {
                                    this.form.confirmPassword = field;
                                }}
                                onSubmitEditing={() => {
                                    this.updatePassword();
                                }}
                                onChangeText={(confirmPassword) => {
                                    this.setState({confirmPassword});
                                }}/>
                        </Item>
                    </Form>

                    <View style={passwordStyles.submitBtn}>
                        <GradientButton
                            testId = "done"
                            onPress={this.updatePassword} text="Done"/>
                    </View>
                </Content>

            </Container>
        );
    }
}
const passwordStyles = StyleSheet.create({
    wrapper: {
        paddingRight: 32,
        paddingLeft: 23,
        marginTop: Platform.OS === 'ios' ? 20 : 0,
    },
    backButton: {
        marginTop: 10,
        paddingLeft: 6,
        width: 45,
    },
    inputFields: {
        fontFamily: 'Roboto-Regular',
        color: Colors.colors.darkBlue,
        marginBottom: 5,
        elevation: 0,
        borderBottomWidth: 1,
    },
    inputLabel: {
        fontFamily: 'Roboto-Regular',
        color: Colors.colors.inputPlaceholder,
        fontSize: 15,
        lineHeight: 16,
        paddingLeft: 0
    },
    inputBox: {
        color: Colors.colors.inputValue,
        height: 55,
        fontSize: 15,
        paddingLeft: 0
    },
    submitBtn: {
        alignSelf: 'center',
        marginTop: 20,
        paddingLeft: 15,
    },
    spinner: {
        alignSelf: 'center'
    }
});

