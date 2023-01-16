import React, {Component} from 'react';
import {Button, CheckBox, Container, Content, Form, Input, Item, Label, Text, View} from 'native-base';
import {Keyboard, Platform, StatusBar, TouchableWithoutFeedback} from "react-native";
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Colors} from "../../styles";
import GradientButton from "../../components/GradientButton";
import AlfieLoader from "../../components/Loader";
import {EMAIL_REGEX, NAME_REGEX, PHONE_REGEX} from "../../constants";
import {addTestID,AlertUtil,isIphoneX} from "../../utilities";

export class InvitationComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            nameFocus: false,
            hasNameError: null,
            fullName: '',
            emailFocus: false,
            hasEmailError: null,
            email: '',
            phoneFocus: false,
            hasPhoneNumberError: null,
            phoneNumber: '',
            stayConnected: false
        };
        this.form = {
            nameField: null,
            emailField: null,
            phoneNumberField: null,
            submitBtn: null
        }
    }

    validateFullName = () => {
        this.setState({nameFocus: false});
        let hasNameError = false;
        if (this.state.fullName === null || this.state.fullName === '') {
            hasNameError = true;
        } else if (this.state.fullName && this.state.fullName !== '') {
            hasNameError = !NAME_REGEX.test(this.state.fullName);
        }
        this.setState({hasNameError});
        return !hasNameError;
    };

    validateEmail = () => {
        this.setState({emailFocus: false});
        let hasEmailError = !EMAIL_REGEX.test(this.state.email);
        this.setState({hasEmailError});
        return !hasEmailError;
    };
    validatePhone = () => {
        this.setState({phoneFocus: false});
        let hasPhoneNumberError = false;
        if (this.state.phoneNumber && this.state.phoneNumber !== '') {
            hasPhoneNumberError = !PHONE_REGEX.test(this.state.phoneNumber);
            this.setState({hasPhoneNumberError});
        }
        return !hasPhoneNumberError;
    };


    render() {
        if(this.props.isLoading){
            return <AlfieLoader/>
        }
        return (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <Container style={styles.wrapper}>
                    <StatusBar backgroundColor='transparent' translucent={false} animated showHideTransition="slide"/>
                    <View style={styles.headerBox}>
                        <Button
                            {...addTestID('back')}
                            transparent
                            style={styles.backButton}
                            onPress={() => {
                                this.props.goBack();
                            }}
                        >
                            <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                        </Button>
                        <Text
                            style={styles.titleText}>{this.props.invitationType === 'MEMBER' ? 'Invite a New Member' : 'Invite a New Provider'}</Text>
                    </View>
                    <Content>

                        <Form>
                            <Item
                                floatingLabel
                                style={this.state.nameFocus ? [styles.inputFields, {borderColor: '#3fb2fe'}] : styles.inputFields}
                                error={this.state.hasNameError}
                                success={this.state.hasNameError === false}>
                                <Label
                                    style={this.state.hasNameError ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {!this.state.hasNameError ? 'Name' : 'Incorrect Name'}
                                </Label>
                                <Input
                                    {...addTestID('input-full-name')}
                                    style={styles.inputBox}
                                    getRef={field => {
                                        this.form.nameField = field;
                                    }}
                                    onBlur={this.validateFullName}
                                    onFocus={() => {
                                        this.setState({nameFocus: true});
                                    }}
                                    onSubmitEditing={() => {
                                        this.form.emailField._root.focus();
                                    }}
                                    returnKeyType="next"
                                    value={this.state.fullName}
                                    onChangeText={fullName => {
                                        this.setState({
                                            hasNameError: null
                                        });
                                        if (fullName === '') {
                                            this.setState({fullName: null});
                                        } else {
                                            this.setState({fullName: fullName});
                                        }
                                    }}
                                />
                            </Item>
                            <Item
                                floatingLabel
                                style={this.state.emailFocus ? [styles.inputFields, {borderColor: '#3fb2fe'}] : styles.inputFields}
                                error={this.state.hasEmailError}
                                success={this.state.hasEmailError === false}
                            >
                                <Label
                                    style={this.state.hasEmailError ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {!this.state.hasEmailError ? 'Email' : 'Incorrect Email'}
                                </Label>
                                <Input
                                    {...addTestID('input-email-address')}
                                    style={styles.inputBox}
                                    keyboardType="email-address"
                                    getRef={field => {
                                        this.form.emailField = field;
                                    }}
                                    onBlur={this.validateEmail}
                                    onFocus={() => {
                                        this.setState({emailFocus: true});
                                    }}
                                    onSubmitEditing={() => {
                                        this.form.phoneNumberField._root.focus();
                                    }}
                                    textContentType="emailAddress"
                                    returnKeyType="next"
                                    value={this.state.email}
                                    onChangeText={email => {
                                        this.setState({
                                            hasEmailError: null,
                                            email: email.trim()
                                        });
                                    }}
                                />
                            </Item>
                            <Item
                                floatingLabel
                                style={this.state.phoneFocus ? [styles.inputFields, {borderColor: '#3fb2fe'}] : styles.inputFields}
                                error={this.state.hasPhoneNumberError}
                                success={this.state.hasPhoneNumberError === false}
                            >
                                <Label
                                    style={this.state.hasPhoneNumberError ? [styles.inputLabel, {color: Colors.colors.lightRed}] : styles.inputLabel}>
                                    {!this.state.hasPhoneNumberError ? 'Phone (Optional)' : 'Incorrect Phone Number'}
                                </Label>
                                <Input
                                    {...addTestID('input-phone-number')}
                                    style={styles.inputBox}
                                    keyboardType="phone-pad"
                                    getRef={field => {
                                        this.form.phoneNumberField = field;
                                    }}
                                    onBlur={this.validatePhone}
                                    onFocus={() => {
                                        this.setState({phoneFocus: true});
                                    }}
                                    textContentType="emailAddress"
                                    returnKeyType="next"
                                    value={this.state.phoneNumber}
                                    onChangeText={phone => {
                                        let phoneNumber = null;
                                        if (phone && phone !== '') {
                                            phoneNumber = phone.trim();
                                        }
                                        this.setState({phoneNumber, hasPhoneNumberError: null});
                                    }}
                                />
                            </Item>
                            {this.props.invitationType === 'MEMBER' && (
                                <View style={styles.checkItem}>
                                    <CheckBox
                                        style={styles.checkBox}
                                        checked={this.state.stayConnected}
                                        size={24}
                                        onPress={() => {
                                            this.setState({
                                                stayConnected: !this.state.stayConnected
                                            });
                                        }}
                                    />
                                    <Text style={styles.greyText}>
                                        Stay Connected?
                                    </Text>
                                </View>
                            )}
                            <View style={styles.submitBtn}>
                                <GradientButton
                                    testId = "invite"
                                    onPress={this.sendInvite}
                                    text={"Invite " + this.props.invitationType}
                                    ref={btn => {
                                        this.form.submitBtn = btn;
                                    }}
                                />
                            </View>
                        </Form>
                    </Content>
                </Container>
            </TouchableWithoutFeedback>
        );
    }

    sendInvite = () => {
        if (this.isFormValid()) {
            this.setState({isLoading: true});
            const {email, phoneNumber, stayConnected, fullName} = this.state;
            let invitationParams = {
                name: fullName,
                email,
                phoneNumber,
            };
            if (this.props.invitationType === 'MEMBER') {
                invitationParams.stayConnected = stayConnected;
            }
            this.props.sendInvite(invitationParams);
        }
    };

    isFormValid = () => {
        if (!this.state.email && !this.state.fullName) {
            AlertUtil.showErrorMessage('Name and email is required');
            return false;
        }
        if (!this.validateFullName()) {
            AlertUtil.showErrorMessage('Invalid name');
            return false;
        }
        if (!this.validateEmail()) {
            AlertUtil.showErrorMessage('Invalid email address');
            return false;
        }
        if (!this.validatePhone()) {
            AlertUtil.showErrorMessage('Invalid phone number');
            return false;
        }
        return true;
    };

}
const styles = {
    wrapper: {
        paddingRight: 32,
        paddingLeft: 23,
        marginTop: Platform.OS === 'ios' ? 20 : 0
    },
    headerBox: {
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: isIphoneX()? 20 : 0
    },
    backButton: {
        marginTop: 10,
        paddingLeft: 6,
        width: 45,
        paddingTop: 0
    },
    titleText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 24,
        color: '#27355d',
        flex: 0.8,
        textAlign: 'center'
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
    checkItem: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 30,
        paddingLeft: 5,
        width: 'auto',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    checkBox: {
        width: 24,
        height: 24,
        marginRight: 22,
        borderRadius: 4,
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 3,
        paddingLeft: 2
    },
    greyText: {
        color: '#515d7d',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.28,
        fontFamily: 'Roboto-Regular',
        fontWeight: '600'
    },
    submitBtn: {
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 20,
        paddingLeft: 15
    },
};
