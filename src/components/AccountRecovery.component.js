import React, {Component} from 'react';
import {StyleSheet, TouchableWithoutFeedback, Platform, StatusBar, Keyboard} from 'react-native';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import AlfieLoader from './Loader';
import {EMAIL_REGEX} from '../constants';
import {Colors} from '../styles';
import {Button, Container, Content, Form, Input, Item, Label, View} from "native-base";
import GradientButton from "./GradientButton";
import HeaderAlfie from "./HeaderAlfie";
import {AlertUtil,addTestID} from "../utilities";

export class AccountRecoveryComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            hasEmailError: null,
            isLoading: false,
            emailFocus: false,
        };
    }

    validateEmail = () => {
        this.setState({emailFocus: false});
        let hasEmailError = !EMAIL_REGEX.test(this.state.email);
        this.setState({hasEmailError});
        return !hasEmailError;
    };

    render(): React.ReactElement<any> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container style={recoveryStyles.wrapper}>
                    <StatusBar backgroundColor='transparent' translucent={false} barStyle={'dark-content'}
                               showHideTransition="slide"/>
                    <View>
                        <Button onPress={() => {
                            this.props.onBackPressed();
                        }} transparent style={recoveryStyles.backButton}>
                            <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                        </Button>
                    </View>
                    <HeaderAlfie/>

                    <Content>
                        <Form>
                            <Item
                                floatingLabel
                                style={this.state.emailFocus ? [recoveryStyles.inputFields, {borderColor: '#3fb2fe'}] : recoveryStyles.inputFields}
                                error={this.state.hasEmailError}
                                success={this.state.hasEmailError === false}
                            >

                                <Label
                                    style={this.state.hasEmailError ? [recoveryStyles.inputLabel, {color: Colors.colors.lightRed}] : recoveryStyles.inputLabel}>
                                    {this.state.hasEmailError ? 'Incorrect Email' : 'Email Address'}
                                </Label>
                                <Input
                                    {...addTestID('input-email-address')}
                                    style={recoveryStyles.inputBox}
                                    keyboardType="email-address"
                                    onBlur={this.validateEmail}
                                    onFocus={() => {
                                        this.setState({emailFocus: true});
                                    }}
                                    onSubmitEditing={this.onSubmit}
                                    textContentType="emailAddress" returnKeyType="next" value={this.state.email}
                                    onChangeText={email => {
                                        this.setState({
                                            hasEmailError: null,
                                        });
                                        if (email === '') {
                                            this.setState({email: null});
                                        } else {
                                            this.setState({email: email.trim()});
                                        }
                                    }}
                                />
                            </Item>
                        </Form>
                        <View style={recoveryStyles.submitBtn}>
                            <GradientButton
                                testId = "submit"
                                onPress={this.onSubmit} text="Submit"/>
                        </View>
                    </Content>

                    {
                        this.props.isLoading ?
                            <AlfieLoader/> : null
                    }
                </Container>
            </TouchableWithoutFeedback>
        )
    }

    onSubmit = () => {
        if (!this.validateEmail()) {
            AlertUtil.showErrorMessage('Invalid email address');
        } else {
            this.props.onSubmit(this.state.email);
        }
    }

}

const recoveryStyles = StyleSheet.create({
    wrapper: {
        paddingRight: 32,
        paddingLeft: 23,
        marginTop: Platform.OS === 'ios' ? 20 : 0
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
        borderBottomWidth: 1
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
    },
    buttonText: {
        fontSize: 18,
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        textAlign: 'center',
        width: '100%',
        color: Colors.colors.whiteColor,
    }
});
