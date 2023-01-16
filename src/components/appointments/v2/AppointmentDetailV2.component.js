import React, {Component} from "react";
import { Platform, StatusBar, StyleSheet} from 'react-native';
import {Container, Text, View, Button, Content, Header, Left, Body, Right, Icon} from 'native-base';
import Loader from "../../Loader";
import {
    addTestID,
    getDSTOffset,
    getHeaderHeight, getTimeByDSTOffset,
    getTimeDifference,
    isIphoneX,
    isMissed,
    isTimeElapsed
} from "../../../utilities";
import moment from "moment";
import {CommonApptDetailBox} from "../CommonApptDetailBox.component";
import {PrimaryButton} from "../../PrimaryButton";
import {Colors, CommonStyles, TextStyles} from "../../../styles";
import {TransactionSingleActionItem} from "../../TransactionSingleActionItem";
import FeatherIcons from "react-native-vector-icons/Feather";
import AntIcons from "react-native-vector-icons/AntDesign";
import {BackButton} from "../../BackButton";
import Modal from 'react-native-modalbox';
import AwesomeIcons from "react-native-vector-icons/FontAwesome";
import {PROVIDER_ROLES} from "../../../constants";
const HEADER_SIZE = getHeaderHeight();

export  class AppointmentDetailV2Component extends Component {

    constructor(props) {
        super(props);
        this.isSupervisorProvider=this.props?.profile?.signOffRole===PROVIDER_ROLES.SUPERVISOR
        this.isMemberApp=this.props?.isMemberApp
        this.isProviderApp=this.props?.isProviderApp
        this.isPatientProhibitive=this.props?.isPatientProhibitive
        this.state = {
            actionMenu: false
        }
    }


    componentDidMount(): void {
        const {appointment} = this.props;
        console.log(this.props)
        if (appointment.status === 'BOOKED' && !isMissed(appointment)) {
            this.iv = setInterval(() => {
                this.setState({...this.state});
            }, 1000);
        }

    }


    getScreenTitle = () => {
        const {appointment} = this.props;
        switch (appointment.status) {
            case 'BOOKED': {
                if (isMissed(appointment)) {
                    return 'Missed appointment';
                } else {
                    return 'Upcoming appointment';
                }
            }
            case 'CANCELLED':
            case 'NO_SHOW':
            {
                return 'Cancelled appointment';
            }
            case 'PROPOSED': {
                return 'Awaiting confirmation';
            }
            case 'FULFILLED': {
                return 'Completed appointment';
            }
            case 'NEEDS_ACTION': {
                return 'Pending confirmation';
            }
            default: {
                return 'Appointment';
            }
        }
    };


    getPaymentDetailText = ()=>{
        const {appointment} = this.props;
        if(appointment.prePayment && appointment.prePayment.amountRefunded!==null) {
            return 'to wallet';
        }
        return appointment.prePayment.paymentMethod === 'Wallet' ? 'via Wallet' : appointment?.prePayment?.paymentMethod==='INSURANCE'?'Covered via insurance':(appointment.prePayment.last4?'Ending on ' + appointment.prePayment.last4:'via Card')
    };

    getDetailText = () => {
        const {appointment} = this.props;
        switch (appointment.status) {
            case 'CANCELLED': {
                return 'This appointment has been cancelled';
            }
            case 'NO_SHOW': {
                if(appointment.prePayment && appointment.prePayment.amountRefunded!==null) {
                    return "This appointment has been cancelled because the provider didn't show up";
                }
                return "This appointment has been cancelled because the member didn't show up";
            }
            case 'PROPOSED': {
                if(this.props.isProviderApp) {
                    return 'We’re waiting for the member to confirm your appointment request.';
                } else {
                    return 'We’re waiting for this provider to confirm your appointment request. If they don’t confirm your request, your payment will be returned to your wallet.';
                }

            }
            case 'BOOKED': {
                if(isMissed(appointment)) {
                    return 'One or both participants missed this appointment.';
                }
                return null;
            }
            case 'NEEDS_ACTION': {
                return 'Other participant is waiting for you to confirm this appointment request.';
            }
        }
        return null;
    };

    getDurationText = (duration) => {
        let hours = Math.floor(duration / 60);
        let minutes = duration % 60;
        let text = '';
        if (hours > 0) {
            text = hours + ' hour';
        }
        if (minutes > 0) {
            text += ' ' + minutes + ' minute';
        }
        return text + ' session';
    };

