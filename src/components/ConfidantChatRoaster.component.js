import React, {Component} from 'react';
import {
    AppState,
    Image,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Dimensions,
} from 'react-native';
import {addTestID, getAvatar, getDSTOffset, isIphoneX} from '../utilities';
import moment from 'moment';
import {ContentLoader} from './ContentLoader';
import LottieView from 'lottie-react-native';
import alfieCan from '../assets/animations/Dog_with_Can';
import alfieFace from '../assets/animations/alfie-face-new';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {DEFAULT_AVATAR_COLOR, CHATBOT_DEFAULT_AVATAR} from '../constants';
import { Colors, TextStyles, CommonStyles } from "../styles";
import { PrimaryButton } from "./PrimaryButton";
import momentTimeZone from "moment-timezone";

const windowWidth = Dimensions.get('window').width;

export class ConfidantChatRoaster extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            activeConnectionsVisible: true,
            appState: AppState.currentState,
            isRefreshing: false,
        };
    }


    componentDidMount(): void {
        AppState.addEventListener('change', this._handleAppState);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
            if (this.animation1) {
                this.animation1.play();
            }
        }
    };

    getSubTextForContact = (item) => {
        switch (item.type) {
            case 'PRACTITIONER':
                return item.designation || 'Therapist';
            case 'MATCH_MAKER':
                return 'Matchmaker';
            case 'CHAT_BOT':
                return 'Chatbot';
            case 'CHAT_GROUP':
                return 'Chat Group';
            default:
                return 'Member';

        }
    };

    getLastMessageTimeString = (item) => {
        const diff = moment().diff(item.lastMessageTimestamp, 'days');

        if (diff === 0) {
            return moment(item.lastMessageTimestamp).format('h:mm A');
        } else if (diff === 1) {
            return 'Yesterday';
        } else {
            return moment(item.lastMessageTimestamp).format('MM.DD.yyyy');
        }
    };

    getAppointmentTimeString = (appt) => {
        const dstOffset = getDSTOffset();
        const appointmentMoment = moment(appt?.startTime).tz(this.props.tz || momentTimeZone.tz.guess(true)).utcOffset(dstOffset);
        return (appointmentMoment.calendar().includes('Today') || appointmentMoment.calendar().includes('Tomorrow')) ?
            appointmentMoment.calendar() : appointmentMoment.format('DD MMM') + ' at ' + appointmentMoment.format('h:mm A');
    };

    requestAppointment = (item) => {
        this.props.requestAppointment({...item, userId: item.connectionId});
    };

    renderAppointmentButton = (item) => {
        const {appointments} = this.props;
        const bookedAppointments = appointments
            .filter(appt => appt.participantId === item.connectionId)
            .filter(appt => moment(appt.startTime).isAfter(moment()))
            .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));
        if (bookedAppointments.length < 1) {
            return <View style={styles.bookBtnWrap}>

                <PrimaryButton
                    text={'Book Appointment'}
                    onPress={() => {
                        this.requestAppointment(item);
                    }}
                    iconName={'calendar'}
                    type={'Feather'}
                    size={22}
                    color={Colors.colors.white}
                />

                {/*<Button*/}
                {/*    transparent*/}
                {/*    title="Book Appointment"*/}
                {/*    onPress={() => {*/}
                {/*        this.requestAppointment(item);*/}
                {/*    }}*/}
                {/*    style={[styles.outlineBtn, {position: 'relative'}]}>*/}

                {/*    <AntIcon name="calendar" style={styles.calenderIcon} size={26} color="#3fb2fe"/>*/}
                {/*    <Text style={styles.bookBtnText}>Book Appointment</Text>*/}
                {/*</Button>*/}
            </View>;
        }

    };
    renderAppointmentView = (item) => {
        const {appointments} = this.props;
        const bookedAppointments = appointments
            .filter(appt => appt.participantId === item.connectionId)
            .filter(appt => moment(appt.startTime).isAfter(moment()))
            .sort((a, b) => moment(a.startTime).diff(moment(b.startTime)));
        if (bookedAppointments.length > 0) {
            return <View style={styles.nextAppWrap}>
                <Text style={styles.nextAppWrapAppText}>Next Appointment</Text>
                {
                    bookedAppointments[0].status==='BOOKED'? (
                        <Text style={styles.lowContrastColor}>{this.getAppointmentTimeString(bookedAppointments[0])}</Text>
                    ): (
                        <Text style={styles.lowContrastColor}>Requested </Text>
                    )
                }

            </View>;
        }

    };

    renderListItem = ({item, index}) => {
        let isFirstBotInteraction = false;
        const hasProgress = item.type === 'CHAT_BOT' && item.progress;
        const isCompleted = hasProgress && item.progress.completed;
        if (item.type === 'CHAT_BOT') {
            isFirstBotInteraction = !item.lastMessage && item.name.toLowerCase()==='confidant chatbot';
        }
        return (
            isFirstBotInteraction ?
                <View style={styles.initialWrapper}>
                    <View style={styles.botTopRow}>
                        <View style={styles.botImgContent}>
                            <Image
                                style={styles.botImg}
                                resizeMode={'contain'}
                                source={require('../assets/images/elfie-avatar.png')} />
                            <View style={styles.botContent}>
                                <Text style={styles.botTile}>Confidant Health</Text>
                                <Text style={styles.botSubText}>Chatbot</Text>
                            </View>
                        </View>
                        <Text style={styles.botDate}>{moment(item.lastModified).format('DD/MM')}</Text>
                    </View>
                    <View style={styles.botBodyBox}>
                        <View style={styles.alfieWrapper}>
                            <LottieView
                                ref={animation1 => {
                                    this.animation1 = animation1;
                                }}
                                style={styles.emptyAnim}
                                resizeMode="contain"
                                source={alfieFace}
                                autoPlay={true}
                                loop/>
                        </View>
                        <Text style={styles.initialHead}>Welcome to Confidant!</Text>
                        <Text style={styles.initialDes}>Answer a few questions to get started. You'll also learn more about us and how we can help you!</Text>
                        <PrimaryButton
                            testId="chat-now"
                            text="Start chatbot"
                            onPress={() => {
                                this.props.navigateToConnection(item);
                            }}
                        />
                    </View>
                </View>
                :
                <TouchableOpacity
                    {...addTestID('user-chat-' + (index + 1))}
                    activeOpacity={0.8}
                    style={styles.mainView}
                    onPress={() => {
                        if(!item.restartInProgress) {
                            this.props.navigateToConnection(item);
                        }

                    }}>

                    <View style={styles.personalCardHeader}>
                        <View style={styles.imageWrapper}>
                            {
                                item.profilePicture ?
                                    <Image
                                        style={styles.proImage}
                                        resizeMode="cover"
                                        source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}}/>
                                    : item.type === 'CHAT_BOT' ? (<Image
                                            resizeMode={'cover'}
                                            style={styles.avatarImage} source={{uri: CHATBOT_DEFAULT_AVATAR}}/>) :
                                        <View style={{
                                            ...styles.proBg,
                                            backgroundColor: item.colorCode ? item.colorCode : DEFAULT_AVATAR_COLOR,
                                        }}><Text style={styles.proLetter}>{item.name.charAt(0).toUpperCase()}</Text></View>
                            }


                        </View>
                        <View style={styles.itemDetail}>
                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.itemDes} numberOfLines={1}>
                                {this.getSubTextForContact(item)}
                            </Text>

                        </View>
                        {
                            isCompleted || item.archived ? (
                                <Text style={styles.botDate}>{moment(item.lastModified).format('DD/MM')}</Text>
                            ): (
                                <View style={styles.timeNotiBox}>
                                    {
                                        item.lastMessage && item.lastMessageTimestamp ? (
                                            <Text style={styles.headerTimeText} numberOfLines={1}>
                                                {this.getLastMessageTimeString(item)}
                                            </Text>
                                        ): null
                                    }
                                    {
                                        item.lastMessageUnread ? <View style={styles.notificationWrapper}>
                                            <Text  style={styles.notificationText}>1</Text>
                                        </View> : null
                                    }

                                </View>
                            )
                        }

                    </View>
                    <View style={styles.personalCardContent}>
                        {
                            isCompleted || item.archived ? (
                                !item.archived ? (
                                        <View style={styles.archiveWrap}>
                                            <Text style={styles.contentMainDetailText}>Chatbot completed</Text>
                                            <Text style={styles.completedSubText}>This conversation has been completed</Text>
                                            <PrimaryButton
                                                text={' Archive Chatbot'}
                                                onPress={() => {
                                                    this.props.archiveConnection(item.connectionId);
                                                }}
                                                iconName={'delete'}
                                                type={'AntDesign'}
                                                size={22}
                                                color={Colors.colors.white}
                                            />
                                        </View>
                                    ) :
                                    <View style={styles.archiveWrap}>
                                        <Text style={styles.contentMainDetailText}>Chatbot completed</Text>
                                        <Text style={styles.completedSubText}>Great job! You can come back to this chatbot at any time.</Text>
                                        <PrimaryButton
                                            text={'Start over'}
                                            onPress={() => {
                                                if(!item.restartInProgress) {
                                                    this.props.restartConversation(item.connectionId);
                                                }

                                            }}
                                            bgColor={Colors.colors.primaryColorBG}
                                            textColor={Colors.colors.primaryText}
                                        />
                                    </View>
                            ) : (
                                <>
                                    {
                                        item.lastMessage !== undefined && item.lastMessage !== null && item.lastMessage?.trim() !== '' && (
                                            <Text style={styles.contentMainText} numberOfLines={2}>
                                                {item.lastMessage}
                                            </Text>
                                        )}

                                    {this.props.isMember && (item.type === 'PRACTITIONER') && this.renderAppointmentButton(item)}
                                    {
                                        hasProgress && !item.archived && (
                                            <View style={item.lastMessage && item.lastMessageTimestamp ?
                                                { ...styles.barProgressWrapper, paddingTop: 0 } :
                                                styles.barProgressWrapper}>
                                                <ProgressBarAnimated
                                                    style={{width: '100%'}}
                                                    width={windowWidth - 136}
                                                    value={item.progress.percentage}
                                                    height={8}
                                                    backgroundColor={Colors.colors.primaryIcon}
                                                    borderRadius={4}
                                                />
                                                <Text
                                                    style={styles.barProgressText}>{item.progress.percentage}%</Text>
                                                {/*<View style={styles.dueImmediately}>*/}
                                                {/*    <Text style={styles.barProgressText}></Text>*/}
                                                {/*   */}

                                                {/*</View>*/}
                                            </View>
                                        )
                                    }

                                </>
                            )
                        }


                    </View>
                    {this.props.isMember && (item.type === 'PRACTITIONER' || item.type === 'MATCH_MAKER') && this.renderAppointmentView(item)}
                    {!this.props.isMember && (item.type === 'PATIENT') && this.renderAppointmentView(item)}
                </TouchableOpacity>
        );
    };

    emptyState = () => {
        let emptyStateMsg = '';
        let emptyStateHead = '';
        switch (this.props.filterType) {
            case
            'ALL'
            :
                emptyStateHead = 'You Have No Archived Conversations';
                emptyStateMsg = 'You do not have any archived conversations right now. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.';
                break;
            case
            'MEMBERS'
            :
                emptyStateHead = 'You Have No Chats with Members';
                emptyStateMsg = 'You don’t have any active chats with members right now. Members are other people like yourself using the Confidant app. If you know someone you’d like to communicate with in Confidant, you can invite them in the Connections section.';
                break;
            case
            'PROVIDERS'
            :
                emptyStateHead = 'You Have No Chats With Providers';
                emptyStateMsg = 'You don’t have any active chats with providers right now. Providers are the doctors, nurses, and therapists you can speak with to help you reach your goals. You can connect directly with your providers or through your matchmaker.';
                break;
            case
            'BOTS'
            :
                emptyStateHead = 'You Have No Active ChatBots';
                emptyStateMsg = 'You do not have any chats available right now. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.';
                break;
            default :
                emptyStateHead = 'You Have No Chats Right Now';
                emptyStateMsg = 'You do not have any chats available right now. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.';
                break;
        }
        return (
            <View style={styles.emptyView}>
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={styles.emptyAnim}
                    resizeMode="cover"
                    source={alfieCan}
                    autoPlay={true}
                    loop/>
                <Text style={styles.emptyTextMain}>{emptyStateHead}</Text>
                <Text style={styles.emptyTextDes}>{emptyStateMsg}</Text>
            </View>
        );
    };


    render() {
        return (
            <View style={styles.MainScrollView}>
                {this.props.isLoading ? (
                    <ContentLoader type="chat-card" numItems="4"/>
                ) : (
                    <SectionList
                        style={{ paddingTop: 24}}
                        showsVerticalScrollIndicator={false}
                        sections={this.props.activeSections}
                        keyExtractor={(item, index) => item + index}
                        refreshing={this.state.isRefreshing}
                        onRefresh={() => {
                            this.props.onRefresh();
                            this.setState({isRefreshing: true});
                            setTimeout(() => {
                                this.setState({isRefreshing: false});
                            }, 3000);
                        }}
                        renderItem={this.renderListItem}
                        stickySectionHeadersEnabled={false}
                        renderSectionHeader={({section: {title, count}}) => null}
                        ListEmptyComponent={this.emptyState}
                    />
                )}


            </View>
        );
    }
}


