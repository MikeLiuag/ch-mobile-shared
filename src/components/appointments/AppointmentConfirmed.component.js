import React, {Component} from 'react';
import {StatusBar, StyleSheet, View, Platform, AppState, BackHandler, Image} from 'react-native';
import {Body, Button, Container, Content, Header, Left, Right, Text, Title} from 'native-base';
import GradientButton from '../../components/GradientButton';
import LinearGradient from "react-native-linear-gradient";
import {getAvatar, addTestID, isIphoneX, getHeaderHeight, isIphone12, getTimeByDSTOffset} from "../../utilities";
import LottieView from "lottie-react-native";
import alfieTreat from "../../assets/animations/Dog_with_Treat";
import {Rating} from 'react-native-elements';
import Overlay from "react-native-modal-overlay";
import Ionicon from "react-native-vector-icons/Ionicons";
import GenericActionButton from "ch-mobile-shared/src/components/GenericActionButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {PrimaryButton} from '../PrimaryButton'
import {SecondaryButton} from '../SecondaryButton'
import {Colors,TextStyles} from "../../styles";
import moment from 'moment';
import momentTimeZone from "moment-timezone";

const HEADER_SIZE = getHeaderHeight();

export class AppointmentConfirmedComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            modalVisible: false
        };
    }

    handleBackButton = () => {
        this.props.done();
    }


    componentDidMount(): void {
        AppState.addEventListener('change', this._handleAppState);
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    }

    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
    }

    _handleAppState = () => {
        if (this.state.appState === 'active') {
            if (this.animation) {
                this.animation.play();
            }
        }
    };

    onClose() {
        this.setState({
            modalVisible: false,
        });

    }

    showModal() {
        this.setState({
            modalVisible: true,
        });
    }

    getDSTOffsetDetails = (appointmentStartTime,appointmentEndTime)=>{
        let startDate,endDate;
        let dateAfterDSTOffset = getTimeByDSTOffset(appointmentStartTime).utcOffset();
        let dateBeforeDSTOffset = moment(appointmentStartTime).utcOffset();
        if(dateAfterDSTOffset === dateBeforeDSTOffset){
            startDate =  moment(appointmentStartTime).format('YYYY-MM-DDTHH:mm:ss.sssZ');
            endDate = moment(appointmentEndTime).format('YYYY-MM-DDTHH:mm:ss.sssZ')
        }
        else if(dateAfterDSTOffset<dateBeforeDSTOffset){
            startDate=  moment(appointmentStartTime).subtract(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ');
            endDate= moment(appointmentEndTime).subtract(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ')
        }else{
            startDate=  moment(appointmentStartTime).add(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ');
            endDate= moment(appointmentEndTime).add(1,"hours").format('YYYY-MM-DDTHH:mm:ss.sssZ')
        }
        return { startDate,endDate}
    }

    addEventToCalendar = async () => {
        const {appointment} = this.props;
        let startDate , endDate;
        let dstOffsetDetail = this.getDSTOffsetDetails(appointment.startTime, appointment.endTime);
        startDate = dstOffsetDetail?.startDate;
        endDate = dstOffsetDetail?.endDate;
        const eventConfig = {
            title: 'Appointment with ' +
                appointment.participantName,
            startDate:  startDate,
            endDate: endDate,
            appointmentId: appointment.appointmentId,
        };
        if (!this.props.providerApp) {
            const url = await this.props.deepLinkService(eventConfig, appointment);
            console.log("branch link for appointment =", url)
            eventConfig.notes = url;
        }
        this.props.addToCalender(
            eventConfig,
        );
    };

    renderActionOverlay = () => {
        return (
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
                        <GenericActionButton
                            onPress={() => {
                                this.addEventToCalendar();
                            }}
                            title={'Add to calendar'}
                            iconBackground={'#77C70B'}
                            styles={styles.gButton}
                            renderIcon={(size, color) =>
                                <MaterialCommunityIcons
                                    name='calendar-plus'
                                    size={25}
                                    color={color}
                                />
                            }
                        />
                    </View>

                </View>
            </Overlay>
        )
    }

    renderProvider = () => {
        const item = this.props.selectedProvider;
        if (!item) {
            return null;
        }
        return (
            <View style={styles.personalInfoWrapper}>
                <View style={styles.imageWrapper}>

                    {item.profilePicture ?
                        <Image
                            style={styles.proImage}
                            resizeMode="cover"
                            source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}}/>
                        :
                        <View style={{
                            ...styles.proBgMain,
                            backgroundColor: item.colorCode
                        }}><Text
                            style={styles.proLetterMain}>{item.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.itemDetail}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemDes} numberOfLines={1}>
                        {item.designation}
                    </Text>

                </View>
                <View style={styles.ratingArea}>
                    <View style={{flexDirection: 'row'}}>
                        <Rating
                            readonly
                            type="star"
                            showRating={false}
                            ratingCount={5}
                            imageSize={19}
                            selectedColor="#ffca00"
                            startingValue={item.combinedRating}
                            fractions={2}
                        />
                    </View>
                    <Text style={styles.reviewBtnText}>
                        {item.totalReviews} review{item.totalReviews > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>
        );
    }

    renderSchedule = () => {
        const slotStart = this.props.selectedSchedule.slotStartTime;
        return (
            <View style={styles.scheduleContainer}>
                <View style={styles.serviceContainer}>
                    <Text style={styles.itemName}>{this.props.selectedService.name}</Text>
                    <Text style={styles.itemDes}>{this.props.selectedService.durationText} session</Text>
                </View>
                <View style={styles.timeContainer}>
                    <Text style={styles.itemDes}>{this.props.selectedSchedule.dayDateText}</Text>
                    <Text style={styles.itemDes}>{slotStart.time} {slotStart.amPm}</Text>
                </View>
            </View>
        )
    }

    renderViewForProvider = () => {
        return (
            <LinearGradient
                start={{x: 1, y: 1}}
                end={{x: 1, y: 0}}
                colors={["#fff", "#fff", "#f7f9ff"]}
                style={{flex: 1}}
            >
                <Header noShadow transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : "transparent"}
                        translucent
                        barStyle={'dark-content'}
                    />
                    {!this.props.isRequest
                        ? <Right>
                            <Button
                                transparent
                                style={{marginRight: 0, justifyContent: 'center'}}
                                onPress={() => {
                                    this.showModal();
                                }}
                            >
                                <Ionicon name='ios-more' size={30}
                                         color={this.state.modalVisible ? '#646c73' : '#4FACFE'}/>
                            </Button>
                        </Right>
                        : null
                    }
                </Header>
                {this.renderActionOverlay()}
                <Content
                    {...addTestID('Appointment-confirmed-content')}
                    scrollIndicatorInsets={{right: 1}}
                    contentContainerStyle={{alignItems: 'center'}}>
                    <Text
                        style={styles.apptHeading}>{this.props.isRequest ? 'Your appointment request has been sent!' : 'You have confirmed this appointment!'}</Text>
                    {/*<Image source={require('../../assets/images/Appt-sent.png')}*/}
                    {/*       style={styles.sentImage}*/}
                    {/*       resizeMode={'contain'}*/}
                    {/*       />*/}

                    <LottieView
                        ref={animation => {
                            this.animation = animation;
                        }}
                        style={styles.sentImage}
                        resizeMode="cover"
                        source={alfieTreat}
                        autoPlay={true}
                        loop/>

                </Content>
                {!this.props.isRequest
                    ? <Text
                        onPress={() => {
                            this.addEventToCalendar();
                        }}
                        style={styles.blueText}>Add to calendar</Text>
                    : null
                }
                <View style={styles.nextBtn}>
                    <GradientButton
                        testId="okay"
                        text="Okay"
                        onPress={this.props.done}
                    />
                </View>
            </LinearGradient>
        );
    };

    getMessage = ()=>{
        if(this.props.providerApp) {
            return this.props.isRequest ? "We’ve notified the member of your appointment request." : 'You have confirmed this appointment!'
        } else {
            return this.props.isRequest ? "We’ve notified your provider of your appointment request. They’ll get back to you with a response within 24 hours." : 'You have confirmed this appointment!'
        }
    }

    renderViewForMember = () => {
        return (
            <Container style={{backgroundColor:Colors.colors.screenBG}}>
                <Header transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'dark-content'}
                    />
                    <Left/><Body/><Right/>
                </Header>
                <Content
                    {...addTestID('Appointment-confirmed-content')}
                    scrollIndicatorInsets={{right: 1}}
                    contentContainerStyle={{padding: 24, alignItems: 'center', justifyContent: 'center'}}>
                    <Image source={require('../../assets/images/calendar-with-dog.png')}
                           resizeMode={'contain'}
                    />
                    <View style={{marginBottom: 178, marginTop: 56}}>
                        <Text style={styles.apptTitle}>{this.props.isRequest? 'Appointment \nrequest sent': 'You are booked!'}</Text>
                        <Text
                            style={styles.apptSubText}>{this.getMessage()}</Text>
                    </View>
                </Content>
                <View style={styles.nextBtn}>
                    {!this.props.isRequest ?
                        <View style={{marginBottom: 8}}>
                            <SecondaryButton
                                testId="Add to Calendar"
                                color={Colors.colors.primaryText}
                                onPress={() => {
                                    this.addEventToCalendar(this.state.selectedItem)
                                }}
                                text="Add to Calendar"
                                textStyle={styles.addToCalenderText}
                            />
                        </View>
                        : null
                    }
                    <PrimaryButton
                        testId="Go to chat"
                        color={Colors.colors.mainBlue}
                        onPress={() => {
                            this.props.goToChat()
                        }}
                        text="Go to chat"
                    />
                </View>
            </Container>
        );
    };

    render = () => {
        return (
            <Container>
                {
                    this.renderViewForMember()
                }

            </Container>
        );
    };
}

