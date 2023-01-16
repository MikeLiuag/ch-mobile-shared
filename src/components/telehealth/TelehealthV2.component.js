import React, {Component} from 'react';
import {Dimensions, Image, Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Body, Button, Container, Content, Header, Left, Right, Text, Title} from 'native-base';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import LottieView from 'lottie-react-native';
import {SecondaryButton} from '../SecondaryButton';
import {Colors, CommonStyles, TextStyles} from '../../styles';
import Modal from 'react-native-modalbox';
import {PrimaryButton} from '../PrimaryButton';
import SleepingAnim from '../../assets/animations/Dog_Cabinet.json';
import {OTPublisher, OTSession, OTSubscriber} from 'opentok-react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Loader from "../Loader";
import {DEFAULT_IMAGE} from "../../constants";
import {addTestID, isIphoneX, getHeaderHeight} from "../../utilities";
import GradientButton from '../GradientButton';

const HEADER_SIZE = getHeaderHeight();

export class TelehealthComponentV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            camSelected: true,
            micSelected: true,
            publishVideo: true,
            publishAudio: true,
            subscribeConnection: true,
            isLoading: false,
            subscriber: null,
            showEndSessionButton: false,
            disconnectModal: false,
            noShowModal: false,
            isConnected: false,
            signal: {
                data: '',
                type: '',
            }
        };
        this.otSessionRef = null;
        this.sessionOptions = {
            androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
            useTextureViews: true,
        };
        this.publisherEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the publisher: ${error}`);
                console.log(error);
            },
            streamCreated: (ev, ev2) => {
                console.log('Publisher stream created');
                console.log({ev, ev2});
            },
            streamDestroyed: (ev, ev2) => {
                console.log(`Publisher stream destroyed because: ${ev}`);
                console.log({ev, ev2});
            },
        };
        this.subscriberEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`);
            },
            connected: (ev, ev2) => {
                console.log(`Subscriber connected to the stream`);
                console.log({ev, ev2});
            },
            disconnected: (ev, ev2) => {
                console.log(`Subscriber disconnected from the stream`);
                console.log({ev, ev2});
            },
        };
        this.sessionEventHandlers = {
            streamCreated: (event) => {
                console.log('Stream created!', event);
                this.setState({
                    subscriber: event,
                    noShowModal: false
                })
            },
            signal: (event) => {
                console.log('Signal', event);
                if (event?.type === 'session-ended' || event?.type === 'signal:session-ended') {
                    this.props.navigateToCompleted();
                }
            },
            streamDestroyed: (ev, ev2) => {
                console.log('Stream destroyed!', ev);
                this.setState({
                    subscriber: null,
                    showEndSessionButton: true,
                    disconnectModal: false
                })
            },
            connectionDestroyed: (ev, ev2) => {
                console.log('Connection Destroyed');
                console.log({ev, ev2});
            },
            sessionConnected: event => {
                this.setState({
                    isConnected: true,
                })
            },
            sessionDisconnected: (ev, ev2) => {
                console.log(`sessionDisconnected: ${ev}`);
                this.setState({
                    isConnected: false
                })
            },
        };
    }

    /**
     * @function micPressed
     * @description This method is used to change mic state
     */
    micPressed = () => {
        this.setState(state => ({
            publishAudio: !state.publishAudio,
            micSelected: !state.micSelected
        }));
    };

    /**
     * @function camPressed
     * @description This method is used to change cam state
     */
    camPressed = () => {
        this.setState(state => ({
            publishVideo: !state.publishVideo,
            camSelected: !state.camSelected
        }));
    };

    /**
     * @function closeNoShowModal
     * @description This method is used to close no show modal
     */
    closeNoShowModal = () => {
        this.setState({
            noShowModal: false
        })
    };

    /**
     * @function openNoShowModal
     * @description This method is used to open no show modal
     */
    openNoShowModal = () => {
        this.setState({
            noShowModal: true
        })
    };

    /**
     * @function hideDisconnectModal
     * @description This method is used to navigate to close disconnect modal.
     */
    hideDisconnectModal = () => {
        this.setState({
            disconnectModal: false
        })
    };

    /**
     * @function showDisconnectModal
     * @description This method is used to show disconnect modal
     */
    showDisconnectModal = () => {
        this.setState({
            disconnectModal: true
        })
    };

    /**
     * @function sendSignalForCallEnded
     * @description This method is used to set signal state for session end.
     */
    sendSignalForCallEnded = () => {
        const {isConnected, subscriber} = this.state;
        if (isConnected && subscriber) {
            this.setState({
                signal: {
                    type: 'session-ended',
                    data: 'Call Disconnected',
                },
                text: '',
            }, () => {
                this.props.callEnded();
            });
        }
    }


    /**
     * @function callEnded
     * @description This method is used to end session & navigate back.
     */
    callEnded = () => {
        this.hideDisconnectModal();
        this.sendSignalForCallEnded();
    };


    /**
     * @function renderVonageSession
     * @description This method is used to render vonage session details.
     */
    renderVonageSession = () => {
        const {publishVideo, publishAudio, subscriber} = this.state;
        const screenHeight = Math.round(Dimensions.get('window').height);
        return (
            <View style={styles.videoWrapper}>
                <OTSession ref={(ref) => {
                    this.otSessionRef = ref;
                }}
                           signal={this.state.signal}
                           apiKey={this.props.apiKey} sessionId={this.props.sessionId} token={this.props.token}
                           eventHandlers={this.sessionEventHandlers} options={this.sessionOptions}>
                    <OTSubscriber
                        style={[styles.subscriberVideo, {height: screenHeight - HEADER_SIZE}]}
                        eventHandlers={this.subscriberEventHandlers}
                    />
                    <OTPublisher properties={{publishVideo, publishAudio}}
                                 style={styles.publisherVideo}
                                 eventHandlers={this.publisherEventHandlers}/>
                </OTSession>
                {
                    subscriber && (
                        <View style={styles.actionWrapper}>
                            <Button transparent style={styles.actionBtn} onPress={this.camPressed}>
                                <Image
                                    {...addTestID('vd-no-cam-png')}
                                    resizeMode={'contain'}
                                    source={this.state.camSelected ? require('../../assets/images/vd-cam-selected.png') :
                                        require('../../assets/images/vd-no-cam.png')
                                    } alt="Camera"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.micPressed}>
                                <Image
                                    {...addTestID('vd-mic-png')}
                                    resizeMode={'contain'}
                                    source={this.state.micSelected ? require('../../assets/images/vd-mic-selected.png') :
                                        require('../../assets/images/vd-mic.png')
                                    } alt="Mic"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.showDisconnectModal}>
                                <Image
                                    {...addTestID('vd-call-png')}
                                    resizeMode={'contain'}
                                    source={require('../../assets/images/vd-call-end.png')} alt="End"/>
                            </Button>
                        </View>
                    )
                }

            </View>
        );
    };


    /**
     * @function renderWaiting
     * @description This method is used to render waiting state
     */
    renderWaiting() {
        const {subscriber} = this.state;
        if (subscriber) {
            return null;
        }
        return (
            <View>
                <Text style={styles.mainTitle}>Welcome to {'\n'}Waiting Room</Text>
                <View style={{marginTop: 85}}>
                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={styles.alfieAnim}
                        source={SleepingAnim} autoPlay loop/>
                </View>

                <View style={styles.textWrapper}>
                    <Text style={styles.singleParah}>
                        {this.props.isProviderApp ?
                            "You will be connected to your member once they start the telehealth session and sometimes this can take a minute."
                            :"We’ll automatically connect you to your appointment when they arrive.If you get disconnected, you will be reconnected automatically."}
                    </Text>
                    <Text style={styles.singleParah}>
                        If it’s taking too long, you may want to leave and reach out to them to see what the
                        issue is.
                    </Text>
                    <Text style={styles.singleParah}>
                        If you don’t have an appointment scheduled with them, then you’ll have to do that first.
                    </Text>
                </View>
                {this.state.showEndSessionButton && (
                    <View style={styles.endSessionBtnView}>
                        <Button style={styles.endSessionBtn}
                                disabled={this.props.sessionEnded}
                                onPress={this.props.callEnded}
                        >
                            <Text style={styles.endSessionText}>End Session</Text>
                        </Button>
                    </View>

                )}
                <View style={styles.endSessionBtnView}>
                    <SecondaryButton
                        onPress={this.openNoShowModal}
                        inactiveBtn={this.props.sessionEnded}
                        textColor={Colors.colors.errorIcon}
                        borderColor={Colors.colors.errorIcon}
                        bgColor={Colors.colors.white}
                        text={'Mark as No Show'}
                    />
                    {
                        this.props.completeViaPhone !== undefined && (
                            <SecondaryButton
                                onPress={this.props.completeViaPhone}
                                inactiveBtn={this.props.sessionEnded}
                                textColor={Colors.colors.primaryText}
                                borderColor={Colors.colors.primaryIcon}
                                bgColor={Colors.colors.white}
                                text={'Completed via Phone Call'}
                            />
                        )
                    }
                </View>
            </View>

        );
    }

    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.props.isLoading) {
            return <Loader/>
        }
        const {subscriber} = this.state;
        return (
            <Container>
                <Header transparent noShadow style={styles.chatHeader}>
                    <StatusBar backgroundColor="transparent" translucent animated showHideTransition="slide"/>
                    <Left style={{flex: 0.5}}>
                        {!subscriber && (
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
                        )}
                    </Left>
                    <Body style={{flex: 2, alignItems: 'flex-start'}}>
                        <View style={styles.avatarContainer}>
                            <Image style={styles.avatar}
                                   resizeMode={'contain'}
                                   source={{uri: this.props.avatar ? this.props.avatar : this.props.S3_BUCKET_LINK + DEFAULT_IMAGE}}
                            />
                            <Title style={styles.headerText}>{this.props.name}</Title>
                        </View>
                    </Body>
                    <Right/>
                </Header>
                <Content>
                    {this.renderVonageSession()}
                    {this.renderWaiting()}
                </Content>

                <Modal
                    backdropPressToClose={true}
                    backdropColor="rgba(37,52,92,0.35)"
                    backdropOpacity={1}
                    isOpen={this.state.disconnectModal}
                    style={[styles.modal, styles.modal4]}
                    onClosed={this.hideDisconnectModal}
                    entry={"bottom"}
                    position={"bottom"} swipeArea={100}>
                    <View style={styles.endWrapper}>
                        <View style={styles.arrowDown}>
                            <Ionicon name="ios-arrow-down" onPress={this.hideDisconnectModal} size={30}
                                     color="#4FACFE"/>
                        </View>
                        <GradientButton
                            testId="wil-be-back"
                            text={'I will be Back'}
                            onPress={this.props.navigateToLiveChat}
                        />
                        <GradientButton
                            testId="end-session"
                            text={'End Session'}
                            disabled={this.props.sessionEnded}
                            onPress={this.callEnded}
                        />
                    </View>
                </Modal>
                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.closeNoShowModal}
                    isOpen={this.state.noShowModal}
                    style={{...CommonStyles.styles.commonModalWrapper, maxHeight: 410}}
                    entry={'bottom'}
                    position={'bottom'} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <View style={{width: '100%'}}>
                        <Text style={styles.confirmHeader}>
                            Mark {this.props.isProviderApp ? 'Member' : 'Provider'} as No Show to this appointment?
                        </Text>
                        <Text style={styles.confirmDes}>
                            {this.props.isProviderApp ? 'Payment for this appointment will not be refunded to member if he didn\'t show up' : 'Payment for this appointment will be refunded to your wallet if provider didn\'t show up'}
                        </Text>
                        <View style={styles.confirmBtns}>
                            <View style={styles.noBtn}>
                                <SecondaryButton
                                    onPress={this.props.markAsNoShow}
                                    textColor={Colors.colors.errorIcon}
                                    borderColor={Colors.colors.errorIcon}
                                    bgColor={Colors.colors.white}
                                    text={'Mark as No Show'}
                                />
                            </View>

                            <View style={styles.noBtn}>
                                <PrimaryButton
                                    onPress={this.closeNoShowModal}
                                    text={'Keep waiting'}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    backButton: {
        marginLeft: 15,
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        borderRadius: Platform.OS === 'ios' ? 18 : 100,
        overflow: 'hidden',
        width: 35,
        height: 35,
        marginRight: 10,
    },
    headerText: {
        color: '#25345C',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
    },
    waitingTop: {
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'space-between',
        width: '100%',
        height: 200,
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
    },
    videoBox: {
        width: 150,
        height: 180,
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: '#ebeeef',
    },
    mainTitle: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH2,
        color: Colors.colors.highContrast,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'left',
        marginTop: 20,

    },

    alfieAnim: {
        width: '100%',
    },
    textWrapper: {
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 20,
    },
    singleParah: {
        color: '#646C73',
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        textAlign: 'left',
        marginTop: 10,
        marginBottom: 10,
    },
    leaveBtn: {
        borderWidth: 1,
        borderColor: '#F78795',
        borderRadius: 4,
    },
    leaveText: {
        textTransform: 'uppercase',
        color: '#F78795',
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 0.7,
        lineHeight: 19.5,
    },
    loaderstyle: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    btnStyle: {
        width: 250,
        alignSelf: 'center',
        alignItems: 'center',
    },

    endSessionBtn: {
        borderColor: '#d0021b',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        justifyContent: 'center',
        elevation: 0,
    },
    endSessionText: {
        color: '#d0021b',
        fontSize: 13,
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    endSessionBtnView: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 20,
        paddingBottom: isIphoneX() ? 34 : 24,
    },
    confirmHeader: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH5,
        ...TextStyles.mediaTexts.manropeBold,
        paddingHorizontal: 18,
        marginBottom: 16,
    },
    confirmDes: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.bodyTextM,
        ...TextStyles.mediaTexts.manropeMedium,
        paddingHorizontal: 18,
        marginBottom: 10,
    },
    confirmBtns: {
        paddingTop: 24,
    },
    noBtn: {},
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: '#f5f5f5',
        borderTopWidth: 0.5,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24,
    },
    modal4: {
        maxHeight: 240,
    },
    endWrapper: {
        alignItems: 'center',
    },
    arrowDown: {
        marginBottom: 20,
    },
    mainBG: {
        backgroundColor: '#F9F9F9',
    },
    chatHeader: {
        height: HEADER_SIZE,
        paddingLeft: 3,
        paddingRight: 0,
        elevation: 0,
        borderBottomColor: '#f5f5f5',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
    },
    headerContent: {
        flexDirection: 'row',
    },
    headerBG: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 5,
        // marginTop: isIphoneX() ? MARGIN_X : MARGIN_NORMAL,
    },
    headerRow: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    videoWrapper: {
        flex: 1,
        position: 'relative',
    },
    publisherVideo: {
        width: 150,
        height: 180,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 100,
    },

    subscriberVideo: {
        width: '100%',
        flex: 1,
        zIndex: 50
    },
    actionWrapper: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 50,
        alignSelf: 'center',
        zIndex: 999,
    },
    actionBtn: {
        marginLeft: 8,
        marginRight: 8,
    },
    loadersty: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    alfie: {
        width: 150,
        height: 150,
    },
});
