import React, {Component} from 'react';
import {BackHandler, Dimensions, Image, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Body, Button, Container, Content, Header, Left, Right, Title} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {OTPublisher, OTSession, OTSubscriber, OTSubscriberView} from 'opentok-react-native';
import {addTestID, getHeaderHeight} from '../../utilities';
import {SocketClient,AlertUtil} from '../../utilities';
import Loader from '../Loader';
import {DEFAULT_IMAGE} from "../../constants";

const HEADER_SIZE = getHeaderHeight();

export class GroupCallComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            camSelected: true,
            micSelected: true,
            publishVideo: true,
            publishAudio: true,
            subscribeConnection: true,
            isLoading: true,
            sessionConnected: false,
            streams: {},
            totalMembersInSession:0,
            creationTime: ''
        };
        this.iv = null;
        this.sessionOptions = {
            androidOnTop: 'publisher',  // Android only - valid options are 'publisher' or 'subscriber'
            useTextureViews: true,
        };

        this.publisherEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the publisher: ${error}`);
            },
            streamCreated: () => {
                console.log('Publisher stream created');
            },
            streamDestroyed: (reason) => {
                console.log(`Publisher stream destroyed because: ${reason}`);
            },
        };
        this.subscriberEventHandlers = {
            error: (error) => {
                console.log(`There was an error with the subscriber: ${error}`);
            },
            connected: (subscriber) => {
                console.log(`Subscriber connected to the stream`);
                console.log(subscriber);
                const streamId = Platform.OS==='ios'?subscriber.streamId:subscriber.stream.streamId;
                const name = Platform.OS==='ios'?subscriber.connection.data:subscriber.stream.connection.data;
                let {totalMembersInSession,creationTime} = this.state;
                if(totalMembersInSession<1){
                    creationTime = subscriber.stream?.creationTime;
                }
                this.setState({
                    streams: {
                        ...this.state.streams,
                        [streamId]: {
                            name
                        },
                    },
                    totalMembersInSession : totalMembersInSession + 1,
                    creationTime:creationTime,

                });
            },
            disconnected: (subscriber) => {
                console.log(`Subscriber disconnected from the stream`);

            },
        };
        this.sessionEventHandlers = {
            streamCreated: event => {
                console.log('Stream created!', event);

            },
            streamDestroyed: event => {
                console.log('Stream destroyed!', event);
                const {streams} = this.state;
                delete streams[event.streamId];
                this.setState({
                    streams,
                });
            },
            connectionDestroyed: event => {
                console.log('Connection Destroyed');
            },
            sessionConnected: event => {
                this.setState({sessionConnected: true});
                this.notifyConnected();
                console.log(`sessionConnected: ${event}`);
            },
            sessionDisconnected: (reason) => {
                console.log(`sessionDisconnected: ${reason}`);
            },
        };
    }


    handleBackButton = () => {
        return true;
    };

    async componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
        SocketClient.getInstance().registerConnectivityCallbacks('GROUP_CALL', () => {
            this.notifyDisconnected();
        }, () => {
            this.notifyConnected();
        });
        const groupCallParams = await this.props.startOrJoin(this.props.group.channelUrl);
        console.log(groupCallParams);
        if (groupCallParams.errors) {
            AlertUtil.showErrorMessage(groupCallParams.errors[0].endUserMessage);
            this.props.goBack();
        } else {
            this.setState({
                sessionId: groupCallParams.sessionId,
                token: groupCallParams.sessionToken,
                isLoading: false,
            });
        }
    }

    componentWillUnmount(): void {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
        SocketClient.getInstance().unregisterConnectivityCallbacks('GROUP_CALL');
        this.notifyDisconnected();
    }


    micPressed = () => {
        console.log('mic publisher video state' + this.state.publishAudio);
        this.setState(state => ({
            publishAudio: !state.publishAudio,
            micSelected: !state.micSelected,
        }));
    };

    camPressed = () => {
        console.log('cam publisher video state' + this.state.publishVideo);
        this.setState(state => ({
            publishVideo: !state.publishVideo,
            camSelected: !state.camSelected,
        }));
    };


    callEnded = () => {
        console.log('Call Ended');
        this.notifyDisconnected();
        let {sessionId,totalMembersInSession,creationTime} = this.state;
        const payload = {
            sessionId,
            creationTime,
            totalMembersInSession:totalMembersInSession+1
        }
        if(this.props.showDonations) {
            this.props.showDonations(payload);
        } else {
            this.props.sessionCompletedByProvider(payload);
        }
    };

    notifyDisconnected = () => {
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.emit('group-call-left', {
                channelUrl: this.props.group.channelUrl,
            });
        }
    };
    notifyConnected = () => {
        const socket = SocketClient.getInstance().getConnectedSocket();
        if (socket) {
            socket.emit('group-call-joined', {
                channelUrl: this.props.group.channelUrl,
            });
        }
    };


    renderSubscribers = (subscribers) => {
        return subscribers.map((streamId) => (
            <TouchableOpacity
                key={streamId}
                style={{ height: 180, width: 180, position: 'relative' }}
            >
                <OTSubscriberView streamId={streamId} style={{ height: 180, width: 180 }}/>
                <View style={{ zIndex: 100, position: 'absolute', bottom: 5, left: 10}}>
                    <Text style={{ color: '#FFF', fontSize: 16}}>{this.state.streams[streamId]?.name}</Text>
                </View>
            </TouchableOpacity>
        ));
    };

    render() {
        const {publishVideo, publishAudio} = this.state;
        const { S3_BUCKET_LINK } = this.props;
        const screenHeight = Math.round(Dimensions.get('window').height);
        // StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.state.isLoading) {
            return (
                <Loader/>
            );
        }
        return (
            <Container>
                <Header style={styles.chatHeader}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                        translucent
                        barStyle={'dark-content'}
                    />
                    <LinearGradient start={{x: 0, y: 1}} end={{x: 1, y: 0}}
                                    colors={['#fff', '#fff', '#fff']}
                                    style={styles.headerBG}>
                        <View style={styles.headerContent}>
                            <Left style={{flex: 0.5}}>
                                {/*<Button transparent style={styles.backButton} onPress={this.props.goBack}>*/}
                                {/*    <Icon name="angle-left" size={32} color="#fff"/>*/}
                                {/*</Button>*/}
                            </Left>

                            <Body style={styles.headerRow}>
                                <Image style={styles.avatar}
                                       resizeMode={'cover'}
                                       source={{uri: this.props.group.avatar ? this.props.group.avatar : S3_BUCKET_LINK + DEFAULT_IMAGE}}
                                />
                                <Title style={styles.headerText}>{this.props.group.name}</Title>
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
                <Content style={{ backgroundColor: '#FFF' }}>
                    <View style={styles.videoWrapper}>
                        <OTSession
                            style={styles.mainWrapper}
                            ref={ref => {
                        }} apiKey={this.props.apiKey} sessionId={this.state.sessionId} token={this.state.token}
                                   eventHandlers={this.sessionEventHandlers} options={this.sessionOptions}>



                            <View style={styles.publisherBox}>
                                <OTPublisher properties={{publishVideo, publishAudio}}
                                             style={styles.publisherVideo}
                                             eventHandlers={this.publisherEventHandlers}/>
                                <View style={{ zIndex: 101, position: 'absolute', bottom: 5, left: 10}}>
                                    <Text style={{ color: '#6078ea', fontSize: 18}}>You</Text>
                                </View>
                            </View>

                            <OTSubscriber subscribeToSelf={true}
                                          style={[styles.subscriberVideo, {height: screenHeight - HEADER_SIZE}]}
                                          eventHandlers={this.subscriberEventHandlers}>
                                {this.renderSubscribers}
                            </OTSubscriber>


                        </OTSession>

                    </View>


                </Content>

                {!this.state.sessionConnected ?
                    (<Loader/>)
                    : Object.keys(this.state.streams).length === 0 && (
                    <View style={styles.waitingText}>
                        <Text style={{fontSize: 20}}> Waiting for others to join</Text>
                    </View>)
                }
                {
                    this.state.sessionConnected && (
                        <View style={styles.actionWrapper}>

                            <Button transparent style={styles.actionBtn} onPress={this.camPressed}>
                                <Image
                                    {...addTestID('vd-no-cam-png')}
                                    resizeMode={'contain'}
                                       source={this.state.camSelected ? require('./../../assets/images/vd-cam-selected.png') :
                                           require('./../../assets/images/vd-no-cam.png')
                                       } alt="Camera"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.micPressed}>
                                <Image
                                    {...addTestID('vd--mic-png')}
                                    resizeMode={'contain'}
                                       source={this.state.micSelected ? require('./../../assets/images/vd-mic-selected.png') :
                                           require('./../../assets/images/vd-mic.png')
                                       } alt="Mic"/>
                            </Button>
                            <Button transparent style={styles.actionBtn} onPress={this.callEnded}>
                                <Image
                                    {...addTestID('vd-call-png')}
                                    resizeMode={'contain'}
                                       source={require('./../../assets/images/vd-call-end.png')} alt="End"/>
                            </Button>
                        </View>
                    )
                }
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
    avatar: {
        borderRadius: Platform.OS === 'ios' ? 18 : 100,
        overflow: 'hidden',
        width: 35,
        height: 35,
        marginRight: 15,
    },
    backButton: {
        marginLeft: 15,
    },
    headerText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
        fontWeight: '400',
        textAlign: 'left',
        paddingLeft: 0,
    },
    videoWrapper: {
        flex: 1,
        position: 'relative',
    },
    mainWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingTop: 15
    },
    publisherVideo: {
        width: 180,
        height: 180,
        // position: 'absolute',
        // right: 10,
        // top: 10,
        zIndex: 10,
        position: 'relative'
    },
    publisherBox: {
        width: 180,
        height: 180,
        zIndex: 10,
        position: 'relative'
    },
    subscriberVideo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        backgroundColor: '#999',
        flexWrap: 'wrap'
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
        marginRight: 8,
    },
    loaderstyle: {
        position: 'absolute',
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
    waitingText: {
        position: 'absolute',

        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