    closeActionMenu = () => {
        this.setState({
            actionMenu: false
        })
    };

    navigateToChat = ()=>{
        this.closeActionMenu();
        this.props.navigateToChat();
    };

    cancelAppointment = ()=>{
        this.closeActionMenu();
        this.props.cancelAppointment();
    };

    addEventToCalendar = ()=>{
        this.closeActionMenu();
        this.props.addToCalender();
    };

    startSession = ()=>{
        this.closeActionMenu();
        this.props.startSession();
    };

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

    render = () => {
        // StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        if (this.state.isLoading || this.props.isLoading) {
            return <Loader/>;
        }
        const {appointment} = this.props;
        const {status} = appointment;
        const isBooked = status === 'BOOKED';
        const isPendingApproval = status === 'NEEDS_ACTION';
        const isMissedAppt = isMissed(appointment);
        const isUpcoming = isBooked && !isMissedAppt;
        const isCancelled = status === 'CANCELLED' || status === 'NO_SHOW';
        const isCompleted = status === 'FULFILLED';
        const isRequested = status === 'PROPOSED';

        const dstOffset = getDSTOffset();
        let startTime = this.getDSTOffsetDetails(moment(appointment.startTime,'YYYY-MM-DDTHH:mm:ss.sssZ').utcOffset(dstOffset).format('YYYY-MM-DDTHH:mm:ss.sssZ'));
        const timeDifference = getTimeDifference(startTime);

