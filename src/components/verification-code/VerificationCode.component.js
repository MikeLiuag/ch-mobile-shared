import React, {Component} from 'react';
import {RESEND_CODE_TIMEOUT} from "../../constants";
import {Button, Form, Input, Text, View} from "native-base";
import {StyleSheet} from "react-native";
import {addTestID,AlertUtil} from "../../utilities";

export class VerificationCodeComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            codeChar0: '',
            codeChar1: '',
            codeChar2: '',
            codeChar3: '',
            timer: RESEND_CODE_TIMEOUT,
            isClicked: false,
            isLoading: false
        };
        this.form = {
            codeField0: null,
            codeField1: null,
            codeField2: null,
            codeField3: null,
        };
    }

    render() {
        return (
            <Form>
                <View style={confirmStyles.inputRow}>
                    <Input
                        {...addTestID('input-code-field-0')}
                        style={confirmStyles.inputStyle}
                        keyboardType="number-pad"
                        ref={field => {
                            this.form.codeField0 = field;
                        }}
                        textAlign="center"
                        onSubmitEditing={() => {
                            this.form.codeField1._root.focus();
                        }}
                        maxLength={1}
                        value={this.state.codeChar0}
                        returnKeyType="next"
                        onChangeText={codeChar => {
                            this.setState({codeChar0: codeChar});
                            if (codeChar.length > 0) {
                                this.form.codeField1._root.focus();
                            }
                        }}
                    />
                    <Input
                        {...addTestID('input-code-field-1')}
                        style={confirmStyles.inputStyle}
                        keyboardType="number-pad"
                        ref={field => {
                            this.form.codeField1 = field;
                        }}
                        value={this.state.codeChar1}
                        returnKeyType="next"
                        maxLength={1}
                        textAlign="center"
                        onSubmitEditing={() => {
                            this.form.codeField2._root.focus();
                        }}
                        onKeyPress={event => {
                            if (event.nativeEvent.key === 'Backspace') {
                                if(this.state.codeChar1 === '') {
                                    this.form.codeField0._root.focus();
                                    this.setState({codeChar0: ''});
                                } else {
                                    this.setState({codeChar1: ''});
                                }
                            }
                        }}
                        onChangeText={codeChar => {
                            this.setState({codeChar1: codeChar});
                            if (codeChar.length > 0) {
                                this.form.codeField2._root.focus();
                            }
                        }}
                    />
                    <Input
                        {...addTestID('input-code-field-2')}
                        style={confirmStyles.inputStyle}
                        keyboardType="number-pad"
                        value={this.state.codeChar2}
                        returnKeyType="next"
                        ref={field => {
                            this.form.codeField2 = field;
                        }}
                        maxLength={1}
                        textAlign="center"
                        onSubmitEditing={() => {
                            this.form.codeField3._root.focus();
                        }}
                        onKeyPress={event => {
                            if (event.nativeEvent.key === 'Backspace') {
                                if(this.state.codeChar2 === '') {
                                    this.form.codeField1._root.focus();
                                    this.setState({codeChar1: ''});
                                } else {
                                    this.setState({codeChar2: ''});
                                }
                            }
                        }}
                        onChangeText={codeChar => {
                            this.setState({codeChar2: codeChar});
                            if (codeChar.length > 0) {
                                this.form.codeField3._root.focus();
                            }
                        }}
                    />
                    <Input
                        {...addTestID('input-code-field-3')}
                        style={confirmStyles.inputStyle}
                        keyboardType="number-pad"
                        value={this.state.codeChar3}
                        returnKeyType="send"
                        ref={field => {
                            this.form.codeField3 = field;
                        }}
                        maxLength={1}
                        textAlign="center"
                        onSubmitEditing={() => {
                            this.submit();
                        }}
                        onKeyPress={event => {
                            if (event.nativeEvent.key === 'Backspace') {
                                if(this.state.codeChar3 === '') {
                                    this.form.codeField2._root.focus();
                                    this.setState({codeChar2: ''});
                                } else {
                                    this.setState({codeChar3: ''});
                                }
                            }
                        }}
                        onChangeText={codeChar => {
                            this.setState({codeChar3: codeChar});
                        }}
                    />
                </View>
                <Button
                    {...addTestID('resend-verification-code-btn')}
                    onPress={this.resendVerificationCode}
                    disabled={this.state.timer !== 0}
                    transparent
                    style={confirmStyles.resendBtn}
                >
                    <Text uppercase={false} style={confirmStyles.resendText}>
                        Re-send Code
                    </Text>
                </Button>
                {this.state.timer !== 0 && (
                    <Text style={confirmStyles.resendText}>
                        {' '}
                        {this.state.timer}{' '}
                    </Text>
                )}
            </Form>
        );
    }

    submit = () => {
        if (
            this.state.codeChar0 === '' ||
            this.state.codeChar1 === '' ||
            this.state.codeChar2 === '' ||
            this.state.codeChar3 === ''
        ) {
            AlertUtil.showErrorMessage('Please enter 4 digit code');
            return;
        }
        const code =
            this.state.codeChar0 + this.state.codeChar1 +
            this.state.codeChar2 + this.state.codeChar3;
        this.props.submit(code);
    };


    resendVerificationCode = async () => {


        this.setState({
            timer: RESEND_CODE_TIMEOUT,
            codeChar0: '',
            codeChar1: '',
            codeChar2: '',
            codeChar3: '',
        });

        const response = await this.props.resendVerificationCode(
            this.props.context
        );

        if (response.errors) {
            AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
            this.setState({
                timer: 0
            });
        } else {
            if (response.status && response.status !== 200) {
                AlertUtil.showErrorMessage(response.message);
                this.setState({
                    timer: 0
                });
            } else {
                AlertUtil.showSuccessMessage(response.successMessage);
                this.startTimer();
            }
        }

    };


    componentDidMount() {
        this.startTimer();
    }

    startTimer = () => {
        this.interval = setInterval(
            () => this.setState(prevState => ({timer: prevState.timer - 1})),
            1000
        );
    };

    componentDidUpdate() {
        if (this.state.timer === 0) {
            clearInterval(this.interval);
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

}
const confirmStyles = StyleSheet.create({
    inputRow: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '85%',
        alignSelf: 'center'
    },
    inputStyle: {
        color: '#515d7d',
        borderBottomColor: '#ebebeb',
        borderBottomWidth: 1,
        height: 75,
        textAlign: 'center',
        fontSize: 36,
        width: 48,
        marginLeft: 10,
        marginRight: 10,
        fontFamily: 'Roboto-Regular',
        fontWeight: '100'
    },
    resendText: {
        fontSize: 15,
        fontFamily: 'Roboto-Regular',
        alignSelf: 'center',
        color: '#3fb2fe',
        fontWeight: '500',
        lineHeight: 20
    },
    resendBtn: {
        alignSelf: 'center',
        marginTop: 20
    },
});
