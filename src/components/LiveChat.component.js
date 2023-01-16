import React, {Component} from 'react';
import {
    Dimensions, FlatList,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import {Body, Button, Container, Content, Header, Left, Right, Title,ListItem} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {GiftedChat, Send} from 'react-native-gifted-chat';
import LottieView from 'lottie-react-native';
import alfie from '../assets/animations/alfie-face-new';
import {
    addTestID,
    AlertUtil,
    getAvatar,
    getDSTOffset,
    getHeaderHeight,
    getTimeByDSTOffset,
    getTimeDifference,
    isIphone12,
    isIphoneX,
    isTimeElapsed,
    SocketClient
} from '../utilities';
import {DEFAULT_IMAGE} from '../constants';
import CustomMessage from './CustomMessage';
import CustomComposer from './CustomComposer';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Overlay from 'react-native-modal-overlay';
import moment from 'moment';
import ImagePicker from 'react-native-image-picker';
import {PERMISSIONS, request} from 'react-native-permissions';
import Fontisto from "react-native-vector-icons/Fontisto";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {Colors, CommonStyles, TextStyles} from "../styles";
import {CommonChatBanner} from './CommonChatBanner';
import {TransactionSingleActionItem} from 'ch-mobile-shared';
import AntIcons from 'react-native-vector-icons/AntDesign';
import FeatherIcons from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modalbox';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Analytics from '@segment/analytics-react-native';
import {Screens} from "../../../../src/constants/Screens";
import {CONTACT_NOTES_FLAGS, CONTACT_NOTES_STATUS} from "../../../../src/constants/CommonConstants";
import ViewMoreText from "react-native-view-more-text";
import {CheckBox} from "react-native-elements";
import {PrimaryButton} from "./PrimaryButton";

const HEADER_SIZE = getHeaderHeight();
const {width} = Dimensions.get('window');

const ActiveInActiveOptions = [
    {
        id: "activeChat",
        name: 'Active in chat',
        value: false,
        description: "Select to add in active group section",
    },
    {
        id: "inActiveChat",
        name: 'Inactive in chat',
        value: false,
        description: "Select to remove active group section",
    }
];

export default class LiveChatComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            appointment: this.props.appointment,
            confirmModal: false,
            attachmentIconVisible: true,
            fileUploaderVisible: false,
            ifTyping: true,
            modalHeightProps: {
                height: 0
            },
            activeInActiveChatStatus: this.populateData(ActiveInActiveOptions, this.props.connection?.inActiveChat),
            openChatStatusModal : false,
        };

    }

    showFileModal = () => {
        this.setState({
            fileUploaderVisible: true,
        });
    };

    startSessionTimer = () => {
        this.clearSessionTimer();
        if (this.state.appointment) {
            this.iv = setInterval(() => {
                if (this.isMissed(this.state.appointment.startTime)) {
                    if (this.props.checkNextAppointmentForToday) {
                        this.props.checkNextAppointmentForToday();
                    }
                    this.clearSessionTimer();
                }
                this.setState({...this.state});
            }, 1000);
        }

    };

    clearSessionTimer = () => {
        if (this.iv) {
            clearInterval(this.iv);
            this.iv = null;
        }
    };

    componentDidMount(): void {
        this.startSessionTimer();
        this.checkGroupCallActive();
    }

    componentWillUnmount(): void {
        this.clearSessionTimer();
    }

    checkGroupCallActive() {
        if (this.props.connection.type === 'CHAT_GROUP') {
            const socket = SocketClient.getInstance().getConnectedSocket();
            if (socket) {
                socket.emit('check-group-call-active', {
                    channelUrl: this.props.connection.channelUrl,
                });
            }
        }

    }


    connectionStatus = {
        '0': 'Connecting...',
        '1': 'Chat Connected',
        '2': 'Fetching Messages',
        '3': 'Privacy Prompt Required',
        '4': 'Ready to Chat',
        '5': 'Failed to connect',
        '6': 'Closed',
        '7': 'Fetching Provider Details',
        '8': 'Preparing Session',
    };

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if (this.props.appointment !== prevProps.appointment) {
            this.setState({
                appointment: this.props.appointment,
            }, () => {
                this.startSessionTimer();
            });

        }
    }

    sendMessage = messages => {
        Keyboard.dismiss();
        this.composerTextUpdated('');
        messages.forEach((eachMessage) => {
            if (eachMessage.text && eachMessage.text.trim().length !== 0) {
                this.props.sendMessage({
                    payload: {
                        message: eachMessage,
                    },
                });
                Analytics.track(`Chat - Message Sent to ${this.props.isProviderApp ? 'Member':'Provider'}`)
            }
        });
    };

    onClose() {
        this.refs.moreOptionsDrawer.close();
    }

    showModal() {
        Keyboard.dismiss();
        this.refs.moreOptionsDrawer.open();
    }

    showLeaveModal = (type) => {
        this.onClose();
        this.setState({
            modalVisible: false,
            confirmModal: true,
            type: type
        });
    };

    shareGroup = async (channel) => {
        this.onClose();
        await this.props.shareGroup(channel);
    };

    confirmLeaveGroup = (type) => {
        if (type === 'LEAVE') {
            this.props.leaveGroup();
        } else if (type === 'DELETE') {
            this.props.deleteGroup();
        }
        this.setState({
            confirmModal: false,
        });
    };

    showConnectionProfile = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.showConnectionProfile(true);
    };

    assignContent = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.assignContent();
    };


    bookAppointmentWithMember = ()=>{
        this.setState({
            modalVisible: false,
        });
        const isPatientProhibitive=this.checkPatientProhibitive()
        if(isPatientProhibitive)
        {
            this.props.navigation.navigate(Screens.MEMBER_PROHIBITIVE_SCREEN, {
                selectedMember: this.state.selectedMember
            });
        }else
        {
            this.props.bookAppointmentWithMember();
        }

    };

    checkPatientProhibitive = () =>{
        const contactNotes=this.props.connection?.contactNotes
        let isPatientProhibitive = false
        for (let contactNote of contactNotes) {
            if(contactNote.flag === CONTACT_NOTES_FLAGS.PROHIBITIVE && contactNote.status===CONTACT_NOTES_STATUS.ACTIVE)
            {
                isPatientProhibitive=true;
                break;
            }
        }
        return isPatientProhibitive;
    }
    assignAssessment = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.assignAssessment();
    };

    requestAppointment = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.requestAppointment();
    };

    shareProviderProfile = async (channel) => {
        await this.props.shareProviderProfile(channel);
    };

    navigateToTelehealth = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.navigateToTelehealth();
    };

    isMissed = (appt) => {
        return moment(appt.endTime).diff(moment(), 'minutes') < 0;
    };

    getDSTOffsetDetails = (appointmentStartTime)=>{
        let startDate;
        let dateAfterDSTOffset = getTimeByDSTOffset(appointmentStartTime).utcOffset();
        let dateBeforeDSTOffset = moment(appointmentStartTime).utcOffset();
        if(dateAfterDSTOffset === dateBeforeDSTOffset){
            startDate =  moment(appointmentStartTime).format('YYYY-MM-DDTHH:mm:ss.sssZ');
        }
        else if(dateAfterDSTOffset<dateBeforeDSTOffset){
            startDate=  moment(appointmentStartTime).subtract(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ');
        }else{
            startDate=  moment(appointmentStartTime).add(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ');
        }
        return startDate
    }



    renderSessionTimer = () => {
        const dstOffset = getDSTOffset();
        let startTime = this.getDSTOffsetDetails(moment(this.state.appointment.startTime,'YYYY-MM-DDTHH:mm:ss.sssZ').utcOffset(dstOffset).format('YYYY-MM-DDTHH:mm:ss.sssZ'));
        const timeDifference = getTimeDifference(startTime);
        let mainText = 'Session starts in ' + this.prependZeroes(timeDifference.hours)+":"+this.prependZeroes(timeDifference.minutes)+":"+this.prependZeroes(timeDifference.seconds);
        if(isTimeElapsed(startTime)) {
            mainText = 'Your session time has been started';
        }
        return (
            <CommonChatBanner
                onPress={() => {
                    this.props.startSession(this.state.appointment);
                }}
                gredientColor1={Colors.colors.mainBlue}
                gredientColor2={Colors.colors.mainBlue}
                iconType={'Feather'}
                iconName={'clock'}
                iconColor={Colors.colors.primaryIcon}
                mainText={mainText}
                subText={'Go to the waiting room'}
                nextIcon={true}
            />
        );
    };

    renderGroupCallBanner = () => {
        return (
            <CommonChatBanner
                onPress={() => {
                    this.props.navigateToGroupCall();
                }}
                gredientColor1={Colors.colors.mainBlue}
                gredientColor2={Colors.colors.mainBlue}
                iconType={'Feather'}
                iconName={'clock'}
                iconColor={Colors.colors.primaryIcon}
                mainText={'A Group session has been started'}
                nextIcon={true}
            />
        );
    };

    renderEmergencyCallBanner = () => {
        return (
            <CommonChatBanner
                gredientColor1={Colors.colors.mainPink}
                gredientColor2={Colors.colors.mainPink}
                iconType={'AntDesign'}
                iconName={'warning'}
                iconColor={Colors.colors.mainPink}
                mainText={'If this an emergency call 911'}
                subText={'Confidant is not an emergency service. Our providers typically respond within 24hrs.'}
                nextIcon={false}
            />
        );
    };

    navigateToGroupCall = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.navigateToGroupCall();
    };

    prependZeroes = (value) => {
        if (parseInt(value) < 10) {
            return '0' + value;
        } else {
            return value;
        }
    };


    requestAppointmentByMatchmaker = () => {
        this.setState({
            modalVisible: false,
        });
        this.props.requestAppointmentByMatchmaker();

    };

    onLayout(event) {
        const {height} = event.nativeEvent.layout;
        const newLayout = {
            height: height
        };
        setTimeout(() => {
            this.setState({modalHeightProps: newLayout});
        }, 10)

    }

    moreOptionsDrawerClose = () => {
        this.refs.moreOptionsDrawer.close();
        this.setState({
            modalHeightProps: {
                height: 0,

            }
        });
    };


    /**
     * @function populateData
     * @description This method is used to populate data
     */
    populateData = (ActiveInActiveOptions, inActiveChat) => {
        return ActiveInActiveOptions.map(item => {
            return {
                ...item,
                value: (inActiveChat && item.id === "activeChat") ? true : (!inActiveChat && item.id === "inActiveChat")
            }
        });
    }




    /**
     * @function setChatStatus
     * @description This method is used to set chat status
     */
    setChatStatus = (listValue) => {
        let {activeInActiveChatStatus} = this.state;
        if (listValue.item.value === false) {
            const updateData = activeInActiveChatStatus.map(item => {
                return {
                    ...item,
                    value: !item.value,
                }
            })
            this.setState({activeInActiveChatStatus: updateData})
        }
    }

    /**
     * @function renderViewMore
     * @description This method is used to render more content
     */

    renderViewMore = (onPress) => {
        return (
            <View style={styles.readMoreButton}>
                <Text style={styles.readMoreButtonText} onPress={onPress}>Read more</Text>
                <FeatherIcons onPress={onPress} size={24} color={Colors.colors.primaryIcon} name="arrow-right"/>
            </View>
        )
    }

    /**
     * @function renderViewLess
     * @description This method is used to render less
     */


    renderViewLess = (onPress) => {
        return (
            <View style={styles.readMoreButton}>
                <Text style={styles.readMoreButtonText} onPress={onPress}>Read less</Text>
                <FeatherIcons onPress={onPress} size={24} color={Colors.colors.primaryIcon} name="arrow-up"/>
            </View>
        )
    }

    /**
     * @function renderOption
     * @description This method is used to render each option from the list
     */
    renderOption = (listValue) => {
        const isChecked = listValue.item.value;
        return (
            <ListItem
                {...addTestID(listValue?.item?.id)}
                key={listValue.item.id}
                onPress={() => {
                    this.setChatStatus(listValue)
                }}
                style={listValue.item.value
                    ? styles.multiListSelected
                    : styles.multiList}
            >
                <View style={styles.checkListText}>
                    <Text style={styles.multiListText}>{listValue?.item?.name}</Text>
                    <ViewMoreText
                        numberOfLines={3}
                        renderViewMore={this.renderViewMore}
                        renderViewLess={this.renderViewLess}
                        textStyle={{textAlign: 'left'}}>
                        <Text numberOfLines={3} style={styles.multiListSubText}>{listValue?.item?.description}</Text>
                    </ViewMoreText>

                </View>

                <CheckBox
                    {...addTestID(this.props?.checkTestId)}
                    checkedIcon="check"
                    iconType='Feather'
                    size={24}
                    checkedColor={Colors.colors.whiteColor}
                    uncheckedIcon=""
                    containerStyle={
                        isChecked ? [styles.multiCheck, styles.multiCheckSelected] : styles.multiCheck
                    }
                    checked={isChecked}
                    onPress={() => {
                        this.setChatStatus(listValue)
                    }}

                />

            </ListItem>
        )
    }

    /**
     * @function backModal
     * @description This method is used to navigate to back
     */
    backModal = () => {
        this.setState({openChatStatusModal : false});
    }


    /**
     * @function renderChatStatusSection
     * @description This method is used to render chat status section
     */
    renderChatStatusSection = () => {
        const {activeInActiveChatStatus} = this.state;
        return (
            <View
                onLayout={(event) => this.onLayout(event)}
                style={{...styles.actionList,  marginBottom: Platform.OS === 'ios' ? 20 : 40}}>
                <View style={{
                    ...styles.btnOptions, display: 'flex', alignItems: 'center',
                    flexDirection: 'row', paddingRight: 24, marginLeft: 0
                }}>
                    <Button
                        {...addTestID('back-btn')}
                        transparent
                        style={styles.backButton}
                        onPress={this.backModal}>
                        <EntypoIcons size={30} color={Colors.colors.mainBlue} name="chevron-thin-left"/>
                    </Button>
                    <Text style={styles.mainHeading}>Update chat status</Text>
                </View>
                <View style={{marginBottom: 32}}>
                    <FlatList
                        data={activeInActiveChatStatus}
                        renderItem={this.renderOption}
                        keyExtractor={item => item.name}
                    />
                </View>
                <View style={styles.gradientWrapper}>
                    <PrimaryButton
                        testId="edit-profile"
                        onPress={() => {
                            this.props?.updateChatStatus(activeInActiveChatStatus)
                        }}
                        text={"Update chat status"}/>
                </View>
            </View>
        )
    }

    /**
     * @function renderPageMainModal
     * @description This method is used to render page main model.
     */
    renderChatStatusModal = () => {
        const {modalDetails} = this.state;
        return (<Modal
            backdropPressToClose={true}
            backdropColor={Colors.colors.overlayBg}
            backdropOpacity={1}
            isOpen={true}
            onClosed={() => {
                this.setState({openChatStatusModal : false})
            }}
            style={{
                ...CommonStyles.styles.commonModalWrapper,
                height: modalDetails?.maxHeight || 'auto',
                position: 'absolute',
                paddingLeft:  0,
                paddingRight: 0,
                paddingBottom: isIphoneX() ? 35 : 0
            }}
            entry={"bottom"}
            position={"bottom"}
            ref={this.state.modalDetails?.ref}
            swipeArea={100}>
            <View style={{...CommonStyles.styles.commonSwipeBar}}/>
            {this.renderChatStatusSection()}
        </Modal>)
    }

    render() {
        const { S3_BUCKET_LINK } = this.props;
        if (this.props.connectionStatus !== 3 && this.props.connectionStatus !== 4) {
            return (
                <View style={styles.loadersty}>
                    <Text style={{alignSelf: 'center'}}>
                        {this.connectionStatus[this.props.connectionStatus]}
                    </Text>
                    <LottieView
                        style={styles.alfie}
                        resizeMode="cover"
                        source={alfie}
                        autoPlay={true}
                        loop/>
                </View>);
        }
        if (this.props.connectionStatus === 5) {
            this.props.goBack();
            return null;
        }

        const isConnected = !!this.props.connections?.activeConnections.find(conn => conn.connectionId === this.props.connection?.connectionId);
        return (
            <Container style={styles.mainBG}>
                <Header transparent style={styles.chatHeader}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'dark-content'}
                    />
                    {/*Back Button ---- Start */}
                    <Left onPress={this.props.goBack} style={{flex: 0, width: 64}}>
                        {
                            this.state.modalVisible ?
                                null :
                                <Button
                                    {...addTestID('back-btn')}
                                    transparent
                                    style={styles.backButton}
                                    onPress={this.props.goBack}>
                                    <EntypoIcons size={30} color={Colors.colors.mainBlue} name="chevron-thin-left"/>
                                </Button>
                        }

                    </Left>
                    {/*Back Button ---- End */}

                    <Body style={styles.headerRow}>
                        {
                            this.state.modalVisible ?
                                <Title style={[styles.headerText, {paddingLeft: 50}]}>Actions</Title> :
                                <TouchableOpacity
                                    {...addTestID('show-connection-profile')}
                                    onPress={this.showConnectionProfile}>
                                    <View style={styles.avatarContainer}>

                                        <View style={{...styles.avatarBorder,
                                            borderWidth: this.props.connection?.profileHighlightedColor ? 2 : 0 ,
                                            borderColor: this.props.connection?.profileHighlightedColor ? this.props.connection?.profileHighlightedColor : ""}}>
                                        <Image style={styles.avatar}
                                            resizeMode={'cover'}
                                               source={{
                                                   uri: this.props.connection.profilePicture ?
                                                       getAvatar({profilePicture: this.props.connection.profilePicture}, this.props.S3_BUCKET_LINK)
                                                       : S3_BUCKET_LINK + DEFAULT_IMAGE
                                               }}/>
                                        </View>
                                        {/*{this.props.connection.profilePicture ?*/}
                                        {/*    <Image style={styles.avatar} resizeMode={'cover'}*/}
                                        {/*           source={{uri: this.props.connection.profilePicture ? getAvatar({profilePicture: this.props.connection.profilePicture}) : S3_BUCKET_LINK + DEFAULT_IMAGE}}/>*/}
                                        {/*    :*/}
                                        {/*    <View style={{*/}
                                        {/*        ...styles.proBg,*/}
                                        {/*        backgroundColor: this.props.connection.colorCode ? this.props.connection.colorCode : DEFAULT_AVATAR_COLOR,*/}
                                        {/*    }}><Text*/}
                                        {/*        style={styles.proLetter}>{this.props.connection.name.charAt(0).toUpperCase()}</Text></View>*/}
                                        {/*}*/}
                                        {/*<View*/}
                                        {/*    style={this.state.providerInfo.connectionStatus === 'online' ? styles.state : styles.stateGrey}/>*/}

                                        <Title style={styles.headerText}>{this.props.connection.name}</Title>
                                    </View>
                                </TouchableOpacity>

                        }
                    </Body>

                    <Right
                        {...addTestID('chat-menu')}
                    >
                        {
                            this.props.connection.type !== 'CHAT_GROUP' ? (this.state.modalVisible ?
                                    (<Button transparent
                                             style={{marginRight: 10}}
                                             onPress={() => {
                                                 this.onClose();
                                             }}
                                    >
                                        <Ionicon {...addTestID('three-dots')}
                                                 name='md-close' size={30}
                                                 color={Colors.colors.primaryIcon}/>
                                    </Button>) : (
                                        <Button transparent
                                                {...addTestID('dots')}
                                                style={{zIndex: 10, marginRight: 10}}
                                                onPress={() => {
                                                    this.showModal();
                                                }}
                                        >
                                            <Ionicon {...addTestID('three-dots')}
                                                     name='ios-more' size={30}
                                                     color={Colors.colors.primaryIcon}/>
                                        </Button>))
                                :
                                (this.state.modalVisible ?
                                    (<Button transparent
                                             style={{marginRight: 10}}
                                             onPress={() => {
                                                 this.onClose();
                                             }}
                                    >
                                        <Ionicon {...addTestID('three-dots')}
                                                 name='md-close' size={30}
                                                 color={Colors.colors.primaryIcon}/>
                                    </Button>) : (
                                        <Button transparent
                                                style={{zIndex: 10, marginRight: 10}}
                                                onPress={() => {
                                                    this.showModal();
                                                }}
                                        >
                                            <Ionicon {...addTestID('three-dots')}
                                                     name='ios-more' size={30}
                                                     color={Colors.colors.primaryIcon}/>
                                        </Button>))
                        }

                        {/*{*/}
                        {/*    this.props.isTelehealthEnabled && (*/}
                        {/*        <Button transparent onPress={() => this.props.navigateToTelehealth()}>*/}
                        {/*            <Icon style={styles.videoIcon} name="videocamera" size={20}*/}
                        {/*                  color="#fff"/>*/}
                        {/*        </Button>*/}
                        {/*    )*/}
                        {/*}*/}

                    </Right>
                </Header>
                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.moreOptionsDrawerClose}
                    style={{
                        ...CommonStyles.styles.commonModalWrapper,
                        height : 'auto',
                        position: 'absolute'
                        // bottom: this.state.modalHeightProps.height,
                    }}
                    entry={'bottom'}
                    position={'bottom'} ref={'moreOptionsDrawer'} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}/>
                    <Content
                        showsVerticalScrollIndicator={false}>
                        <View
                            // onLayout={(event) => this.onLayout(event)}
                            style={{width: '100%'}}>
                            {
                                this.props.connection.type !== 'CHAT_GROUP' ?
                                    <View>
                                        <View style={styles.singleActionItem}>
                                            <TransactionSingleActionItem
                                                onPress={this.showConnectionProfile}
                                                title={this.props.connection.type === 'PATIENT' ?
                                                    'View Member Profile' :
                                                    (this.props.connection.type === 'MATCH_MAKER' ?
                                                        'View Matchmaker Profile' : 'View Provider Profile')}
                                                iconBackground={Colors.colors.primaryColorBG}
                                                styles={styles.gButton}
                                                renderIcon={(size, color) =>
                                                    <FeatherIcons size={22} color={Colors.colors.primaryIcon} name="eye"/>
                                                }
                                            />
                                        </View>
                                        {
                                            this.props?.isProviderApp  && this.props?.connection?.type === 'PATIENT' && isConnected && (
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        title={'Update chat status'}
                                                        iconBackground={Colors.colors.whiteColor}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <Image
                                                                style={styles.planImage}
                                                                resizeMode="contain"
                                                                source={require("../assets/images/chat-status.png")}
                                                            />
                                                        }
                                                        onPress={() => {
                                                            this.moreOptionsDrawerClose();
                                                            setTimeout(()=>{
                                                                this.setState({openChatStatusModal : true})
                                                            },1000)
                                                        }}
                                                    />
                                                </View>
                                            )
                                        }
                                        {this.props.connection.type === 'PRACTITIONER' && !this.props.isProviderApp && (
                                            <View style={styles.singleActionItem}>
                                                <TransactionSingleActionItem
                                                    onPress={this.requestAppointment}
                                                    title={'Schedule Appointment'}
                                                    iconBackground={Colors.colors.errorBG}
                                                    styles={styles.gButton}
                                                    renderIcon={(size, color) =>
                                                        <MaterialCommunityIcons
                                                            name='calendar-clock'
                                                            size={25}
                                                            color={Colors.colors.errorIcon}
                                                        />
                                                    }
                                                />
                                            </View>
                                        )}

                                        {this.props.connection.type === 'PRACTITIONER' && (
                                            <View style={styles.singleActionItem}>
                                                <TransactionSingleActionItem
                                                    onPress={() => {
                                                        this.shareProviderProfile('facebook');
                                                    }}
                                                    title={'Share Provider Profile'}
                                                    iconBackground={Colors.colors.warningBG}
                                                    styles={styles.gButton}
                                                    renderIcon={(size, color) =>
                                                        <Fontisto
                                                            reversed
                                                            name='share-a'
                                                            size={size}
                                                            color={Colors.colors.warningIcon}
                                                        />
                                                    }
                                                />
                                            </View>
                                        )}

                                        {this.props.isProviderApp && this.props.connection.type === 'PATIENT' && (
                                            <>
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={this.assignContent}
                                                        title={'Assign Content'}
                                                        iconBackground={Colors.colors.errorBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <FeatherIcons
                                                                name='book-open'
                                                                size={22}
                                                                color={Colors.colors.errorIcon}
                                                            />
                                                        }
                                                    />
                                                </View>
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={this.assignAssessment}
                                                        title={'Assign a New Chatbot'}
                                                        iconBackground={Colors.colors.successBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <FontAwesome5
                                                                name='clipboard-list'
                                                                size={22}
                                                                color={Colors.colors.successIcon}
                                                            />
                                                        }
                                                    />
                                                </View>
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={this.bookAppointmentWithMember}
                                                        title={'Book Appointment'}
                                                        iconBackground={Colors.colors.secondaryColorBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <FontAwesome5
                                                                name='calendar-alt'
                                                                size={22}
                                                                color={Colors.colors.secondaryIcon}
                                                            />
                                                        }
                                                    />
                                                </View>
                                            </>

                                        )}
                                        {/*{this.props.isProviderApp && this.props.connection.type === 'PATIENT' && (*/}
                                        {/*    */}
                                        {/*)}*/}

                                    </View>
                                    :
                                    <View>
                                        <View style={styles.singleActionItem}>
                                            <TransactionSingleActionItem
                                                onPress={this.navigateToGroupCall}
                                                title={this.props.connection.groupCallActive ?
                                                    'Join Session' : 'Start Group Session'}
                                                iconBackground={Colors.colors.successBG}
                                                styles={styles.gButton}
                                                renderIcon={(size, color) =>
                                                    this.props.connection.groupCallActive ?
                                                        <MaterialCommunityIcons
                                                            name='call-merge'
                                                            size={26}
                                                            color={Colors.colors.successIcon}
                                                        /> :
                                                        <MaterialCommunityIcons
                                                            name='account-group'
                                                            size={22}
                                                            color={Colors.colors.successIcon}
                                                        />

                                                }
                                            />
                                        </View>
                                        {
                                            this.props.groupResponse && this.props.groupResponse.groupTypePublic && (
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={() => {
                                                            this.shareGroup('facebook')
                                                        }}
                                                        title={'Share Group'}
                                                        iconBackground={Colors.colors.warningBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <Fontisto
                                                                reversed
                                                                name='share-a'
                                                                size={size}
                                                                color={Colors.colors.warningIcon}
                                                            />
                                                        }
                                                    />
                                                </View>
                                            )
                                        }

                                        {
                                            this.props.groupResponse && this.props.groupResponse.isAdmin && (
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={() => this.showLeaveModal('DELETE')}
                                                        title={'Delete Group'}
                                                        iconBackground={Colors.colors.errorBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <FontAwesome
                                                                name='trash-o'
                                                                size={18}
                                                                color={Colors.colors.errorIcon}
                                                            />
                                                        }
                                                    />
                                                </View>
                                            )
                                        }

                                        {
                                            this.props.groupResponse && this.props.groupResponse.isAdmin && (
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={this.props.navigateToManageGroupScreen}
                                                        title={'Manage Group'}
                                                        iconBackground={Colors.colors.primaryColorBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color) =>
                                                            <AntIcons size={22} color={Colors.colors.primaryIcon} name="user"/>
                                                        }
                                                    />
                                                </View>
                                            )
                                        }


                                        {
                                            this.props.groupResponse && !this.props.groupResponse.isAdmin && (
                                                <View style={styles.singleActionItem}>
                                                    <TransactionSingleActionItem
                                                        onPress={() => this.showLeaveModal('LEAVE')}
                                                        title={'Leave Group'}
                                                        iconBackground={Colors.colors.errorBG}
                                                        styles={styles.gButton}
                                                        renderIcon={(size, color, paramStyle) =>
                                                            <MaterialIcons
                                                                name='logout'
                                                                size={18}
                                                                color={Colors.colors.errorIcon}
                                                                style={{
                                                                    ...paramStyle,
                                                                    transform: [{rotateY: '180deg'}]
                                                                }}
                                                            />
                                                        }
                                                    />
                                                </View>
                                            )
                                        }
                                    </View>
                            }
                        </View>
                    </Content>
                </Modal>

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    // onClosed={true}
                    style={{...CommonStyles.styles.commonModalWrapper, maxHeight: 240}}
                    entry={'bottom'}
                    position={'bottom'} ref={'bookApptDrawer'} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}/>
                    <View style={styles.bookActionList}>
                        <View style={styles.singleAction}>
                            <TransactionSingleActionItem
                                onPress={this.navigateToProviders}
                                title={'Book with a provider'}
                                iconBackground={Colors.colors.primaryColorBG}
                                styles={styles.gButton}
                                renderIcon={(size, color) =>
                                    <AntIcons size={22} color={Colors.colors.primaryIcon} name="user"/>
                                }
                            />
                        </View>
                        <View style={styles.singleAction}>
                            <TransactionSingleActionItem
                                title={'Book by service'}
                                onPress={this.navigateToServices}
                                iconBackground={Colors.colors.secondaryColorBG}
                                styles={styles.gButton}
                                renderIcon={(size, color) =>
                                    <AntIcons size={22} color={Colors.colors.secondaryIcon} name="appstore-o"/>
                                }
                            />
                        </View>
                        {/*<View style={styles.singleAction}>*/}
                        {/*    <TransactionSingleActionItem*/}
                        {/*        title={'Join group'}*/}
                        {/*        iconBackground={Colors.colors.successBG}*/}
                        {/*        styles={styles.gButton}*/}
                        {/*        renderIcon={(size, color) =>*/}
                        {/*            <FeatherIcons size={22} color={Colors.colors.successIcon} name="users"/>*/}
                        {/*        }*/}
                        {/*    />*/}
                        {/*</View>*/}
                    </View>
                </Modal>

                {this.state.openChatStatusModal && this.renderChatStatusModal()}


                <Overlay
                    containerStyle={styles.confirmOverlay}
                    childrenWrapperStyle={styles.confirmWrapper}
                    closeOnTouchOutside={true}
                    visible={this.state.confirmModal}>
                    <View style={{width: '100%'}}>
                        <Text style={styles.confirmHeader}>
                            Are you sure you want to {this.state.type} this group?
                        </Text>
                        <View style={styles.confirmBtns}>
                            <Button style={{...styles.outlineBtn, flex: 1 }}
                                    onPress={() => this.confirmLeaveGroup(this.state.type)}
                            >
                                <Text style={styles.outlineText}>Yes, {this.state.type}</Text>
                            </Button>
                            <View style={styles.noBtn}>
                                <PrimaryButton
                                    testId="no"
                                    onPress={() => {
                                        this.setState({
                                            confirmModal: false,
                                        });
                                    }}
                                    text="No"
                                />
                            </View>
                        </View>
                    </View>

                </Overlay>

                {/*<Overlay*/}
                {/*    containerStyle={styles.mediaOverlay}*/}
                {/*    childrenWrapperStyle={styles.mediaWrapper}*/}
                {/*    closeOnTouchOutside={true}*/}
                {/*    visible={this.state.fileUploaderVisible}>*/}
                {/*    <View style={styles.mediaWrapperInner}>*/}
                {/*        <View style={styles.fileBtns}>*/}
                {/*            <LinearGradient style={styles.mediaBtn}*/}
                {/*                            start={{x: 0, y: 1}}*/}
                {/*                            end={{x: 1, y: 0}}*/}
                {/*                            colors={['#00C8FE', '#34b6fe', '#4FACFE']}*/}
                {/*            >*/}
                {/*                <Button iconLeft transparent>*/}
                {/*                    <MaterialIcons name="camera" size={26} color="#FFF"/>*/}
                {/*                    <Text style={styles.mediaBtnText}>Access Camera</Text>*/}
                {/*                </Button>*/}
                {/*            </LinearGradient>*/}
                {/*            <LinearGradient style={styles.mediaBtn}*/}
                {/*                            start={{x: 0, y: 1}}*/}
                {/*                            end={{x: 1, y: 0}}*/}
                {/*                            colors={['#00C8FE', '#34b6fe', '#4FACFE']}*/}
                {/*            >*/}
                {/*                <Button iconLeft transparent onPress={this.pickImage}>*/}
                {/*                    <MaterialIcons name="image" size={26} color="#FFF"/>*/}
                {/*                    <Text style={styles.mediaBtnText}>Select From Gallery</Text>*/}
                {/*                </Button>*/}
                {/*            </LinearGradient>*/}
                {/*        </View>*/}
                {/*        <View style={styles.cancelBtnView}>*/}
                {/*            <Button transparent*/}
                {/*                    style={styles.cancelBtn}*/}
                {/*                    onPress={() => {*/}
                {/*                        this.closeMediaOverlay();*/}
                {/*                    }}*/}
                {/*            >*/}
                {/*                <Text style={styles.cancelBtnText}>Cancel</Text>*/}
                {/*            </Button>*/}
                {/*        </View>*/}
                {/*    </View>*/}
                {/*</Overlay>*/}

                {
                    this.props.connection.type === 'CHAT_GROUP'
                        ? this.props.connection.groupCallActive ? this.renderGroupCallBanner()
                            : this.props.isProviderApp ? null : (
                                this.renderEmergencyCallBanner()
                            )
                        : null
                }


                {
                    this.state.appointment && !this.isMissed(this.state.appointment) ? this.renderSessionTimer() : this.props.connection.type === 'PRACTITIONER'
                        ? this.props.isProviderApp ? null : (
                            this.renderEmergencyCallBanner()
                        )
                        : null
                }
                <KeyboardAvoidingView
                    style={ Platform.OS === 'ios'? styles.shadowWrap : {flex: 1, backgroundColor: '#f8f9fd'}}>
                    {Platform.OS === 'ios' && <View style={styles.shadowInner}></View>}
                    <GiftedChat
                        user={{
                            _id: this.props.userId,
                            name: this.props.nickName,
                        }}
                        messages={this.props.messages}
                        onSend={this.sendMessage}
                        alwaysShowSend={true}
                        // loadEarlier={chat.loadEarlier}
                        // onLoadEarlier={this.loadEarlier}
                        // isLoadingEarlier={chat.isLoadingEarlier === true}
                        isAnimated={true}
                        bottomOffset={0}
                        maxComposerHeight={150}
                        renderMessage={this.renderMessage}
                        renderUsernameOnMessage={true}
                        showAvatarForEveryMessage={true}
                        renderAvatarOnTop={true}
                        minInputToolbarHeight={55}
                        renderComposer={this.renderComposer}
                        renderSend={this.renderSend}
                        // extraData={chat}
                    />
                </KeyboardAvoidingView>
                {isIphoneX() && <View style={{height: 36, backgroundColor: '#fff'}}></View>}
            </Container>
        );
    }


    answerQuickReply = ({value, msgToRender}) => {
        this.props.dataSharingPromptAnswered({
            payload: {
                value, msgToRender,
            },
        });
    };

    closeMediaOverlay = () => {
        this.setState({
            fileUploaderVisible: false,
        });
    };

    getAnonymousUserDetail = (user) => {
        const members = this.props.groupResponse?.members;
        if (members && members.length > 0) {
            const connection = members.filter(item => item.userId === user._id);
            if (connection && connection.length > 0) {
                return {
                    name: connection[0].name,
                    profilePicture: connection[0].profilePicture
                };
            } else {
                return {
                    name: 'Anonymous User',
                    profilePicture: null
                }
            }
        }
    };

    renderMessage = props => {
        const isGroupChat = this.props.connection.type === 'CHAT_GROUP';
        if (isGroupChat) {
            props.isGroupChat = true;
            let userDetail;
            const groupAnonymous = this.props.groupResponse?.groupAnonymous;
            if (groupAnonymous) {
                userDetail = this.getAnonymousUserDetail(props.currentMessage.user);
            }
            const avatar = (groupAnonymous && !userDetail.profilePicture) ? null : this.props.findConnectionAvatar(props.currentMessage.user._id);
            props.currentMessage.user.avatar = avatar || S3_BUCKET_LINK + DEFAULT_IMAGE;
            props.userId = props.currentMessage.user._id;
            props.nickName = groupAnonymous ? userDetail.name : props.currentMessage.user.name;
        } else {
            props.currentMessage.user.avatar = this.props.connection.avatar ? this.props.connection.avatar : S3_BUCKET_LINK + DEFAULT_IMAGE;
            props.userId = this.props.userId;
            props.nickName = this.props.nickName;
        }
        props.answerQuickReply = this.answerQuickReply;
        props.providerListScreen = this.props.providerListScreen;
        props.educationContentScreen = this.props.educationContentScreen;
        props.navigation = this.props.navigation;
        return <CustomMessage openImage={this.openImage} openVideo={this.openVideo} {...props} />;
    };

    openImage = (url) => {
        this.props.openImage(url);
    };

    openVideo = (url) => {
        this.props.openVideo(url);
    };

    renderComposer = props => {
        props.textInputProps.editable = this.props.connectionStatus === 4;

        return <CustomComposer multiline {...props} composerTextChanged={this.composerTextUpdated} name = {this.props.connection.name}/>;
    };

    composerTextUpdated = (text) => {
        this.setState({
            attachmentIconVisible: !(text && text.length > 0),
        });
    };

    checkPermissions = () => {
        request(Platform.OS === 'ios' ? PERMISSIONS.IOS.PHOTO_LIBRARY : PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE).then(result => {
            if (result === 'denied' || result === 'blocked') {
                AlertUtil.showErrorMessage("Permission denied, please allow Photo Library Permissions from your phone settings");
            } else {
                this.pickMedia();
            }
        })
    };

    pickMedia = () => {
        let options = {
            title: 'Send an Attachment',
            allowsEditing: true,
            mediaType: 'mixed',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        ImagePicker.showImagePicker(options, response => {

            if (response.didCancel) {
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
                if (response.error === 'Photo library permissions not granted' || response.error === 'Camera permissions not granted' || response.error === 'Permissions weren\'t granted') {
                    AlertUtil.showErrorMessage(response.error + '. Please go to application settings and allow permissions.');
                }
            } else if (response.customButton) {
                AlertUtil.showErrorMessage(response.customButton);
            } else {
                let source = 'data:' + response.type + ';base64,' + response.data;
                // AlertUtil.showErrorMessage(response.fileSize);

                let imageSize = response.fileSize / 1000000;

                if (imageSize >= 10) {
                    AlertUtil.showErrorMessage('Uploaded file size is too large');
                } else {
                    console.log(response);
                    this.sendAttachment({
                        uri: response.uri,
                        name: response.fileName ? response.fileName : new Date().getTime() + this.props.userId + this.props.connection.connectionId,
                        type: response.type || 'video/quicktime',

                    });
                }

            }
        });
    };

    sendAttachment = (fileData) => {
        this.props.sendMessage({
            payload: {
                message: {
                    hasFile: true,
                    fileData,
                },
            },
        });
    };

    renderSend = props => {
        return (
            this.state.attachmentIconVisible ?
                <View style={styles.plusBtn}>
                    <Button transparent
                            onPress={() => {
                                this.checkPermissions();
                            }}
                    >
                        <MaterialIcons name="plus" size={30} color={Colors.colors.primaryIcon}/>
                    </Button>
                </View>
                :
                <View style={styles.sendBtn}>
                    <Send transparent disabled={this.props.connectionStatus !== 4} {...props}
                          {...addTestID('send')}
                    >
                        <FeatherIcons name="send" size={30} color={Colors.colors.primaryIcon} />

                    </Send>
                </View>
        );
    };
}

