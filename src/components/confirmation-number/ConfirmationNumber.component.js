import React, {Component} from 'react';
import {Keyboard, Platform, StatusBar, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {Button, Container, Content, Text, View} from 'native-base';
import {Colors} from '../../styles';
import GradientButton from '../../components/GradientButton';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import AlfieLoader from '../../components/Loader';
import Analytics from '@segment/analytics-react-native';
import {VerificationCodeComponent} from '../verification-code/VerificationCode.component'
import {AlertUtil,addTestID} from "../../utilities";
import {VERIFICATION_CODE_TYPE} from '../../constants';

export class ConfirmationNumberComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            code: ''
        };
        this.verificationCodeComponent = null;
        this.email = this.props.email;
        this.codeType = this.props.codeType;
        this.phoneNumber = this.props.phoneNumber;
    }

    componentWillUnmount(): void {
        if(!this.props.auth.isAuthenticated) {
            this.props.resetAuth();
        }
    }

    backClicked = () => {
        this.props.backClicked();
    };

    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (!this.props.auth.isLoading) {
            if (this.props.auth.error) {
                AlertUtil.showErrorMessage(this.props.auth.errorMsg, this.props.clearErrors);
            } else {
                if (this.codeType === VERIFICATION_CODE_TYPE.ONE_TIME_PASSWORD) {
                    if (this.props.auth.isAuthenticated) {
                        Analytics.track('Member Authentication - Login OTP Successfully Verified', {});
                        Analytics.identify(this.props.auth.data.userId, {
                            name: this.props.auth.data.nickName,
                            isFirstTimeSignUp: !this.props.auth.data.isOnboarded
                        });
                        this.props.navigateToPatientOnBoardingScreen({
                            isOnboarded: this.props.auth.data.isOnboarded,
                            data: this.props.auth.data
                        });
                    }
                } else if(this.props.auth.codeVerified) {
                    if(this.codeType === VERIFICATION_CODE_TYPE.ACCOUNT_VERIFICATION) {
                        Analytics.track('Member Authentication - Sign Up OTP Successfully Verified', {});
                        AlertUtil.showSuccessMessage('Account verified successfully');
                        this.props.resetAction();
                    } else if (this.codeType === VERIFICATION_CODE_TYPE.PASSWORD_RECOVERY) {
                        Analytics.track('Member Authentication - Password Recovery Code Successfully Verified', {});
                        AlertUtil.showSuccessMessage('Code verification successful');
                        this.props.navigateToNewPasswordScreen({
                            email: this.email,
                            recoveryCode: this.state.code
                        });
                    }
                }

            }
        }
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <Container style={confirmStyles.wrapper}>
                <StatusBar backgroundColor='transparent' translucent={false} animated showHideTransition="slide"/>
                <View style={confirmStyles.headerBox}>
                    <Button
                        {...addTestID('Back')}
                        onPress={this.backClicked} transparent style={confirmStyles.backButton} >
                        <AwesomeIcon name="angle-left" size={32} color="#3fb2fe" />
                    </Button>
                    <Text style={confirmStyles.heading}>{this.email?"Confirm Email ":"Confirm Number "}</Text>
                </View>
                <Content style={confirmStyles.contentSection}>
                    <Text style={confirmStyles.disclaimer}>
                        Please enter the 4-digit verification code we sent to your email/number.{' '}
                    </Text>
                    <VerificationCodeComponent context={{
                        emailOrPhone: this.email
                            ? this.email
                            : this.phoneNumber,
                        verificationCodeType: this.codeType
                    }} submit={this.verifyCode} ref={r=>this.verificationCodeComponent=r}
                     resendVerificationCode={this.props.resendVerificationCode}
                    />
                </Content>
                <View style={confirmStyles.submitBtn}>
                    <GradientButton
                        {...addTestID('submit-btn')}
                        onPress={()=>{this.verificationCodeComponent.submit();}} text="Submit" />
                </View>
                {
                    this.props.auth.isLoading?
                        <AlfieLoader /> : null
                }
            </Container>
            </TouchableWithoutFeedback>
        );
    }

    verifyCode = async (code) => {
        this.setState({code});
        const verifyConfirmationCode = {
            emailOrPhone: this.email
                ? this.email
                : this.phoneNumber,
            codeType: this.codeType,
            code,
            userType: this.props.userType
        };
        this.props.verifyCode({
            ...verifyConfirmationCode
        });
    };
}

const confirmStyles = StyleSheet.create({
    wrapper: {
        paddingLeft: 23,
        paddingRight: 23,
        marginTop: Platform.OS == 'ios' ? 20 : 0
    },
    headerBox: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 10
    },
    backButton: {
        width: 45
    },
    contentSection: {
        paddingRight: 20,
        paddingLeft: 20
    },
    heading: {
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        fontWeight: '600',
        color: Colors.colors.darkBlue,
        flex: 0.8
    },
    disclaimer: {
        fontFamily: 'Roboto-Regular',
        color: '#757682',
        fontSize: 15,
        lineHeight: 20,
        textAlign: 'center',
        marginBottom: 10,
        padding: 30
    },
    inputFields: {
        marginBottom: 20,
        paddingLeft: 30,
        borderRadius: 6,
        elevation: 0
    },
    fieldLabels: {
        fontFamily: 'Roboto-Regular',
        color: Colors.colors.darkBlue,
        fontSize: 14
    },
    submitBtn: {
        alignSelf: 'center',
        marginBottom: 30,
        paddingLeft: 15,
        paddingRight: 15
    }
});
