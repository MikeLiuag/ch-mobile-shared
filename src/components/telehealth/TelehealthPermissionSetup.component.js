import React, {Component} from "react";
import {StyleSheet, View, Platform, AppState,Text, StatusBar} from "react-native";
import {Button, Container, Content} from "native-base";
import GradientButton from '../GradientButton';
import {CONTINUE_SUBTITLE} from '../../constants';
import {check, request, PERMISSIONS, openSettings} from 'react-native-permissions';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import Loader from "../Loader";
import {addTestID, isIphoneX} from "../../utilities";
import LottieView from "lottie-react-native";
import providerAnim from "../../assets/animations/Dog_with_phone_and_provider";

export class TelehealthPermissionComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            isEnabledMic: null,
            isEnabledCam: null,
            cameraStatus: '',
            microphoneStatus: '',
            appState: AppState.currentState,
        };
    }

    openNativeSettings = () => {
        this.props.navigatingToSettings();
        openSettings().catch((e) => console.log(e));
    };

    showAlert = () => {

        const item = this.state.cameraStatus !== 'granted' ? 'Camera' : 'Microphones';
        item === 'Camera' ?
            request(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA).then(result => {
                let isEnabledCam = null;
                if (result === 'denied') {
                    isEnabledCam = false
                }
                this.setState({cameraStatus: result, isEnabledCam})
            }) :
            request(Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
                let isEnabledMic = null;
                if (result === 'denied') {
                    isEnabledMic = false
                }
                this.setState({microphoneStatus: result, isEnabledMic})
            });

    };

    componentWillMount = () => {
        this.checkPermissions();
    };

    componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    handleAppStateChange = (nextAppState) => {
        if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
            console.log('App has come to the foreground!');
            this.checkPermissions();
        }
        this.setState({appState: nextAppState});
        this.playAnimation();
    };

    playAnimation = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
        }
    };

    checkPermissions = () => {
        Promise.all([
            check(Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA),
            check(Platform.OS === 'ios' ? PERMISSIONS.IOS.MICROPHONE : PERMISSIONS.ANDROID.RECORD_AUDIO),
        ]).then(([cameraStatus, microphoneStatus]) => {
            let isEnabledMic = null;
            let isEnabledCam = null;
            if (microphoneStatus === 'blocked') {
                isEnabledMic = false
            }
            if (cameraStatus === 'blocked') {
                isEnabledCam = false
            }
            this.setState({
                microphoneStatus: microphoneStatus,
                cameraStatus: cameraStatus,
                isEnabledCam,
                isEnabledMic
            })
        });
    };

    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.state.cameraStatus === '' && this.state.microphoneStatus === '') {
            return (<Loader/>);
        }
        return (
            <Container>
                <StatusBar backgroundColor='transparent' translucent animated showHideTransition="slide"/>
                <View>
                    <Button
                        transparent
                        style={styles.backButton}
                        onPress={() => {
                            this.props.backClicked();
                        }}
                    >
                        <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                    </Button>
                </View>
                <Content style={styles.wrapper}>
                    <Text
                        {...addTestID('Welcome-telehealth')}
                        style={styles.title}>Welcome to {'\n'}
                        Confidant Telehealth</Text>

                    {this.state.cameraStatus !== 'granted' ?

                        <View style={styles.slide1}>
                            <LottieView
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={styles.alfieAnim}
                                source={providerAnim} autoPlay loop/>

                            <Text style={styles.allowText}>Allow access to camera</Text>
                            <Text style={styles.desText}>Confidant Telehealth uses video chat {'\n'}
                                and requires access to your camera, so {'\n'}
                                the other person can see you.</Text>
                            <View
                                {...addTestID('Enable-camera-view')}
                                style={styles.btnStyle}>
                                <GradientButton
                                    testId = "enable-camera"
                                    onPress={() => {
                                        this.state.isEnabledCam === false ? this.openNativeSettings() : this.showAlert();
                                    }}
                                    text={this.state.isEnabledCam === false ? "GO TO SETTINGS" : "Enable Camera"}
                                />
                            </View>
                            <View
                                {...addTestID('dots')}
                                style={styles.dots}>
                                <View
                                    {...addTestID('first-dot')}
                                    style={styles.activeD}/>
                                <View
                                    {...addTestID('Second-dot')}
                                    style={styles.inactiveD}/>
                            </View>
                        </View>
                        :
                        (this.state.microphoneStatus !== 'granted' ?

                                <View style={styles.slide1}>
                                    <LottieView
                                        ref={animation => {
                                            this.animation = animation;
                                        }}
                                        style={styles.alfieAnim}
                                        source={providerAnim} autoPlay loop/>

                                    <Text style={styles.allowText}>Allow access to microphone</Text>
                                    <Text style={styles.desText}>Confidant Telehealth also requires {'\n'}
                                        access to your microphone, so the {'\n'}
                                        other person can hear you speak.</Text>
                                    <View
                                        {...addTestID('Enable-Microphone-view')}
                                        style={styles.btnStyle}>
                                        <GradientButton
                                            testId = "enable-microphone"
                                            onPress={() => {
                                                this.state.isEnabledMic === false ? this.openNativeSettings() : this.showAlert();
                                            }}
                                            text={this.state.isEnabledMic === false ? "GO TO SETTINGS" : "Enable Microphone"}
                                        />
                                    </View>
                                    <View
                                        {...addTestID('dots')}
                                        style={styles.dots}>
                                        <View
                                            {...addTestID('first-dot')}
                                            style={styles.inactiveD}/>
                                        <View
                                            {...addTestID('Second-dot')}
                                            style={styles.activeD}/>
                                    </View>
                                </View>
                                :
                                <View style={styles.slide1}>

                                    <LottieView
                                        ref={animation => {
                                            this.animation = animation;
                                        }}
                                        style={styles.alfieAnim}
                                        source={providerAnim} autoPlay loop/>

                                    <Text style={styles.allowText}>GREAT JOB ! YOU ARE ALL SET</Text>
                                    <Text style={styles.desText}>{CONTINUE_SUBTITLE}</Text>
                                    <View style={styles.btnStyle}>
                                        <GradientButton
                                            disabled={!this.props.socketConnected}
                                            testId = "continue"
                                            onPress={() => this.props.navigateToTelehealth()}
                                            text='Continue'
                                        />
                                    </View>
                                    <View style={styles.dots}>
                                        <View style={styles.inactiveD}/>
                                        <View style={styles.activeD}/>
                                    </View>
                                </View>
                        )}
                </Content>
            </Container>
        );
    };
}