        const isToday = status === 'BOOKED' && moment().isSame(moment(appointment.startTime), 'days');
        let dateText = isToday ? 'Today' : `${this.props?.appointment?.month} ${this.props?.appointment?.date}, ${this.props?.appointment?.year}`;
        let timeText = `${appointment.startText} - ${appointment.endText}`;
        if(appointment.selectedSchedule) {
            dateText = appointment.selectedSchedule.dateDesc;
            timeText = `${appointment.selectedSchedule.slotStartTime.time} ${appointment.selectedSchedule.slotStartTime.amPm} - ${appointment.selectedSchedule.slotEndTime.time} ${appointment.selectedSchedule.slotEndTime.amPm}`
        }

        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                <Header transparent
                        style={styles.headerWrap}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'dark-content'}
                    />
                    <Left>
                        <BackButton
                            onPress={this.props.backClicked}
                        />
                    </Left>
                    <Body/>
                    <Right>
                        <Button transparent
                                onPress={()=>{this.setState({actionMenu: true})}}>
                            <Icon name={'more-horizontal'} type={'Feather'} style={styles.moreIcon}/>
                        </Button>
                    </Right>
                </Header>
                <Content>
                    <View style={styles.titleWrap}>
                        <Text style={styles.mainHeading}>{this.getScreenTitle()}</Text>
                        <Text style={styles.subText}>{this.getDetailText()}</Text>
                    </View>
                    <View style={styles.infoListWrap}>
                        <Text style={styles.infoHeading}>
                            Appointment details
                        </Text>
                        <CommonApptDetailBox
                            providerInfo
                            isProviderApp={this.props.isProviderApp}
                            isPatientProhibitive={this.props.isPatientProhibitive}
                            mainText={appointment.participantName}
                            subText={(!this.props.isProviderApp && (appointment.designation || 'Therapist')) || 'Member'}
                            avatar={appointment.avatar}
                            onPress={this.navigateToChat}
                            nextArrow={true}
                        />
                        <CommonApptDetailBox
                            mainText={appointment.serviceName}
                            subText={this.getDurationText(appointment.serviceDuration)}
                            textBtn={isPendingApproval}
                            textBtnContent={isPendingApproval && 'Edit'}
                            onPress={isPendingApproval && this.props.changeService}
                        />
                        <CommonApptDetailBox
                            mainText={dateText}
                            subText={timeText}
                            textBtn={isPendingApproval}
                            textBtnContent={isPendingApproval && 'Edit'}
                            onPress={isPendingApproval && this.props.changeSlot}
                        />
                        {
                            appointment.prePayment && !this.props.isProviderApp && (
                                <>
                                    <Text style={styles.infoHeading}>
                                        Payment details
                                    </Text>
                                    <CommonApptDetailBox
                                        paymentInfo
                                        mainText={`$${appointment.prePayment.amountPaid} ${appointment.prePayment.amountRefunded!==null?'refunded':'paid'}`}
                                        paymentDetailText={this.getPaymentDetailText()}
                                        cardBrand={appointment.prePayment.paymentMethod === 'Stripe' && appointment.prePayment.brand}
                                        textBtn={true}
                                        onPress={!this.props.isProviderApp && this.props.navigateToWallet}
                                        textBtnContent={'My Wallet'}
                                    />
                                </>
                            )
                        }


                        {
                            status === 'FULFILLED' && (
                                <>
                                    <Text style={styles.infoHeading}>
                                        Feedback
                                    </Text>
                                    {
                                        !appointment.feedback ? (
                                            <CommonApptDetailBox
                                                mainText={'Public Feedback'}
                                                subText={'No feedback given'}
                                                textBtn={!this.props.isProviderApp}
                                                textBtnContent={this.props.isProviderApp && 'Give feedback'}
                                                onPress={this.props.isProviderApp && this.props.navigateToFeedback}

                                            />
                                        ) : (
                                            <>
                                                <CommonApptDetailBox
                                                    mainText={'Public Feedback'}
                                                    subText={(appointment.feedback.publicComment && appointment.feedback.publicComment !== '') ? appointment.feedback.publicComment : 'No feedback given'}
                                                    rating={appointment.feedback.rating}
                                                />
                                            </>
                                        )
                                    }
                                </>
                            )
                        }
                    </View>

                </Content>
                {
                    isUpcoming && !isTimeElapsed(startTime) && (
                        <>
                            <View style={styles.counterWrap}>
                                {
                                    timeDifference.days > 0 && (
                                        <View style={styles.singleCount}>
                                            <Text style={styles.pinkText}>{timeDifference.days}</Text>
                                            <Text style={styles.blackText}>days</Text>
                                        </View>
                                    )
                                }

                                <View style={styles.singleCount}>
                                    <Text style={styles.pinkText}>{timeDifference.hours}</Text>
                                    <Text style={styles.blackText}>hours</Text>
                                </View>
                                <View style={styles.singleCount}>
                                    <Text style={styles.pinkText}>{timeDifference.minutes}</Text>
                                    <Text style={styles.blackText}>minutes</Text>
                                </View>
                                {timeDifference.days <= 0 && (
                                    <View style={styles.singleCount}>
                                        <Text style={styles.pinkText}>{timeDifference.seconds}</Text>
                                        <Text style={styles.blackText}>seconds</Text>
                                    </View>
                                )}

                            </View>
                        </>

                    )
                }
                <View style={styles.greBtns}>
                    {
                        isUpcoming && (
                            <>
                                {
                                    <View style={styles.singleGreBtn}>
                                        <PrimaryButton
                                            onPress={this.addEventToCalendar}
                                            bgColor={Colors.colors.mainBlue10}
                                            textColor={Colors.colors.primaryText}
                                            text={'Add to Calendar'}
                                        />
                                    </View>
                                }
                                <View>
                                    <PrimaryButton
                                        onPress={this.startSession}
                                        text={'Go to waiting room'}
                                    />
                                </View>
                            </>
                        )
                    }
                    {
                        ((isBooked && isMissed(appointment)) || isCancelled || isCompleted) || (this.isProviderApp && this.isSupervisorProvider && !appointment?.requireSupervisorSignOff) && (
                            <View>
                                <PrimaryButton onPress={this.props.requestNewAppointment} text={'Request new appointment'}/>
                            </View>
                        )
                    }
                    {
                        ((isBooked && isMissed(appointment)) || isCancelled || isCompleted) && (this.isProviderApp && !this.isSupervisorProvider) &&(
                            <View>
                                <PrimaryButton onPress={this.props.requestNewAppointment} text={'Request new appointment'}/>
                            </View>
                        )
                    }
                    {
                        this.isMemberApp && ( (isBooked && isMissed(appointment)) || isCancelled || isCompleted) &&(
                            <View>
                                <PrimaryButton onPress={this.props.requestNewAppointment} text={'Request new appointment'}/>
                            </View>
                        )
                    }
                    {
                        isRequested && (
                            <View>
                                <PrimaryButton onPress={this.navigateToChat} text={'Send message'}/>
                            </View>
                        )
                    }
                    {
                        isPendingApproval && (
                            <View>
                                {
                                    appointment.isChanged ? (
                                        <PrimaryButton onPress={this.requestChanges} text={'Request changes'}/>
                                    ) : (
                                        <PrimaryButton onPress={this.props.confirmAppointment} text={'Confirm appointment'}/>
                                    )
                                }

                            </View>
                        )
                    }

                </View>

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.closeActionMenu}
                    style={{...CommonStyles.styles.commonModalWrapper,
                        //maxHeight: isUpcoming? '55%' : '30%',
                        height : 'auto',
                        position: 'absolute'
                    }}
                    isOpen={this.state.actionMenu}
                    entry={'bottom'}
                    position={'bottom'} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <Content showsVerticalScrollIndicator={false}>
                        <View
                            // onLayout={(event) => this.onLayout(event)}
                            style={styles.bookActionList}>

                            {
                                !isCancelled && !isCompleted && !isMissedAppt && (
                                    <View style={styles.singleAction}>
                                        <TransactionSingleActionItem
                                            title={'Cancel appointment'}
                                            iconBackground={Colors.colors.errorBG}
                                            styles={styles.gButton}
                                            onPress={this.cancelAppointment}
                                            renderIcon={(size, color) =>
                                                <AntIcons size={22} color={Colors.colors.errorIcon} name="closecircleo"/>
                                            }
                                        />
                                    </View>
                                )
                            }



                            {/*<View style={styles.singleAction}>*/}
                            {/*    <TransactionSingleActionItem*/}
                            {/*        title={'Edit appointment'}*/}
                            {/*        iconBackground={Colors.colors.warningBG}*/}
                            {/*        styles={styles.gButton}*/}
                            {/*        renderIcon={(size, color) =>*/}
                            {/*            <LineIcons size={22} color={Colors.colors.warningIcon} name="pencil"/>*/}
                            {/*        }*/}
                            {/*    />*/}
                            {/*</View>*/}
                            <View style={styles.singleAction}>
                                <TransactionSingleActionItem
                                    title={`Message ${this.props.isProviderApp?'member': 'provider'}`}
                                    iconBackground={Colors.colors.secondaryColorBG}
                                    styles={styles.gButton}
                                    renderIcon={(size, color) =>
                                        <FeatherIcons size={22} color={Colors.colors.secondaryIcon} name="message-circle"/>
                                    }
                                    onPress={this.navigateToChat}
                                />
                            </View>

                            {
                                isUpcoming && !this.state.addedToCalender && (
                                    <View style={styles.singleAction}>
                                        <TransactionSingleActionItem
                                            title={'Add to Calendar'}
                                            iconBackground={Colors.colors.successBG}
                                            styles={styles.gButton}
                                            renderIcon={(size, color) =>
                                                <FeatherIcons size={22} color={Colors.colors.successIcon} name="plus"/>
                                            }
                                            onPress={this.addEventToCalendar}
                                        />
                                    </View>
                                )
                            }

                            {
                                isUpcoming && (
                                    <View style={styles.singleAction}>
                                        <TransactionSingleActionItem
                                            title={'Go to waiting room'}
                                            iconBackground={Colors.colors.primaryColorBG}
                                            styles={styles.gButton}
                                            renderIcon={(size, color) =>
                                                <AwesomeIcons size={20} color={Colors.colors.primaryIcon}
                                                              name="long-arrow-right"/>
                                            }
                                            onPress={this.startSession}
                                        />
                                    </View>
                                )
                            }

                        </View>
                    </Content>
                </Modal>
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    headerWrap: {
        paddingLeft: 22,
        paddingRight: 18,
        height: HEADER_SIZE,
    },
    moreIcon: {
        color: Colors.colors.primaryIcon,
        fontSize: 30,
    },
    titleWrap: {
        padding: 24,
    },
    mainHeading: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH1,
        ...TextStyles.mediaTexts.serifProExtraBold,
        marginBottom: 8,
    },
    subText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.bodyTextM,
        ...TextStyles.mediaTexts.manropeRegular,
    },
    infoListWrap: {
        paddingHorizontal: 24,
        paddingTop: 8,
        paddingBottom: 24
    },
    infoHeading: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.overlineTextS,
        ...TextStyles.mediaTexts.manropeBold,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    counterWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        // marginVertical: 16
    },
    singleCount: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    pinkText: {
        color: Colors.colors.secondaryText,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH5,
        marginRight: 8,
    },
    blackText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
    },
    greBtns: {
        padding: 24,
        paddingBottom: isIphoneX() ? 34 : 24,
        ...CommonStyles.styles.stickyShadow
    },
    singleGreBtn: {
        marginBottom: 16,
    },
    singleAction: {
        marginBottom: 16,
    },
});
