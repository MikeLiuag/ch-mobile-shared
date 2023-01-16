import React, {Component} from 'react';
import {StatusBar, StyleSheet, Image, Platform, TouchableOpacity} from 'react-native';
import {Button, Container, Header, Text, View, Content, Left, Body, Right, Title} from 'native-base';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Overlay from 'react-native-modal-overlay';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {getDurationText, getTimeDifference, isIphoneX, isIphone12, isTimeElapsed, isLate, addTestID, getHeaderHeight} from '../../utilities';
import moment from 'moment-timezone';
import Loader from '../../components/Loader';
import GradientButton from '../../components/GradientButton';
import {
    DEFAULT_AVATAR_COLOR
} from '../../constants';
import {Rating} from 'react-native-elements';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GenericActionButton from "../GenericActionButton";

const HEADER_SIZE = getHeaderHeight();

export class AppointmentDetailsComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            confirmModal: false,
            msgText: null,
        };
    }

    componentDidMount(): void {
        this.iv = setInterval(() => {
            this.setState({...this.state});
        }, 1000);
    }

    componentWillUnmount(): void {
        if (this.iv) {
            clearInterval(this.iv);
            this.iv = null;
        }
    }

    showModal = () => {
        this.setState({
            modalVisible: true,
        });
    };

    showConfirm = () => {
        this.setState({
            modalVisible: false,
            confirmModal: true,
        });
    };

    setRequestMessageText = (text) => {
        this.setState({msgText: text});
    };

    onClose = () => {
        this.setState({modalVisible: false});
    };

    closeConfirm = () => {
        this.setState({confirmModal: false});
    };


    goBack = () => {
        this.props.goBack();
    };

    getDateDesc = (_moment) => {
        const tz = this.props.timezone || moment.tz.guess(true);
        return this.props.appointment.isChanged ? this.props.appointment.selectedSchedule.dateDesc : _moment.tz(tz).format('dddd, DD MMM YYYY');
    };

    getStartTime = (_moment) => {
        const tz = this.props.timezone || moment.tz.guess(true);
        return this.props.appointment.isChanged ? this.props.appointment.selectedSchedule.slotStartTime.time + this.props.appointment.selectedSchedule.slotStartTime.amPm : _moment.tz(tz).format('hh:mm a');
    };

    getEndTime = (_moment) => {
        const tz = this.props.timezone || moment.tz.guess(true);
        return this.props.appointment.isChanged ? this.props.appointment.selectedSchedule.slotEndTime.time + this.props.appointment.selectedSchedule.slotEndTime.amPm : _moment.tz(tz).format('hh:mm a');
    };

    getScreenTitle = (status, startTime) => {
        switch (status) {
            case 'NEEDS_ACTION':
                return 'Appointment Request';
            case 'PROPOSED':
                return 'Awaiting Confirmation';
            case 'CANCELLED':
                return 'Cancelled Appointment';
            case 'BOOKED': {
                if (this.isStartingSoon()) {
                    return 'Starting Soon';
                } else if (isTimeElapsed(startTime) && !this.isMissed()) {
                    return 'Active Appointment';
                } else if (this.isMissed()) {
                    return 'Missed Appointment';
                } else {
                    return 'Scheduled Appointment';
                }
            }
            case 'FULFILLED': {
                return 'Completed Appointment';
            }
            default:
                return 'Appointment';
        }
    };

    isStartingSoon = () => {
        const timeDifference = getTimeDifference(this.props.appointment.startTime);
        if (timeDifference.days === 0 && timeDifference.hours === 0) {
            if (timeDifference.minutes < 15 && timeDifference.seconds > 0 && timeDifference.minutes > 0) {
                return true;
            }
        }
        return false;
    };

    isMissed = () => {
        return this.props.appointment.status === 'BOOKED' && moment(this.props.appointment.endTime).diff(moment(), 'minutes') < 0;
    };

    hasMenu = () => {
        return this.props.appointment.status !== 'CANCELLED' && this.props.appointment.status !== 'FULFILLED' && !this.isMissed();
    };

    showFeedback =()=>{
        return this.props.appointment.status === "FULFILLED" &&
            (!this.props.appointment.feedback || !this.props.appointment.feedback.rating ||
                (!this.props.appointment.feedback.privateFeedback && !this.props.appointment.feedback.publicComment)) ;
    };

    render() {
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        const startMoment = moment(this.props.appointment.startTime);
        const endMoment = moment(this.props.appointment.endTime);
        const timeDifference = getTimeDifference(this.props.appointment.startTime);
        return (
            <Container>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#fff', '#fff', '#f7f9ff']}
                    style={{flex: 1}}
                >
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                            translucent
                            barStyle={'dark-content'}
                        />
                        <View style={styles.headerContent}>
                            <Left onPress={this.goBack}>
                                <Button
                                    {...addTestID('Back')}
                                    transparent style={styles.backButton} onPress={this.goBack} text="GO BACK">
                                    <AwesomeIcon name="angle-left" size={32} color="#4FACFE"/>
                                </Button>
                            </Left>
                            <Body style={{flex: 3}}>
                                <Title
                                    style={styles.titleText}>{this.getScreenTitle(this.props.appointment.status, this.props.appointment.startTime)}</Title>
                            </Body>
                            <Right>
                                {this.props.isMemberApp && this.showFeedback() && (
                                    <Button
                                        {...addTestID('navigate-to-feedback')}
                                        transparent style={{width: 35, marginRight: 0, justifyContent: 'center'}}  onPress={this.props.navigateToFeedback} >
                                        <Ionicon name='ios-thumbs-up' size={30} color='#4FACFE'/>
                                    </Button>
                                )}
                                {this.hasMenu() && (
                                    <Button
                                        transparent
                                            style={{...styles.backButton, marginRight: 0, justifyContent: 'center'}}
                                            onPress={() => {
                                                this.showModal();
                                            }}
                                    >
                                        <Ionicon name='ios-more' size={30}
                                                 color={this.state.modalVisible ? '#646c73' : '#4FACFE'}/>
                                    </Button>
                                )}

                            </Right>
                        </View>
                    </Header>

                    <Overlay
                        containerStyle={styles.overlayBG}
                        childrenWrapperStyle={styles.fabWrapper}
                        visible={this.state.modalVisible} onClose={this.onClose} closeOnTouchOutside>

                        <View style={{width: '100%'}}>
                            <View style={styles.actionHead}>
                                <Text style={styles.actionTitle}>Actions</Text>
                                <Button
                                    {...addTestID('Close')}
                                    transparent
                                        onPress={() => {
                                            this.onClose();
                                        }}
                                >
                                    <Ionicon name='md-close' size={30}
                                             color="#4FACFE"/>
                                </Button>
                            </View>
                            <View>
                                {this.props.appointment.status === 'NEEDS_ACTION' && (
                                    <GenericActionButton
                                        onPress={() => {
                                            // this.props.cancelAppointment();
                                            this.showConfirm();
                                        }}
                                        title={'Deny Appointment'}
                                        iconBackground={'#77C70B'}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <MaterialCommunityIcons
                                                name='calendar-remove'
                                                size={25}
                                                color={color}
                                            />
                                        }
                                    />
                                )}
                                {this.props.appointment.status === 'PROPOSED' && (
                                    <GenericActionButton
                                        onPress={() => {
                                            // this.props.cancelAppointment();
                                            this.showConfirm();
                                        }}
                                        title={'Cancel Requested Appointment'}
                                        iconBackground={'#77C70B'}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <MaterialCommunityIcons
                                                name='calendar-minus'
                                                size={25}
                                                color={color}
                                            />
                                        }
                                    />
                                )}
                                {this.props.appointment.status === 'BOOKED' && (
                                    <GenericActionButton
                                        onPress={() => {
                                            // this.props.cancelAppointment();
                                            this.showConfirm();
                                        }}
                                        title={'Cancel Appointment'}
                                        iconBackground={'#77C70B'}
                                        styles={styles.gButton}
                                        renderIcon={(size, color) =>
                                            <MaterialCommunityIcons
                                                name='calendar-minus'
                                                size={25}
                                                color={color}
                                            />
                                        }
                                    />
                                )}
                            </View>

                        </View>
                    </Overlay>
                    <Overlay
                        containerStyle={styles.confirmOverlay}
                        childrenWrapperStyle={styles.confirmWrapper}
                        visible={this.state.confirmModal}>
                        <View style={{width: '100%'}}>
                            <Text style={styles.confirmHeader}>
                                Are you sure you want to cancel this appointment?
                            </Text>
                            <View style={styles.confirmBtns}>
                                <Button
                                    {...addTestID('Confirmation-yes-cancel')}
                                    style={{...styles.outlineBtn, flex: 1, marginTop: 10}}
                                        onPress={() => {
                                            this.closeConfirm();
                                            this.props.cancelAppointment();
                                        }}
                                >
                                    <Text style={styles.outlineText}>Yes, Cancel</Text>
                                </Button>
                                <View style={styles.noBtn}>
                                    <GradientButton
                                        testId = "no"
                                        onPress={this.closeConfirm}
                                        text="No"
                                    />
                                </View>
                            </View>
                        </View>

                    </Overlay>
                    <Content style={styles.mainBG}>
                        <View style={styles.providerBox}>
                            {this.props.appointment.avatar?
                                <Image source={{uri: this.props.appointment.avatar}}
                                       style={styles.proImage}
                                       resizeMode={'cover'}
                                />
                                :
                                <View style={{
                                    ...styles.proBgMain,
                                    backgroundColor: this.props.appointment?.colorCode?this.props.appointment?.colorCode:DEFAULT_AVATAR_COLOR
                                }}><Text
                                    style={styles.proLetterMain}>{this.props.appointment?.participantName?.charAt(0)?.toUpperCase()}</Text></View>
                            }
                            <Text style={styles.proName}>{this.props?.appointment?.participantName}</Text>
                            {this.props.appointment.status!=='FULFILLED' && this.props?.connection?.lastModified && (
                                <Text
                                    style={styles.connectionTime}>{'Connected Since ' + moment(this.props?.connection?.lastModified).format(
                                    'MMM, Y',
                                )}</Text>
                            )}
                            {this.props.appointment?.designation && (
                                <Text style={styles.connectionTime}>{this.props.appointment.designation}</Text>
                            )}
                            {this.props.appointment.status === 'FULFILLED'
                            && (
                                <Rating
                                    readonly
                                    style={{ marginBottom: 24}}
                                    type='star'
                                    showRating={false}
                                    ratingCount={5}
                                    imageSize={22}
                                    selectedColor='#ffca00'
                                    startingValue={this.props.appointment.feedback && this.props.appointment.feedback.rating ? this.props.appointment.feedback.rating : 0}
                                    fractions={2}
                                />
                            )}

                            {this.props.appointment.status === 'BOOKED' && this.isStartingSoon() && (
                                <Button
                                    {...addTestID('Starting-soon')}
                                    transparent
                                        style={styles.soonBtn}>
                                    <Text uppercase={false} style={styles.soonText}>Starting Soon</Text>
                                </Button>
                            )}
                            {this.props.appointment.status === 'BOOKED' && !this.isMissed() && isLate(this.props.appointment.startTime) && (
                                <Button
                                    {...addTestID('You-are-late')}
                                    transparent
                                        style={{...styles.soonBtn, backgroundColor: 'rgba(208,2,27,0.05)'}}>
                                    <Text uppercase={false} style={{...styles.soonText, color: '#d0021b'}}>You're
                                        Late</Text>
                                </Button>
                            )}
                            {this.props.appointment.status === 'BOOKED' && this.isMissed() && (
                                <View style={{...styles.soonBtn, backgroundColor: 'rgba(0,0,0,0.05)'}} disabled={true}>
                                    <Text
                                        {...addTestID('You-missed-it')}
                                        style={{...styles.soonText, alignSelf: 'center', color: 'rgba(12,9,10,0.59)'}}>You
                                        missed it</Text>
                                </View>
                            )}
                            {this.props.appointment.status === 'CANCELLED' && (
                                <View style={{...styles.soonBtn, backgroundColor: 'rgba(0,0,0,0.05)'}} disabled={true}>
                                    <Text
                                        {...addTestID('Cancelled')}
                                        style={{
                                        ...styles.soonText,
                                        alignSelf: 'center',
                                        color: 'rgba(12,9,10,0.59)',
                                    }}>Cancelled</Text>
                                </View>
                            )}
                            {this.props.appointment.status === 'PROPOSED' && (
                                <Button
                                    {...addTestID('Awaiting-confirmation')}
                                    transparent
                                        style={{...styles.soonBtn, backgroundColor: 'rgba(0,146,241,0.05)'}}>
                                    <Text uppercase={false}
                                          style={{...styles.soonText, justifyContent: 'center', color: '#0092f1'}}>Awaiting
                                        Confirmation</Text>
                                </Button>
                            )}
                            {this.props.appointment.status === 'BOOKED' && !isTimeElapsed(this.props.appointment.startTime) && (
                                <View style={styles.completedInfo}>
                                    {timeDifference.days > 0 && (
                                        <Text style={styles.green}>{timeDifference.days + ' '}<Text
                                            style={styles.grey}>Days</Text></Text>)}
                                    <Text style={styles.green}>{timeDifference.hours + ' '}<Text
                                        style={styles.grey}>Hrs</Text></Text>
                                    <Text style={styles.green}>{timeDifference.minutes + ' '}<Text
                                        style={styles.grey}>Mins</Text></Text>
                                    {timeDifference.days <= 0 && (
                                        <Text style={styles.green}>{timeDifference.seconds + ' '}<Text
                                            style={styles.grey}>Sec</Text></Text>)}
                                </View>
                            )}
                            {(this.props.appointment.status === 'NEEDS_ACTION' || this.props.appointment.status === 'PROPOSED') && (
                                this.props.appointment.comment ?
                                    <Text style={styles.apptComment}>{this.props.appointment.comment}</Text> : null
                            )}
                        </View>

                        <View style={styles.list}>

                            <View style={styles.listItem}>
                                <View style={styles.imageWrapper}>
                                    <View style={styles.iconWrapper}>
                                        <CommunityIcon color="#3fb2fe" name="webcam" size={22}/>
                                    </View>
                                </View>
                                <View style={styles.itemDetail}>
                                    <View
                                        style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                                        <View>
                                            <Text style={styles.itemName}>{this.props.appointment.serviceName}</Text>
                                            <Text style={styles.itemDes} numberOfLines={1}>
                                                {this.props?.appointment?.serviceDuration ?
                                                    getDurationText(this.props?.appointment?.serviceDuration) : "N/A" },
                                                ${this.props.appointment.recommendedCost}
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                                {this.props.appointment.status === 'NEEDS_ACTION' && (<View>
                                    <Button
                                        {...addTestID('Edit-change-service-btn')}
                                        transparent onPress={this.props.changeService}>
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>)}
                            </View>

                            <View style={styles.listItem}>
                                <View style={styles.imageWrapper}>
                                    <View style={styles.iconWrapper}>
                                        <Ionicon color="#3fb2fe" name="ios-time" size={20}/>
                                    </View>
                                </View>
                                <View style={styles.itemDetail}>
                                    <Text style={styles.itemName}>{this.getDateDesc(startMoment)}</Text>
                                    <Text style={styles.itemDes} numberOfLines={1}>
                                        {this.getStartTime(startMoment) + ' '}<Ionicon color="#b3bec9"
                                                                                       name="md-arrow-round-forward"
                                                                                       size={12}/>{' ' + this.getEndTime(endMoment)}
                                    </Text>
                                </View>
                                {this.props.appointment.status === 'NEEDS_ACTION' && (<View>
                                    <Button
                                        {...addTestID('Change-slot')}
                                        transparent onPress={this.props.changeSlot}>
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>)}
                            </View>
                            {this.props.appointment.isChanged && (
                                <View style={styles.lastItem}>
                                    <View style={styles.imageWrapper}>
                                        <View style={styles.iconWrapper}>
                                            <CommunityIcon color="#3fb2fe" name="chat" size={26}/>
                                        </View>
                                    </View>
                                    <View style={styles.itemDetail}>
                                        <TouchableOpacity
                                            {...addTestID('Add-request-message')}
                                            style={{paddingTop: 10}}
                                            onPress={() => {
                                                this.props.addRequestMessage(this.state.msgText, this.setRequestMessageText);
                                            }}>
                                            <Text
                                                style={this.state.msgText ? {...styles.msgPlaceholder, color: '#646c73'} : styles.msgPlaceholder}>{this.state.msgText ? this.state.msgText : 'Add message (optional)'}</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Button
                                            {...addTestID('add-request-message-edit-btn')}
                                            transparent
                                                onPress={() => {
                                                    this.props.addRequestMessage(this.state.msgText, this.setRequestMessageText);
                                                }}
                                        >
                                            <Text uppercase={false} style={styles.editText}>Edit</Text>
                                        </Button>
                                    </View>
                                </View>
                            )}
                            {this.props.appointment.status==='FULFILLED' && this.props.appointment.feedback
                            && (this.props.appointment.feedback.publicComment || !!this.props.appointment.feedback.privateFeedback)
                            && (
                                <View style={{...styles.lastItem}}>
                                    <View style={styles.imageWrapper}>
                                        <View style={styles.iconWrapper}>
                                            <CommunityIcon color="#3fb2fe" name="chat" size={26}/>
                                        </View>
                                    </View>
                                    <View>
                                        {this.props.appointment.feedback.publicComment && (
                                            <View style={{...styles.itemDetail, marginBottom: 16}}>
                                                <Text style={styles.itemName}>Public Feedback:</Text>
                                                <Text style={styles.feedbackText}>
                                                    {this.props.appointment.feedback.publicComment}
                                                </Text>
                                            </View>
                                        )}
                                        {!!this.props.appointment.feedback.privateFeedback && this.props.appointment.feedback.privateFeedback.length>0 && (
                                            <View style={{...styles.itemDetail, flex: 0}}>
                                                <Text style={styles.itemName}>Private Feedback:</Text>
                                                <Text style={styles.feedbackText}>
                                                    {this.props.appointment.feedback.privateFeedback}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                            {this.props.appointment.status === 'CANCELLED' && (
                                <View style={styles.lastItem}>
                                    <View style={styles.imageWrapper}>
                                        <View style={styles.iconWrapper}>
                                            <CommunityIcon color="#3fb2fe" name="chat" size={26}/>
                                        </View>
                                    </View>
                                    <View style={styles.itemDetail}>
                                        <Text style={styles.itemName}>Cancellation Reason</Text>
                                        <Text style={styles.itemDes}>
                                            {this.props.appointment.comment}
                                        </Text>
                                    </View>
                                </View>
                            )}


                        </View>

                    </Content>
                    <View style={styles.nextBtn}>
                        {this.props.appointment.status === 'NEEDS_ACTION' && this.props.appointment.isChanged &&
                        (

                            <GradientButton
                                testId = "request-change"
                                text="Request Changes"
                                onPress={() => {
                                    this.requestChanges();
                                }}
                            />
                        )}
                        {this.props.appointment.status === 'NEEDS_ACTION' && !this.props.appointment.isChanged &&
                        (
                            <GradientButton
                                testId = "confirm-appointment"
                                text="Confirm Appointment"
                                onPress={this.props.confirmAppointment}
                            />
                            // <Button style={{...styles.sessionBtn, backgroundColor: '#000'}} transparent >
                            //     <Text style={styles.sessionText}></Text>
                            // </Button>
                        )}
                        {this.props.appointment.status === 'PROPOSED' &&
                        (
                            <GradientButton
                                testId = "go-to-chat"
                                text="Go to Chat"
                                onPress={this.props.gotoChat}
                            />
                            // <Button style={styles.sessionBtn} transparent onPress={this.props.gotoChat}>
                            //     <Text style={styles.sessionText}>Go to Chat</Text>
                            // </Button>
                        )}
                        {this.props.appointment.status === 'BOOKED' && !this.isMissed() &&
                        (
                            <Button

                                style={styles.sessionBtn} transparent onPress={() => {
                                this.props.startSession();
                            }}>
                                <Text {...addTestID('session-info-'+this.props.appointment.appointmentId)} style={styles.sessionText}>Start Session</Text>
                            </Button>
                        )}

                    </View>
                </LinearGradient>
            </Container>
        );
    }

    requestChanges = () => {
        const {appointment} = this.props;
        const payload = {
            appointmentId: appointment.appointmentId,
            participantId: appointment.participantId,
            serviceId: appointment.serviceId,
            slot: appointment.selectedSchedule.slot,
            day: parseInt(appointment.selectedSchedule.day),
            month: parseInt(appointment.selectedSchedule.month),
            year: appointment.selectedSchedule.year,
            comment: this.state.msgText,
        };
        this.props.requestChanges(payload);
    };
}

const styles = StyleSheet.create({
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
    mainBG: {
        // backgroundColor: '#f8f9fd',
    },
    header: {
        height: HEADER_SIZE,
        elevation: 0,
        paddingLeft: 7,
        paddingRight: 18,
        flexDirection: 'column',
        backgroundColor: 'transparent',
    },
    headerContent: {
        flexDirection: 'row',
    },
    backButton: {
        marginLeft: 15,
        width: 35,
    },
    titleText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        lineHeight: 24,
        alignItems: 'center',
        letterSpacing: 0.3,
    },
    nextIcon: {
        marginLeft: 10,
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
        marginBottom: 40,
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
    confirmWrapper: {
        height: 'auto',
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 40 : 25,
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
        shadowOpacity: 0.5,
    },
    providerBox: {
        alignItems: 'center'
    },
    proImage: {
        width: 120,
        height: 120,
        borderRadius: 70,
        marginTop: 20,
        marginBottom: 16
    },
    proName: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        lineHeight: 24,
        letterSpacing: 1,
        marginBottom: 16,
        paddingLeft: 24,
        paddingRight: 24,
        textAlign: 'center'
    },
    connectionTime: {
        color: 'rgba(12,9,10,0.61)',
        fontFamily: 'Roboto-Regular',
        textTransform: 'uppercase',
        fontSize: 14,
        marginBottom: 24
    },
    proRank: {
        color: '#969fa8',
        fontFamily: 'Roboto-Bold',
        textTransform: 'uppercase',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 12,
        letterSpacing: 1.09,
        marginBottom: 24
    },
    soonBtn: {
        backgroundColor: 'rgba(119,199,11,0.05)',
        height: 40,
        borderRadius: 20,
        minWidth: 190,
        justifyContent: 'center',
        marginBottom: 24,
    },
    soonText: {
        color: '#77c70b',
        lineHeight: 13,
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        letterSpacing: 0.7,
    },
    completedInfo: {
        flexDirection: 'row',
        height: 24,
        marginBottom: 24,
    },
    green: {
        color: '#77c70b',
        fontFamily: 'Roboto-Bold',
        fontSize: 16,
        lineHeight: 24,
        letterSpacing: 0,
        paddingLeft: 10,
        paddingRight: 10,
    },
    grey: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        letterSpacing: 0.3,
        paddingLeft: 8,
    },
    apptComment: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.2,
        paddingLeft: 30,
        paddingRight: 30,
        textAlign: 'center',
        marginBottom: 24,
    },
    list: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f5f5f5',
    },
    listItem: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 0,
        borderBottomWidth: 1,
        borderTopColor: '#f5f5f5',
        borderBottomColor: '#f5f5f5',
    },
    lastItem: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30,
    },
    imageWrapper: {
        // flex: 0.5
    },
    iconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(63,178,254,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemDetail: {
        flex: 1,
        paddingLeft: 16,
    },
    itemName: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.3
    },
    feedbackText: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.2,
        marginTop: 8
    },
    itemDes: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 19,
        letterSpacing: 0.28
    },
    unpaidMoney: {
        color: '#d0021b',
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: 13,
        lineHeight: 15,
        letterSpacing: 0,
        marginBottom: 4
    },
    unpaidText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        lineHeight: 13,
        letterSpacing: 0.28,
    },
    msgPlaceholder: {
        color: '#b3bec9',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.2,
    },
    editText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 0.3,
        fontWeight: '600',
    },
    sessionBtn: {
        backgroundColor: '#77c70b',
        height: 48,
        borderRadius: 4,
        minWidth: 195,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sessionText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 13,
        lineHeight: 19.5,
        letterSpacing: 0.7,
        color: '#fff',
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24,
    },
    outlineBtn: {
        borderColor: '#f78795',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        justifyContent: 'center',
        elevation: 0,
    },
    outlineText: {
        color: '#f78795',
        fontSize: 13,
        letterSpacing: 0.7,
        lineHeight: 19.5,
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    dangerBtn: {
        borderColor: '#d0021b',
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#fff',
        height: 48,
        marginBottom: 24,
        justifyContent: 'center',
        elevation: 0,
    },


    dangerBtnText: {
        color: '#d0021b',
        fontSize: 13,
        letterSpacing: 0.7,
        fontFamily: 'Roboto-Bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    proBgMain:{
        width: 120,
        height: 120,
        borderRadius: 70,
        marginTop: 20,
        marginBottom: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 30,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
});