const styles = StyleSheet.create({

    header: {
        paddingTop: 15,
        paddingLeft: 3,
        paddingRight: 0,
        height: HEADER_SIZE
    },
    backButton: {
        marginLeft: 18,
        width: 40,
    },
    headerRow: {
        flex: 3,
        alignItems: 'center'
    },
    headerText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH5,
        color: Colors.colors.highContrast,
        textAlign: 'center',
    },
    proImage: {
        width: 65,
        height: 65,
        borderRadius: 45,
        overflow: 'hidden'
    },
    proBgMain: {
        width: 65,
        height: 65,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.whiteColor,
    },

    addToCalenderText:{
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.buttonTextL,
        color: Colors.colors.primaryText,
        textAlign: "center",
        width: "100%",
    },


    apptHeading: {
        marginTop: 30,
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 36,
        letterSpacing: 1,
        marginBottom: 16,
        paddingLeft: 40,
        paddingRight: 40
    },
    sentImage: {
        width: 350,
        height: 300,
        // alignSelf: 'center'
    },
    checkWrapper: {
        paddingRight: 16
    },
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24
    },
    personalInfoWrapper: {
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: '#fff',
        padding: 16,
        marginTop: 1,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        marginBottom: 30
    },
    imageWrapper: {},
    itemDetail: {
        flex: 1,
        paddingLeft: 16
    },
    itemName: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 15,
        letterSpacing: 0.3
    },
    itemDes: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        lineHeight: 19,
        letterSpacing: 0.28
    },

    reviewBtnText: {
        color: '#515d7d',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        fontWeight: '500',
        lineHeight: 22,
        letterSpacing: 0.43,
    },
    scheduleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 22,
        paddingTop: 30,
        borderColor: 'rgba(0,0,0,0.05)',
        backgroundColor: 'white',
        width: '100%'
    },
    serviceContainer: {
        flexDirection: 'column',
    },
    timeContainer: {
        flexDirection: 'column',
        alignItems: 'flex-end'
    },
    blueText: {
        fontFamily: 'Roboto-Regular',
        color: '#3fb2fe',
        fontSize: 15,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
        marginBottom: 10
    },
    overlayBG: {
        backgroundColor: 'rgba(37,52,92,0.35)',
        zIndex: -1
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
        zIndex: 0
    },
    actionHead: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        height: HEADER_SIZE + (isIphoneX() ? (isIphone12() ? 0 : 24) : 0),
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        paddingLeft: 20,
        paddingRight: 24,
        paddingBottom: 5
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

    apptTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
        textAlign:'center',
        marginBottom:8

    },
    apptSubText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.subTextL,
        color: Colors.colors.mediumContrast,
        textAlign:'center'
    }
});
