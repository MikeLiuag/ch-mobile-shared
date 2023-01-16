import React, {Component} from 'react';
import {StyleSheet, Platform, StatusBar, Keyboard, Linking} from 'react-native';
import AlfieLoader from './Loader';
import {Container, Text, Content, Form, Item, Input, Label,View} from 'native-base';
import FingerPrint from "./FingerPrint";
import GradientButton from "./GradientButton";
import {Colors} from '../styles';
import HeaderAlfie from "./HeaderAlfie";
import {EMAIL_REGEX} from '../constants';
import {addTestID, isIphoneX,AlertUtil} from "../utilities";

export class LoginComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            hasEmailError: null,
            hasPasswordError: null,
            isClicked: false,
            isLoading: false,
            emailFocus: false,
            passwordFocus: false,
            keychainStatus: null,
            keychainUser: null,
            keychainPass: null
        };
        this.form = {
            emailField: '',
            passwordField: '',
            submitBtn: ''
        };

    }


    render() {
        return (
            <Container style={loginStyles.wrapper}>
                <StatusBar backgroundColor="#fff" translucent={false} showHideTransition="slide"
                           barStyle={'dark-content'}/>
                <View style={loginStyles.headerBox}>

                    {/*{this.props.userType === 'PATIENT' && (*/}
                    {/*<Button*/}
                    {/*    {...addTestID('back')}*/}
                    {/*    transparent*/}
                    {/*    style={loginStyles.backButton}*/}
                    {/*    onPress={() => {*/}
                    {/*        this.props.backClicked();*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>*/}
                    {/*</Button>*/}
                    {/*)}*/}

                    <HeaderAlfie/>
                </View>

                <Content style={{ paddingRight: 32}}>
                    <Form>
                        <Item
                            floatingLabel
                            style={this.state.emailFocus ? [loginStyles.inputFields, {borderColor: '#3fb2fe'}] : loginStyles.inputFields}
                            error={this.state.hasEmailError}
                            success={this.state.hasEmailError === false}
                        >
                            <Label
                                style={this.state.hasEmailError ? [loginStyles.inputLabel, {color: Colors.colors.lightRed}] : loginStyles.inputLabel}>
                                {this.state.hasEmailError ? 'Incorrect Email' : 'Email'}
                            </Label>
                            <Input
                                {...addTestID('input-email-address')}
                                style={loginStyles.inputBox}
                                keyboardType="email-address"
                                getRef={field => {
                                    this.form.emailField = field;
                                }}

                                {...addTestID("login-input-email")}
                                onBlur={this.validateEmail}
                                onFocus={() => {
                                    this.setState({emailFocus: true});
                                }}
                                onSubmitEditing={() => {
                                    this.form.passwordField._root.focus();
                                }}
                                textContentType="emailAddress"
                                returnKeyType="next"
                                value={this.state.email}
                                onChangeText={emailAddress => {
                                    let email = null;
                                    if (emailAddress !== '') {
                                        email = emailAddress.trim();
                                    }
                                    this.setState({email, hasEmailError: null});
                                }}
                            />

                        </Item>

                        {this.props.biometryType ?
                            <FingerPrint isEnabled={this.props.biometryEnabled}
                                         touchIdLib={this.props.TouchID}
                                         biometricsLogin={this.props.verifyBiometricsLogin}
                                         biometryType={this.props.biometryType}
                                         resetBiometrics={this.props.resetCredentials}/>
                            : null}


                        <Item
                            floatingLabel
                            style={this.state.passwordFocus ? [loginStyles.inputFields, {borderColor: '#3fb2fe'}] : loginStyles.inputFields}
                            error={this.state.hasPasswordError}
                            success={this.state.hasPasswordError === false}
                        >
                            <Label
                                style={this.state.hasPasswordError ? [loginStyles.inputLabel, {color: Colors.colors.lightRed}] : loginStyles.inputLabel}>
                                {this.state.hasPasswordError ? "Invalid Password" : "Password"}
                            </Label>
                            <Input
                                {...addTestID('input-password')}
                                style={loginStyles.inputBox}
                                secureTextEntry={true}

                                {...addTestID("login-input-password")}
                                getRef={field => {
                                    this.form.passwordField = field;
                                }}
                                onSubmitEditing={() => {
                                    this.form.submitBtn.props.onPress();
                                }}
                                onBlur={this.validatePassword}
                                onFocus={() => {
                                    this.setState({passwordFocus: true});
                                }}
                                returnKeyType="send"
                                textContentType="password"
                                value={this.state.password}
                                onChangeText={passwordValue => {
                                    let password = null;
                                    if (password !== '') {
                                        password = passwordValue;
                                    }
                                    this.setState({
                                        hasPasswordError: null,
                                        password
                                    });
                                }}
                            />
                        </Item>
                    </Form>
                    <View style={loginStyles.forgotWrapper}>
                            <Text
                                {...addTestID("login-link-forgotpass")}
                                onPress={this.props.forgotPasswordClicked}
                                style={loginStyles.forgot}
                            >
                                {' '}
                                Forgot password?{' '}
                            </Text>
                        {
                            this.props.userType === 'PATIENT' && (
                                <Text

                                    {...addTestID("login-link-phone")}
                                    onPress={this.props.phoneLoginClicked} style={loginStyles.forgot}>
                                    {' '}
                                    Login with phone{' '}
                                </Text>
                            )
                        }

                    </View>
                    <View style={loginStyles.submitBtn}>
                        <GradientButton
                            testId = "login"
                            onPress={() => {
                                this.performLogin();
                            }}
                            text="LogIn"
                            ref={btn => {
                                this.form.submitBtn = btn;
                            }}
                        />
                    </View>
                </Content>
                {this.props.userType === 'PATIENT' && (
                    <View style={{...loginStyles.registerText, paddingRight: 28}}>
                        <Text
                              {...addTestID("magic-link")}
                              onPress={this.props.magicLinkClicked} style={loginStyles.registerText}>
                            <Text
                                style={loginStyles.bText}>Use Magic link instead</Text>
                        </Text>

                        <Text
                            {...addTestID("register")}
                            onPress={this.props.signupClicked} style={loginStyles.registerText}>
                            <Text style={loginStyles.gText}>I don’t have an account.</Text>{' '}
                            <Text style={loginStyles.bText}>Register</Text>
                        </Text>
                    </View>

                )}

                {this.props.isProviderApp && (
                    <View style={{...loginStyles.registerText, paddingRight: 28}}>
                        <Text style={{...loginStyles.gText, textAlign: 'center', marginBottom: 10}}>To use Confidant Health as a healthcare provider, you need to be vetted by the Confidant Clinical Team. To request to join the network, please go to
                            <Text {...addTestID("login-link-website")}
                                  style={loginStyles.detailTextLink} onPress={()=>{ Linking.openURL('http://confidanthealth.com')}}>{' '}ConfidantHealth.com/Providers</Text></Text>
                        <Text style={{...loginStyles.gText, textAlign: 'center'}}>
                            If you’re not a healthcare provider, please download the Confidant Health app instead
                        </Text>
                    </View>
                )}

                {
                    this.props.isLoading ?
                        <AlfieLoader/> : null
                }
            </Container>
        );

    }

    validateEmail = () => {
        this.setState({emailFocus: false});
        let hasEmailError = !EMAIL_REGEX.test(this.state.email);
        this.setState({hasEmailError});
        return !hasEmailError;

    };

    validatePassword = () => {
        this.setState({passwordFocus: false});
        let hasPasswordError = false;
        if (!this.state.password || this.state.password === '') {
            hasPasswordError = true;
        }
        // Can have max length validations here.x
        this.setState({hasPasswordError});
        return !hasPasswordError;
    };

    performLogin = async () => {
        Keyboard.dismiss();
        if (!this.validateEmail()) {
            AlertUtil.showErrorMessage('Invalid email address');
        } else if (!this.validatePassword()) {
            AlertUtil.showErrorMessage('Invalid password');
        } else {


            this.props.login({
                emailOrPhone: this.state.email,
                password: this.state.password,
                type: this.props.userType
            });
        }
    };
}