const styles = StyleSheet.create({
    wrapper: {
        padding: 24,
        // paddingBottom: 50
    },
    backButton: {
        marginTop: 34,
        paddingLeft: 24,
        width: 45,
    },
    title: {
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        lineHeight: 36,
        letterSpacing: 1,
        textAlign: 'center',
        color: '#25345c',
        marginTop: isIphoneX()? 40 : 0,
        marginBottom: -20
    },

    swipeWrapper: {
        height: 500,
        justifyContent: 'flex-start'
    },
    slide1: {
        // flex: 1,
        paddingLeft: 25,
        paddingRight: 25
    },
    alfieImage: {
        resizeMode: 'contain',
        width: '100%'
    },
    alfieAnim : {
        width: '100%',
        marginTop: 20,
        marginBottom: 30,
        // height: 300
    },
    allowText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        lineHeight: 21,
        letterSpacing: 0.88,
        textAlign: 'center',
        color: '#515d7d',
        marginBottom: 8,
        textTransform: 'uppercase',
        marginTop: 50
    },
    desText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 22,
        textAlign: 'center',
        color: '#646c73',
        marginBottom: 15
    },
    btnStyle: {
        width: 250,
        alignSelf: 'center',
        alignItems: 'center'
    },
    dots: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginTop: 25,
        marginBottom: 50
    },
    inactiveD: {
        width: 12,
        height: 12,
        backgroundColor: '#b3bec9',
        borderRadius: 6,
        opacity: 0.5,
        margin: 3
    },
    activeD: {
        width: 12,
        height: 12,
        backgroundColor: '#b3bec9',
        borderRadius: 6,
        margin: 3
    }
});