const styles = StyleSheet.create({
    initialWrapper: {
        ...CommonStyles.styles.shadowBox,
        elevation: 1,
        borderRadius: 8
    },
    botTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomColor: Colors.colors.highContrastBG,
        borderBottomWidth: 1
    },
    botImgContent: {
        flexDirection: 'row',
        flex: 1
    },
    botImg: {
        width: 48,
        height: 48,
        borderRadius: 24
    },
    botContent: {
        paddingLeft: 12,
        // flex: 1
    },
    botTile: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS
    },
    botSubText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText
    },
    botDate: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.captionText
    },
    alfieBody: {
        width: 110,
        height: 135,
        marginTop: 16,
        marginBottom: 35,
    },
    initialHead: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH5,
        textAlign: 'center',
        marginBottom: 8
    },
    initialDes: {
        textAlign: 'center',
        marginBottom: 24,
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS
    },
    emptyView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 0,
        paddingBottom: 0,
    },
    botBodyBox: {
        padding: 24,
        alignItems: 'center'
    },
    alfieWrapper: {
        ...CommonStyles.styles.shadowBox,
        width: 107,
        height: 107,
        borderRadius: 55,
        backgroundColor: Colors.colors.primaryColorBG,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16
    },
    emptyAnim: {
        width: '100%',
        marginTop:-30,
        marginBottom:-30,
        justifyContent:'center',
    },
    emptyTextMain: {
        color: '#25345C',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        alignSelf: 'center',
        fontSize: 14,
        letterSpacing: 0.5,
        lineHeight: 15,
        marginBottom: 20,
    },
    emptyTextDes: {
        color: '#969FA8',
        fontFamily: 'Roboto-Regular',
        alignSelf: 'center',
        fontSize: 14,
        letterSpacing: 0,
        lineHeight: 21,
        paddingLeft: 30,
        paddingRight: 30,
        textAlign: 'center',
    },
    tabHead: {
        backgroundColor: 'transparent',
        width: '92%',
        alignSelf: 'center',
    },
    segmentItems: {
        paddingBottom: isIphoneX() ? 20 : 0,
        flex: 1,
    },


    singleItem: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#EEE',
        borderWidth: 0.5,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    avatarContainer: {
        // height: 60,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#4FACFE',
        borderWidth: 2,
    },
    contact: {
        // height: 60,
        flex: 1,
        backgroundColor: '#fff',
        // paddingTop: 10,
    },
    contactUsername: {
        fontFamily: 'Roboto-Bold',
        fontSize: 15,
        lineHeight: 15,
        color: '#25345c',
        letterSpacing: 0.3,
        marginBottom: 3,
        // marginTop: 3,
    },
    subText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 19,
        color: '#969fa8',
        letterSpacing: 0,
    },

    nextBtn: {
        paddingRight: 0,
    },
    nextIcon: {
        fontSize: 32,
        color: '#3fb2fe',
        marginRight: 5,
    },
    contactMetaContainer: {
        height: 60,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    contactMetaWrapper: {
        marginLeft: 15,
        marginRight: 8,
    },
    lastMessageTimestamp: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#b3bec9',
        letterSpacing: 0,
        lineHeight: 12,
    },
    launchChatButton: {
        width: 13,
        height: 20,
        marginLeft: 35,
        paddingLeft: 0,
        paddingTop: 0,
        marginTop: 5,
        marginRight: 12,
    },
    orangeDot: {
        width: 15,
        height: 15,
        backgroundColor: '#ff7f05',
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginRight: 5,
    },
    unreadText: {
        color: '#fff',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 13,
        letterSpacing: 0.26,
    },
    proBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetter: {
        color: Colors.colors.white,
        ...TextStyles.mediaTexts.TextH3,
        ...TextStyles.mediaTexts.manropeExtraBold,
        textTransform: 'uppercase'
    },
    notificationWrapper: {
        backgroundColor: Colors.colors.secondaryColorBG,
        width: 24,
        height: 24,
        borderRadius: 12
    },
    notificationText: {
        color: Colors.colors.secondaryText,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeBold,
        textAlign: 'center'
    },
    starImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    cardImg: {
        marginTop: 40,
        marginBottom: 16,
    },
    startImg: {
        position: 'absolute',
        top: 0,
        height: 200,
        width: '100%'
    },
    iconStyle: {
        color: '#d1d1d1',
        fontSize: 25,
    },
    MainScrollView: {
        paddingHorizontal: 24,
    },
    contentMainText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeMedium,
        // marginBottom: 8,
        paddingHorizontal: 24,
        paddingVertical: 16
    },
    bookBtnWrap: {
        padding: 24,
        borderTopColor: Colors.colors.mediumContrastBG,
        marginTop: -1,
        borderTopWidth: 1
    },
    timeNotiBox: {
        alignItems: 'flex-end'
    },
    headerTimeText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeRegular,
        marginBottom: 4
    },
    contentMainTimeText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeRegular,
        paddingHorizontal: 24,
        marginBottom: 16
    },
    nextAppWrap: {

        borderTopColor: Colors.colors.mediumContrastBG,
        borderTopWidth: 1,
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 16,
        paddingLeft: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextAppWrapAppText: {
        paddingRight: 26,
        ...TextStyles.mediaTexts.manropeBold
    },
    lowContrastColor: {
        color: Colors.colors.lowContrast,
    },
    dueImmediately: {
        flexDirection: 'row',
        paddingTop: 8,
        justifyContent: 'space-between'
    },
    barProgressWrapper: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center'
    },
    barProgressText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeBold,
        width: 40,
        textAlign: 'right'
    },
    archiveWrap: {
        alignItems: 'center',
        position: 'relative',
        padding: 24
    },
    contentMainDetailText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH5,
        ...TextStyles.mediaTexts.manropeBold,
        marginBottom: 8
    },
    completedSubText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeMedium,
        marginBottom: 16
    },
    bookBtnText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        alignSelf: 'center',
        fontSize: 14,
        letterSpacing: 0.5,
        // marginRight: 60,
        marginLeft: 15,
        textTransform: 'uppercase',
    },
    calenderIcon: {
        // marginRight: 50,
        position: 'absolute',
        left: 15,
    },
    outlineBtn: {
        borderColor: '#3fb2fe',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        justifyContent: 'center',
        elevation: 0,
        color: '#3fb2fe',
        width: '100%'
    },
    mainView: {
        marginBottom: 16,
        borderRadius: 12,
        ...CommonStyles.styles.shadowBox
    },
    personalCardHeader: {
        borderBottomColor: Colors.colors.mediumContrastBG,
        borderBottomWidth: 1,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center'
    },
    personalCardContent: {
        // padding: 16,
    },
    personalCompletedCardContent: {
        padding: 16,
        // alignItems: 'center',
    },
    imageWrapper: {},
    proImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.colors.primaryColorBG
        // overflow: 'hidden',
    },

    itemDetail: {
        flex: 1,
        paddingLeft: 8,
        paddingRight: 10
    },
    itemName: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeBold
    },
    itemDes: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeMedium
    },
    nextBtnwrap: {
        backgroundColor: 'rgba(63, 178, 254, 0.07)',
        borderRadius: 4,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
    },

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#fff',
    },
});