const loginStyles = StyleSheet.create({
    wrapper: {
        paddingLeft: 23,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    headerBox: {
        marginTop: isIphoneX()? 20 : 0,
        paddingRight: 32
    },
    backButton: {
        marginTop: 10,
        paddingLeft: 6,
        width: 45
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
    inputIcon: {
        top: 2,
        paddingRight: 0,
        fontSize: 30,
    },
    inputBox: {
        color: Colors.colors.inputValue,
        height: 55,
        paddingLeft: 0,
        fontSize: 15
    },
    submitBtn: {
        alignSelf: 'center',
        paddingLeft: 15
    },
    forgotWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 15
    },
    detailTextLink:{
        color: '#00C8FE',
        fontFamily: "Roboto-Regular",
        fontWeight: "300",
        fontSize: 14,
        textAlign:'justify',
        // letterSpacing:0.5,
        marginBottom:5,
        lineHeight: 20
    },
    forgot: {
        fontFamily: 'Roboto-Regular',
        color: Colors.colors.blue3,
        fontSize: 15,
        fontWeight: '500',
        lineHeight: 20,
        paddingLeft: 15
    },
    registerText: {
        alignSelf: 'center',
        marginBottom: isIphoneX() ? 30 : 20
    },
    gText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: '#646c73'
    },
    bText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        color: '#3fb2fe'
    }
});