const commonText = {
    fontFamily: 'Roboto-Regular',
    color: '#30344D',
};
const styles = StyleSheet.create({
    shadowWrap: {
        position: 'relative',
        overflow: 'hidden',
        flex: 1,
        backgroundColor: '#f8f9fd'
    },
    shadowInner: {
        height: 10,
        top: -10,
        position: 'absolute',
        width: '100%',
        ...CommonStyles.styles.headerShadow,
        shadowColor: Colors.colors.shadowColor2,
        shadowOpacity: 1.0,
        borderBottomWidth: 1
    },
    mediaOverlay: {
        backgroundColor: 'rgba(37,52,92,0.5)',
    },
    mediaWrapper: {
        height: 'auto',
        padding: 24,
        paddingBottom: 10,
        alignSelf: 'center',
        position: 'absolute',
        left: 24,
        right: 24,
        bottom: 90,
        borderRadius: 9,
        elevation: 2,
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowColor: 'rgba(81, 93, 125, 0.2)',
        shadowOpacity: 1,
    },
    mediaWrapperInner: {
        width: '100%',
        position: 'relative',
    },
    fileBtns: {},
    mediaBtn: {
        paddingLeft: 10,
        marginBottom: 16,
        height: 48,
        borderRadius: 4,
        overflow: 'hidden',
    },
    mediaBtnText: {
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: 13,
        lineHeight: 20,
        letterSpacing: 0.7,
        flex: 1,
    },
    cancelBtnView: {
        position: 'absolute',
        bottom: -70,
        left: -24,
        right: -24,
    },
    cancelBtn: {
        backgroundColor: '#fff',
        width: '100%',
        height: 48,
        borderRadius: 8,
    },
    cancelBtnText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
        flex: 1,
    },

    sessionBanner: {
        height: 56,
        width: '100%',
        flexDirection: 'row',
        paddingLeft: 18,
        paddingRight: 22,
        alignItems: 'center',
    },
    bannerText: {
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.5,
        color: '#fff',
        flex: 2,
        paddingLeft: 15,
    },
    actionHead: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: HEADER_SIZE + (isIphoneX() ? (isIphone12()? 0 : 24 ) : 0),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingLeft: 20,
        paddingRight: 24,
        paddingBottom: 5,
    },
    actionTitle: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        letterSpacing: 0.3,
        flex: 2,
        paddingBottom: 10,
        textAlign: 'center',
    },
    actionBody: {
        padding: 24,
        paddingBottom: 0,
    },
    overlayBG: {
        backgroundColor: 'rgba(37,52,92,0.35)',
        zIndex: -1,
    },
    fabWrapper: {
        height: 'auto',
        padding: 0,
        alignSelf: 'center',
        position: 'absolute',
        // top: Platform.OS === 'ios'? isIphoneX()? 112 : 80 : 55,
        top: 0,
        left: 0,
        right: 0,
        borderColor: 'rgba(37,52,92,0.1)',
        borderTopWidth: 0.5,
        elevation: 1,
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 0.5,
        shadowColor: 'rgba(37,52,92,0.1)',
        zIndex: 0,
    },
    fabTitle: {
        color: '#25345c',
        fontSize: 15,
        lineHeight: 22,
        letterSpacing: 0.5,
        textAlign: 'center',
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        marginBottom: 23,
    },
    gButton: {
        width: '100%',
        borderRadius: 4,
        height: 48,
        marginBottom: 24,
    },
    fabBtn: {
        justifyContent: 'center',
    },
    fabBtnText: {
        color: '#fff',
        fontSize: 13,
        lineHeight: 19.5,
        textAlign: 'center',
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase',
    },
    mainBG: {
        backgroundColor: Colors.colors.screenBG
    },
    chatHeader: {
        height: HEADER_SIZE,
        paddingLeft: 3,
        paddingRight: 0,
        paddingBottom: 10,
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
        justifyContent: 'flex-start',
    },
    avatarContainer: {
        // position: "relative"
        width: '92%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatarBorder: {
        width: 42,
        height: 42,
        borderRadius: 27,
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        borderRadius: 23,
        overflow: 'hidden',
        width: 36,
        height: 36,
    },
    proAvatar: {
        borderRadius: 18,
        width: 35,
        height: 35,
        marginRight: 15,
        borderColor: '#4FACFE',
        borderWidth: 1,
    },
    state: {
        backgroundColor: '#4CD964',
        width: 14,
        height: 14,
        borderRadius: 10,
        position: 'absolute',
        left: 25,
        top: 0,
        borderColor: '#fff',
        borderWidth: 1,
    },
    stateGrey: {
        backgroundColor: '#EAEDF3',
        width: 14,
        height: 14,
        borderRadius: 10,
        position: 'absolute',
        left: 25,
        top: 0,
        borderColor: '#fff',
        borderWidth: 1,
    },
    backButton: {
        marginLeft: 15,
        width: 30,
    },
    headerText: {
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeBold,
        color: Colors.colors.highContrast,
        width: '90%',
        textAlign: 'left',
        paddingLeft: 0,
    },
    videoIcon: {
        marginLeft: 5,
        marginRight: 10,
    },
    providerMsgBox: {
        display: 'flex',
        flexDirection: 'row',
        maxWidth: '70%',
        marginBottom: 15,
        marginLeft: 8,
        marginTop: 20,
    },
    proMsgContainer: {
        borderTopLeftRadius: 0,
        borderTopRightRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        borderColor: 'rgba(63, 177, 254, 0.2)',
        borderWidth: 1,
        flex: 1,
        padding: 13,
        backgroundColor: '#fff',
        marginTop: 5,
    },
    proText: {
        ...commonText,
        fontSize: 14,
        fontWeight: '400',
        marginBottom: 10,
    },
    proTime: {
        ...commonText,
        fontSize: 12,
        fontWeight: '400',
        opacity: 0.7
    },
    userMsgBox: {
        marginBottom: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    userMsgContainer: {
        maxWidth: '70%',
        marginRight: 8
    },
    userText: {
        fontFamily: 'SFProText-Regular',
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        marginBottom: 10
    },
    userTime: {
        color: '#fff',
        fontFamily: 'SFProText-Regular',
        fontSize: 12,
        fontWeight: '400',
        opacity: 0.7,
    },
    bubbleBG: {
        flex: 1,
        padding: 13,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
    },
    composer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#CFCCCC',
        paddingTop: 10,
        paddingBottom: 10,
        elevation: 0,
        // marginBottom: isIphoneX() ? 30 : 0,
    },
    composerInner: {
        display: 'flex',
        flexDirection: 'row',
        // width: '100%',
        // flex: 1
    },
    sendIcon: {
        width: 30,
        height: 30,
        marginRight: 20,
    },

    plusBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 24,
        marginBottom: 5
    },
    sendBtn: {
        marginLeft: 0,
        marginBottom: 10,
        marginRight: 24,
    },
    inputWrapper: {
        height: 42,
        borderWidth: 1,
        borderColor: '#CFCCCC',
        marginLeft: 20,
        marginRight: 0,
        flex: 1,
    },
    msgInput: {
        fontSize: 13,
        lineHeight: 17,
        marginLeft: 15,
        color: '#444'
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
    confirmOverlay: {
        backgroundColor: 'rgba(37,52,92,0.5)',
    },
    confirmHeader: {
        color: '#25345c',
        fontSize: 20,
        lineHeight: 30,
        letterSpacing: 0.4,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        marginBottom: 30,
        paddingLeft: 18,
        paddingRight: 18,
    },
    confirmBtns: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    noBtn: {
        flex: 1,
        marginLeft: 17,
        justifyContent: 'center',
    },
    outlineBtn: {
        borderColor: Colors.colors.errorIcon,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        justifyContent: 'center',
        elevation: 0,
    },
    outlineText: {
        color: Colors.colors.errorIcon,
        fontSize: 13,
        letterSpacing: 0.7,
        lineHeight: 19.5,
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    confirmWrapper: {
        height: 'auto',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 40 : 25,
        paddingTop: 36,
        alignSelf: 'center',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        elevation: 3,
        shadowOffset: {width: 0, height: 10},
        shadowColor: '#f5f5f5',
        shadowOpacity: 0.5
    },
    proBg: {
        borderRadius: Platform.OS === 'ios' ? 18 : 100,
        overflow: 'hidden',
        width: 35,
        height: 35,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    proLetter: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
    attachmentSendingContainer: {
        backgroundColor: '#adadad',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        width,
    },
    attachmentSendingText: {color: '#fff'},
    singleActionItem: {
        marginBottom: 16
    },
    singleAction: {
        marginBottom: 16
    },
    btnOptions: {
        marginBottom: 8,
    },
    gradientWrapper: {
        paddingLeft: 20,
        paddingRight: 20
    },
    mainHeading : {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.highContrast,
    },
    multiList: {
        borderBottomWidth: 0,
        borderColor: Colors.colors.mediumContrastBG,
        marginLeft: 0,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 24,
        borderRadius: 8,
    },
    multiListSelected: {
        borderBottomWidth: 0,
        borderColor: Colors.colors.mediumContrastBG,
        backgroundColor: Colors.colors.mainBlue05,
        marginLeft: 0,
        paddingRight: 24,
        paddingTop: 20,
        paddingBottom: 20,
    },

    checkListText: {
        paddingRight: 24,
        paddingLeft: 24,
        flex: 1,
        flexDirection: 'column',
    },
    multiListText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
        alignSelf: 'flex-start'
    },
    multiListSubText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.mediumContrast,
        alignSelf: 'flex-start'
    },
    multiCheck: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: Colors.colors.borderColor,
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        color: Colors.colors.mainBlue,
        padding: 0,
    },
    multiCheckSelected: {
        borderWidth: 1,
        borderColor: Colors.colors.mainBlue,
        color: Colors.colors.whiteColor,
        backgroundColor: Colors.colors.mainBlue,
    },
    readMoreButton: {display: 'flex', flexDirection: 'row', marginTop: 8,},
    readMoreButtonText: {
        ...TextStyles.mediaTexts.linkTextM,
        color: Colors.colors.primaryText,
        marginRight: 8,
    },
});
