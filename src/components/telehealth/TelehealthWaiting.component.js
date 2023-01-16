import React, {Component} from 'react';
import {View, StyleSheet, Image, StatusBar, Platform, AppState} from 'react-native';
import {Container, Header, Text, Left, Button, Body, Title, Right, Content} from "native-base";
import {DEFAULT_IMAGE} from "../../constants";
import {addTestID, isIphoneX,SocketClient, getHeaderHeight} from '../../utilities';
import Loader from './../../components/Loader';
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import LottieView from "lottie-react-native";
import SleepingAnim from "../../assets/animations/Dog_Cabinet";
import Modal from 'react-native-modalbox';
import {Colors, CommonStyles, TextStyles} from "../../styles";
import { PrimaryButton } from "../PrimaryButton";
import { SecondaryButton } from "../SecondaryButton";
const HEADER_SIZE = getHeaderHeight();

export class TelehealthWaitingComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.iv = null;
        this.connectedToCall = false;
        this.state = {
            appState: AppState.currentState,
            noShowModal: false
        }
        this.socketEventHandlers = {
            telesessionJoined: session => {
                // This event will occur when session has both members.
                this.removeSocketHandler('telesession-joined', this.socketEventHandlers.telesessionJoined);
                this.clearPoll();
                this.connectedToCall = true;
                this.props.telesessionStarted(session);
            },
            telesessionRejected: session => {
                this.removeSocketHandler('session-rejected-to-join', this.socketEventHandlers.telesessionRejected);
                this.props.telesessionRejected(session);
            },
            checkSession: data => {

                // This event will get session status from the server .
                // Code 200 - session ready ( Both members joined )
                // Code 400 - session not found.

                if(data.appointmentId === this.props.appointmentId) {
                    if (data.code === 200) {
                        this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
                        this.clearPoll();
                        this.connectedToCall = true;
                        this.props.telesessionStarted(data);
                    } else if (data.code === 400) {
                        this.clearPoll();
                    } else if (data.code === 500) {
                        this.clearPoll();
                        this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
                        this.props.telesessionNotReady();
                    }
                }
            },
            joinedAck: (data)=>{
                if(data.appointmentId === this.props.appointmentId) {
                    const socket = SocketClient.getInstance().getConnectedSocket();
                    if (socket) {
                        socket.emit('joined-ack', {
                            appointmentId: this.props.appointmentId
                        });
                    }
                }
            }
        }
    }

    componentDidMount(): void {
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.on('telesession-joined', this.socketEventHandlers.telesessionJoined);
            socket.on('session-rejected-to-join', this.socketEventHandlers.telesessionRejected);
            socket.on('check-session-response', this.socketEventHandlers.checkSession);
            socket.on('check-if-joined', this.socketEventHandlers.joinedAck);
        }
        this.startPoll();
        SocketClient.getInstance().registerConnectivityCallbacks('waitingRoom', () => {
            // on disconnect
            this.removeSocketHandler('telesession-joined', this.socketEventHandlers.telesessionJoined);
            this.removeSocketHandler('session-rejected-to-join', this.socketEventHandlers.telesessionRejected);
            this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
            this.removeSocketHandler('check-if-joined', this.socketEventHandlers.joinedAck);
        },()=>{
            // on reconnecting
            this.removeSocketHandler('telesession-joined', this.socketEventHandlers.telesessionJoined);
            this.removeSocketHandler('session-rejected-to-join', this.socketEventHandlers.telesessionRejected);
            this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
            this.removeSocketHandler('check-if-joined', this.socketEventHandlers.joinedAck);

            socket.on('telesession-joined', this.socketEventHandlers.telesessionJoined);
            socket.on('session-rejected-to-join', this.socketEventHandlers.telesessionRejected);
            socket.on('check-session-response', this.socketEventHandlers.checkSession);
            socket.on('check-if-joined', this.socketEventHandlers.joinedAck);
        });

        AppState.addEventListener('change', this._handleAppState);
    }

    componentWillUnmount(): void {
        this.clearPoll();
        this.removeSocketHandler('check-if-joined', this.socketEventHandlers.joinedAck);
        if(!this.connectedToCall) {
            // This event will remove member( this.props.userId ) from the session.
            const socket = SocketClient.getInstance().getConnectedSocket();
            if (socket) {
                socket.emit("telesession-disconnect", {
                    appointmentId: this.props.appointmentId,
                    userId: this.props.userId,
                });
            }
        }
        SocketClient.getInstance().unregisterConnectivityCallbacks('waitingRoom');
        AppState.removeEventListener('change', this._handleAppState);
    }


    removeSocketHandler(event, handler) {
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.off(event, handler);
        }
    }

    _handleAppState = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
        }
    }

    clearPoll = () => {
        if (this.iv) {
            clearInterval(this.iv);
        }
    }

    startPoll = () => {
        this.clearPoll();
        // This event will get session status from the server .
        this.iv = setInterval(() => {
            try {
                const socket = SocketClient.getInstance().getConnectedSocket();
                if (socket) {

                    socket.emit('joined-silent', {
                        appointmentId: this.props.appointmentId,
                        userId: this.props.userId
                    });

                    socket.emit('check-session', {
                        appointmentId: this.props.appointmentId,
                        userId: this.props.userId
                    });
                }

            } catch (e) {
                console.log(e);
            }
        }, 2000);
    };

    goBack = () => {
        this.clearPoll();
        this.props.goBack();
    };

    closeNoShowModal = ()=>{
        this.setState({
            noShowModal: false
        })
    };

    openNoShowModal = ()=>{
        this.setState({
            noShowModal: true
        })
    };


    render() {
        StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);

        if (this.props.isLoading) {
            return (
                <Loader/>
            );
        } else {
            return (
                <Container>
                    <Header transparent noShadow style={styles.chatHeader}>
                        <StatusBar backgroundColor='transparent' translucent animated showHideTransition="slide"/>
                        <Left style={{flex: 0.5}}>
                            <Button
                                {...addTestID('back')}
                                transparent
                                style={styles.backButton}
                                onPress={() => {
                                    this.goBack();
                                }}
                            >
                                <AwesomeIcon name="angle-left" size={32} color="#3fb2fe"/>
                            </Button>
                        </Left>
                        <Body style={{flex: 2, alignItems: 'flex-start'}}>
                            <View style={styles.avatarContainer}>
                                <Image style={styles.avatar}
                                       resizeMode={"contain"}
                                       source={{uri: this.props.avatar ? this.props.avatar : this.props.S3_BUCKET_LINK + DEFAULT_IMAGE}}
                                />

                                <Title style={styles.headerText}>{this.props.name}</Title>
                            </View>
                        </Body>
                        <Right/>
                    </Header>

                    <Content>
                        <Text style={styles.mainTitle}>Welcome to the {'\n'} Waiting Room</Text>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={styles.alfieAnim}
                            source={SleepingAnim} autoPlay loop/>
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

                    </Content>

                    {this.props.endSessionBtn && (
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
                            this.props.completeViaPhone!==undefined && (
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
                                Mark {this.props.isProviderApp?'Member':'Provider'} as No Show to this appointment?
                            </Text>
                            <Text style={styles.confirmDes}>
                                {this.props.isProviderApp?"Payment for this appointment will not be refunded to member if he didn't show up":"Payment for this appointment will be refunded to your wallet if provider didn't show up"}
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
}

const styles = StyleSheet.create({
    chatHeader: {
        height: HEADER_SIZE,
        paddingLeft: 0,
        paddingRight: 0,
        elevation: 0,
        borderBottomColor: '#EBEBEB',
        borderBottomWidth: 1
    },
    backButton: {
        marginLeft: 15
    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: Platform.OS === 'ios' ? 18 : 100,
        overflow: 'hidden',
        width: 35,
        height: 35,
        marginRight: 10
    },
    headerText: {
        color: "#25345C",
        fontFamily: "Roboto-Regular",
        fontSize: 18,
        letterSpacing: 0.3
    },
    mainTitle: {
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        letterSpacing: 1,
        lineHeight: 36,
        textAlign: 'center',
        color: '#25345C',
        marginTop: 40,
        marginBottom: 20
    },
    alfieAnim: {
        width: '100%'
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
        marginBottom: 10
    },
    leaveBtn: {
        borderWidth: 1,
        borderColor: '#F78795',
        borderRadius: 4
    },
    leaveText: {
        textTransform: 'uppercase',
        color: '#F78795',
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 0.7,
        lineHeight: 19.5
    },
    loaderstyle: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
    btnStyle: {
        width: 250,
        alignSelf: 'center',
        alignItems: 'center'
    },

    endSessionBtn: {
        borderColor: '#d0021b',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        //marginBottom: 24,
        justifyContent: 'center',
        elevation: 0,
        // width: 250,
        // alignSelf: 'center',
        // alignItems: 'center'
    },
    endSessionText: {
        color: '#d0021b',
        fontSize: 13,
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        textTransform: 'uppercase'
    },
    endSessionBtnView: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 20,
        paddingBottom: isIphoneX() ? 34 : 24
    },
    confirmHeader: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH5,
        ...TextStyles.mediaTexts.manropeBold,
        paddingHorizontal: 18,
        marginBottom: 16
    },
    confirmDes: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.bodyTextM,
        ...TextStyles.mediaTexts.manropeMedium,
        paddingHorizontal: 18,
        marginBottom: 10
    },
    confirmBtns: {
        paddingTop: 24
    },
    noBtn: {
    }
});
