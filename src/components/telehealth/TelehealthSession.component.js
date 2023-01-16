import React, {Component} from "react";
import {StyleSheet, View, Text, Image, StatusBar, Platform, Dimensions, BackHandler} from "react-native";
import {HEADER_NORMAL, DEFAULT_IMAGE} from "../../constants";
import {OTSession, OTPublisher, OTSubscriber} from 'opentok-react-native';
import {addTestID, isIphoneX, SocketClient, getHeaderHeight} from "../../utilities";
import {Body, Button, Container, Content, Header, Left, Right, Title} from "native-base";
import LinearGradient from "react-native-linear-gradient";
import LottieView from 'lottie-react-native';
import alfie from '../../assets/animations/alfie-face-new';
import Modal from 'react-native-modalbox';
import Ionicon from 'react-native-vector-icons/Ionicons';
import GradientButton from '../GradientButton';

const HEADER_SIZE = getHeaderHeight();

export class TelehealthSessionComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            camSelected: true,
            micSelected: true,
            publishVideo: true,
            publishAudio: true,
            subscribeConnection: true,
            isLoading: false,
        };
        this.iv = null;
        this.sessionOptions = {
            androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
            useTextureViews: true,
        };
        this.sessionCompleted = false;
        this.publisherEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the publisher: ${error}`);
            },
            streamCreated: () => {
                console.log('Publisher stream created');
            },
            streamDestroyed: (reason) => {
                console.log(`Publisher stream destroyed because: ${reason}`);
            }
        };
        this.subscriberEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`);
            },
            connected: () => {
                console.log(`Subscriber connected to the stream`);
                this.clearPoll();
            },
            disconnected: ({reason}) => {
                console.log(`Subscriber disconnected from the stream`);
                this.props.disconnect();
            }
        };
        this.sessionEventHandlers = {
            streamCreated: event => {
                console.log('Stream created!', event);
            },
            streamDestroyed: event => {
                console.log('Stream destroyed!', event);
            },
            connectionDestroyed: event => {
                console.log('Connection Destroyed');
                this.startPoll();
            },
            sessionConnected: event => {
                console.log(`sessionConnected: ${event}`);
            },
            sessionDisconnected: (reason) => {
                console.log(`sessionDisconnected: ${reason}`);
            }
        };
        this.socketEventHandlers = {
            disconnected: session => {
                // This event will occur when other member has been disconnected from the session.
                console.log('Got event telesession-disconnected',session);
                this.removeSocketHandler('telesession-disconnected', this.socketEventHandlers.disconnected);
                this.sessionCompleted = false;
                this.clearPoll();
                if (session?.willBeBack) {
                    this.props.navigateToWaitingRoomScreen();
                } else {
                    this.props.disconnect();
                }
            },
            appointmentFullfilled: session => {
                // This event will occur when other member has completed the session.
                this.removeSocketHandler('appointment-fullfilled', this.socketEventHandlers.appointmentFullfilled)
                this.clearPoll();
                this.sessionCompleted = true;
                this.props.navigateToCompleted(false);
            },
            checkSession: data => {
                // This event will get session status from the server.
                // Code 300 - session has only one member
                // Code 500 - session has been completed
                if(data.appointmentId === this.props.appointmentId) {
                    if (data.code === 300) {
                        this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
                        this.clearPoll();
                        this.sessionCompleted = false;
                        this.props.disconnect();
                    } else if (data.code === 500) {
                        this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
                        this.clearPoll();
                        this.sessionCompleted = true;
                        this.props.navigateToCompleted(false);
                    } else if (data.code === 200) {
                        this.setState({isLoading: false});
                        this.clearPoll();
                    }else{
                        this.removeSocketHandler('check-session-response', this.socketEventHandlers.checkSession);
                        this.clearPoll();
                        this.sessionCompleted = false;
                        this.props.disconnect();
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
        };
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.on('telesession-disconnected', this.socketEventHandlers.disconnected);
            socket.on('appointment-fullfilled', this.socketEventHandlers.appointmentFullfilled);
            socket.on('check-session-response', this.socketEventHandlers.checkSession);
            socket.on('check-if-joined', this.socketEventHandlers.joinedAck);
        }
    }

    removeSocketHandler(event, handler) {
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.off(event, handler);
        }
    }

    clearPoll = () => {
        if (this.iv) {
            clearInterval(this.iv);
        }
    }

    handleBackButton = () => {
        return true;
    }

    componentDidMount() {
        BackHandler.addEventListener("hardwareBackPress", this.handleBackButton);
    }

    componentWillUnmount(): void {
        BackHandler.removeEventListener("hardwareBackPress", this.handleBackButton);
        this.clearPoll();
        this.removeSocketHandler('check-if-joined', this.socketEventHandlers.joinedAck);
        if(!this.sessionCompleted) {
            // This event will remove member( this.props.userId ) from the session.
            const socket = SocketClient.getInstance().getConnectedSocket();
            if (socket) {
                socket.emit("telesession-disconnect", {
                    appointmentId: this.props.appointmentId,
                    userId: this.props.userId,
                    willBeBack : false
                });
            }
        }
    }

    startPoll = () => {
        this.setState({isLoading: true});
        this.clearPoll();
        this.iv = setInterval(() => {
            try {
                // This event will get session status from the server .
                const socket = SocketClient.getInstance().getConnectedSocket();
                if (socket) {
                    socket.emit('check-session', {
                        userId: this.props.userId,
                        appointmentId: this.props.appointmentId,
                    });
                }
            } catch (e) {
                console.log(e);
            }
        }, 1000);
    };

    micPressed = () => {
        console.log('mic publisher video state' + this.state.publishAudio);
        this.setState(state => ({
            publishAudio: !state.publishAudio,
            micSelected: !state.micSelected
        }));
    };

    camPressed = () => {
        console.log("cam publisher video state" + this.state.publishVideo);
        this.setState(state => ({
            publishVideo: !state.publishVideo,
            camSelected: !state.camSelected
        }));
    };

    showDisconnect = () => {
        this.refs.disconnectModal.open()
    };

    hideDisconnect = () => {
        this.refs.disconnectModal.close()
    };

    navigateToLiveChat = () => {
        this.clearPoll();
        this.props.navigateToLiveChat();
    };

    callEnded = () => {
        this.clearPoll();
        this.sessionCompleted = true;
        this.props.callEnded();
    };


    render() {
        const {publishVideo, publishAudio} = this.state;
        const screenHeight = Math.round(Dimensions.get('window').height);
        // StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.state.isLoading) {
            return (
                <View style={styles.loadersty}>
                    <Text style={{alignSelf: 'center'}}>
                        Waiting for other participant...
                    </Text>
                    <LottieView
                        style={styles.alfie}
                        resizeMode="cover"
                        source={alfie}
                        autoPlay={true}
                        loop/>
                </View>
            );
        }
        return (
            <Container>
                <StatusBar backgroundColor='transparent' translucent animated showHideTransition="slide"/>
                <Header style={styles.chatHeader}>
                    <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                                    colors={["#fff", "#fff", "#fff"]}
                                    style={styles.headerBG}>
                        <View style={styles.headerContent}>
                            <Left style={{flex: 0.5}}>
                            </Left>

                            <Body style={styles.headerRow}>
                            <Image style={styles.avatar}
                                   resizeMode={"contain"}
                                   source={{uri: this.props.avatar ? this.props.avatar : this.props.S3_BUCKET_LINK + DEFAULT_IMAGE}}
                            />
                            <Title style={styles.headerText}>{this.props.name}</Title>
                            </Body>

                            <Right/>
                        </View>
                    </LinearGradient>
                </Header>
                {
                    this.props.hasConnectivityIssues && (
                        <View style={{height: 40, width: '100%', backgroundColor: '#EEE', flexDirection: 'row'}}>
                            <Text
                                style={{textAlign: 'center', alignSelf: 'center', width: '100%'}}>Reconnecting...</Text>
                        </View>
                    )
                }
                <Content>
                    <View style={styles.videoWrapper}>
                        <OTSession ref={ref => {
                        }} apiKey={this.props.apiKey} sessionId={this.props.sessionId} token={this.props.token}
                                   eventHandlers={this.sessionEventHandlers} options={this.sessionOptions}>
                            <OTSubscriber style={[styles.subscriberVideo, {height: screenHeight - HEADER_SIZE}]}
                                          eventHandlers={this.subscriberEventHandlers}
                            />
                            <OTPublisher properties={{publishVideo, publishAudio}}
                                         style={styles.publisherVideo}
                                         eventHandlers={this.publisherEventHandlers}/>
                        </OTSession>
                        <View style={styles.actionWrapper}>
                            <Button transparent style={styles.actionBtn} onPress={this.camPressed}>
                                <Image
                                    {...addTestID('vd-no-cam-png')}
                                    resizeMode={"contain"}
                                       source={this.state.camSelected ? require("./../../assets/images/vd-cam-selected.png") :
                                           require("./../../assets/images/vd-no-cam.png")
                                       } alt="Camera"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.micPressed}>
                                <Image
                                    {...addTestID('vd-mic-png')}
                                    resizeMode={"contain"}
                                       source={this.state.micSelected ? require("./../../assets/images/vd-mic-selected.png") :
                                           require("./../../assets/images/vd-mic.png")
                                       } alt="Mic"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.showDisconnect}>
                                <Image
                                    {...addTestID('vd-call-png')}
                                    resizeMode={"contain"}
                                       source={require("./../../assets/images/vd-call-end.png")} alt="End"/>
                            </Button>
                        </View>
                    </View>
                </Content>

                <Modal
                    backdropPressToClose={true}
                    backdropColor="rgba(37,52,92,0.35)"
                    backdropOpacity={1}
                    // onClosed={true}
                    style={[styles.modal, styles.modal4]}
                    entry={"bottom"}
                    position={"bottom"} ref={"disconnectModal"} swipeArea={100}>
                    <View style={styles.endWrapper}>
                        <View style={styles.arrowDown}>
                            <Ionicon name="ios-arrow-down" onPress={this.hideDisconnect} size={30} color="#4FACFE"/>
                        </View>
                        <GradientButton
                            testId = "wil-be-back"
                            text={'I will be Back'}
                            onPress={this.navigateToLiveChat}
                        />
                        <GradientButton
                            testId = "end-session"
                            text={'End Session'}
                            disabled={this.props.sessionEnded}
                            onPress={this.callEnded}
                        />
                    </View>
                </Modal>

            </Container>
        );
    }

}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderColor: '#f5f5f5',
        borderTopWidth: 0.5,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 24
    },
    modal4: {
        maxHeight: 240
    },
    endWrapper: {
        alignItems: 'center'
    },
    arrowDown: {
        marginBottom: 20
    },
    mainBG: {
        backgroundColor: "#F9F9F9",
    },
    chatHeader: {
        height: HEADER_SIZE,
        paddingLeft: 3,
        paddingRight: 0,
        elevation: 0,
        borderBottomColor: '#f5f5f5',
        backgroundColor: '#fff',
        borderBottomWidth: 1
    },
    headerContent: {
        flexDirection: "row"
    },
    headerBG: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 5,
        // marginTop: isIphoneX() ? MARGIN_X : MARGIN_NORMAL,
    },
    headerRow: {
        flex: 2,
        flexDirection: "row",
        alignItems: "center"
    },
    avatar: {
        borderRadius: Platform.OS === 'ios' ? 18 : 100,
        overflow: 'hidden',
        width: 35,
        height: 35,
        marginRight: 15
    },
    backButton: {
        marginLeft: 15
    },
    headerText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
        fontWeight: '400',
        textAlign: 'left',
        paddingLeft: 0
    },
    videoWrapper: {
        flex: 1,
        position: 'relative'
    },
    publisherVideo: {
        width: 150,
        height: 180,
        position: 'absolute',
        right: 10,
        top: 10,
        zIndex: 100
    },
    subscriberVideo: {
        width: '100%',
        flex: 1
    },
    actionWrapper: {
        display: 'flex',
        flexDirection: 'row',
        position: 'absolute',
        bottom: HEADER_SIZE,
        alignSelf: 'center',
    },
    actionBtn: {
        marginLeft: 8,
        marginRight: 8
    },
    loaderstyle: {
        position: "absolute",
        top: 0,
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
