import React, {Component} from 'react';
import {FlatList, Platform, StatusBar, StyleSheet} from "react-native";
import {Container, Text, View, Header} from 'native-base';
import {addTestID, getHeaderHeight, isMissed, sortAppointments} from "../../../utilities";
import {Colors, CommonStyles, TextStyles} from "../../../styles";
import {SliderSearch} from "../../slider-search";
import {CommonSegmentHeader} from "../../CommonSegmentHeader";
import alfie from "../../../assets/animations/Dog_Calendar.json";
import LottieView from "lottie-react-native";
import {PrimaryButton} from "../../PrimaryButton";
import {CommonAppointmentBox} from "../CommonAppointmentBox.component";
import {SearchFloatingButton} from "../../searchFloatingButton/SearchFloatingButton";
import moment from "moment";
import {ContentLoader} from "../../ContentLoader";
import {DEFAULT_AVATAR_COLOR} from "../../../constants";
import {APPOINTMENT_SIGNOFF_STATUS, PROVIDER_ROLES} from "ch-mobile-shared/src/constants";

const HEADER_SIZE = getHeaderHeight();

export class AppointmentsV2Component extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeSegmentId: null,
            filteredAppointments: null,
            refreshing: false,
            changeSegmentTab: (tabId)=>{}
        }
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS) {
        let appointments = this.getAppointments(this.state.filteredAppointments);
        const segmentedAppointments = this.getSegmentedAppointments(appointments);

        if(segmentedAppointments.pending.length>0) {
            if(!this.props.loaders.current && prevProps.loaders.current) {
                this.state.changeSegmentTab('pending');
            }
        }
    }

    propagate = (data) => {
        this.setState({filteredAppointments: data.appointments});
    };

    arrayUniqueByKey = (array, key)=>{
        return [...new Map(array.map(item =>
            [item[key], item])).values()];
    }

    getMergedSections = () => {
        return this.arrayUniqueByKey([...this.props.currentAppointments, ...this.props.pastAppointments], 'appointmentId');
    };

    getAppointments = (appts) => {
        let appointments = appts || this.getMergedSections();
        if (appointments && appointments.length > 0) {
            appointments = appointments.map((item) => {
                if (!item.avatar) {
                    item.colorCode = this.findAvatarColorCode(item.participantId);
                }
                return item;

            });
        }
        return appointments;
    };


    findAvatarColorCode = (connectionId) => {

        let connection = this.props.connections.activeConnections.filter(connection => connection.connectionId === connectionId);
        if (connection && connection.length < 1) {
            connection = this.props.connections.pastConnections.filter(connection => connection.connectionId === connectionId);
        }
        return connection && connection.length > 0 && connection[0].colorCode ? connection[0].colorCode : DEFAULT_AVATAR_COLOR;

    };

    getSegmentedAppointments = (appointments) => {
        const segments = {
            pending: [],
            current: [],
            past: [],
        };
        appointments.forEach(appointment => {
            if (appointment.status === 'NEEDS_ACTION') {
                segments.pending.push(appointment);
            }  else if (this.props?.isProviderApp &&  appointment.status === 'FULFILLED' && appointment?.signOffStatus !== 'APPROVED' && ( ((this.props?.profile?.signOffRole === PROVIDER_ROLES.ASSOCIATE || this.props?.profile?.signOffRole === PROVIDER_ROLES.DEFAULT) && appointment?.signOffStatus === 'REJECTED') || (this.props?.profile?.signOffRole === PROVIDER_ROLES.SUPERVISOR && appointment?.signOffStatus === 'REVIEW')  || appointment?.signOffStatus === 'DRAFTED')){
                segments.pending.push(appointment);
            }else {
                if (appointment.status === 'FULFILLED' || appointment.status === 'NO_SHOW' || appointment.status === 'CANCELLED' || (this.props?.profile?.signOffRole === PROVIDER_ROLES.SUPERVISOR && appointment?.signOffStatus === 'REJECTED') || (this.props?.profile?.signOffRole === PROVIDER_ROLES.ASSOCIATE && appointment?.signOffStatus === 'REVIEW') || (appointment.status === 'BOOKED' && isMissed(appointment))) {
                    segments.past.push(appointment);
                } else {
                    segments.current.push(appointment);
                }

            }
        });

        return {
            pending: sortAppointments(segments.pending),
            current: sortAppointments(segments.current),
            past: sortAppointments(segments.past).reverse(),
        };
    };

    getEmptyMessages = () => {
        let emptyStateMsg = '';
        let emptyStateHead = '';
        switch (this.state.activeSegmentId) {
            case 'current': {
                emptyStateHead = 'No current appointments';
                emptyStateMsg = 'You have no current appointments. If you don’t think this is right, then check your scheduled appointments or reach out to your provider.';
                break;
            }
            case 'past': {
                emptyStateHead = 'No past appointments';
                emptyStateMsg = 'You have no completed appointments. If you don’t think this is right, then check your scheduled appointments or reach out to your provider.';
                break;
            }
        }
        return (
            <View style={styles.emptyView}>
                <LottieView
                    ref={animation => {
                        this.animation = animation;
                    }}
                    style={styles.emptyAnim}
                    resizeMode="cover"
                    source={alfie}
                    autoPlay={true}
                    loop/>
                <Text style={styles.emptyTextMain}>{emptyStateHead}</Text>
                <Text style={styles.emptyTextDes}>{emptyStateMsg}</Text>
                <View style={styles.bookBtn}>
                    <PrimaryButton
                        onPress={this.props.startBookingFlow}
                        text={'Book appointment'}
                    />
                </View>
            </View>
        );
    };

    render = () => {
        // StatusBar.setBackgroundColor('transparent', true);
        StatusBar.setBarStyle('dark-content', true);
        let allAppointments = this.getAppointments();
        let appointments = this.getAppointments(this.state.filteredAppointments);
        const segmentedAppointments = this.getSegmentedAppointments(appointments);
        let {activeSegmentId} = this.state;
        let tabs = [
            {title: 'Current', segmentId: 'current'},
            {title: 'Past', segmentId: 'past'},
        ];

        if (segmentedAppointments.pending.length > 0) {
            tabs = [{title: 'Pending', segmentId: 'pending'}, ...tabs];
            // activeSegmentId = 'pending';
        }
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                <Header transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'dark-content'}
                    />

                    <SliderSearch
                        {...addTestID('Appointment-header')}
                        propagate={this.propagate}
                        hideSearchIcon={this.props.error}
                        options={{
                            screenTitle: 'Appointments',
                            searchFieldPlaceholder: 'Search Appointments',
                            listItems: {
                                appointments: allAppointments,
                            },

                            filter: (listItems, query) => {
                                return {
                                    appointments: listItems.appointments
                                        .filter(appt =>
                                            appt.participantName
                                                .toLowerCase()
                                                .includes(query.toLowerCase().trim()) ||
                                            appt.serviceName
                                                .toLowerCase()
                                                .includes(query.toLowerCase().trim()),
                                        ),
                                };
                            },
                            backClicked: this.props.backClicked,

                        }}

                    />


                </Header>

                <View style={{
                    paddingHorizontal: 24,
                    ...CommonStyles.styles.headerShadow
                }}>
                    <CommonSegmentHeader
                        segments={tabs}
                        segmentChanged={(segmentId) => {
                            this.setState({activeSegmentId: segmentId});
                        }}
                        setTabControl={callback=>{
                            this.setState({changeSegmentTab: callback});
                        }}
                    />
                </View>
                <View style={{paddingHorizontal: 24, flex: 1}}>
                    {
                        segmentedAppointments[activeSegmentId] && (
                            <View style={{flex: 1}}>
                                {
                                    this.props.connections.isLoading || this.props.loaders[activeSegmentId] ?
                                        <ContentLoader type={'appt-v2'} numItems={4}/>
                                        : <>
                                            {
                                                segmentedAppointments[activeSegmentId].length === 0
                                                    ? this.getEmptyMessages()
                                                    : <FlatList
                                                        style={{ paddingTop: 24 }}
                                                        data={segmentedAppointments[activeSegmentId]}
                                                        keyExtractor={(item,index)=>item.appointmentId + "-" + index}
                                                        refreshing={this.state.refreshing}
                                                        showsVerticalScrollIndicator={false}
                                                        onRefresh={()=>{
                                                            this.setState({
                                                                refreshing: true
                                                            });
                                                            this.props.refreshAppointments();
                                                            setTimeout(()=>{
                                                                this.setState({refreshing: false});
                                                            }, 3000);
                                                        }}
                                                        renderItem={({item}) => {
                                                            const appointment = item;
                                                            let statusToggle = false;
                                                            let apptStatusText = '';
                                                            let apptStatusBg = Colors.colors.highContrastBG;
                                                            let statusTextColor = Colors.colors.mediumContrast;
                                                            if (appointment.status === 'CANCELLED') {
                                                                statusToggle = true;
                                                                apptStatusText = 'Canceled appointment';
                                                                apptStatusBg = Colors.colors.highContrastBG;
                                                                statusTextColor = Colors.colors.mediumContrast;
                                                            } else if (appointment.status === 'NO_SHOW') {
                                                                statusToggle = true;
                                                                apptStatusText = 'Marked as No Show';
                                                                apptStatusBg = Colors.colors.highContrastBG;
                                                                statusTextColor = Colors.colors.mediumContrast;
                                                            } else if (appointment.status === 'BOOKED' && isMissed(appointment)) {
                                                                statusToggle = true;
                                                                apptStatusText = 'You missed this appointment';
                                                                apptStatusBg = Colors.colors.secondaryColorBG;
                                                                statusTextColor = Colors.colors.secondaryText;
                                                            } else if (appointment.status === 'PROPOSED') {
                                                                statusToggle = true;
                                                                apptStatusText = 'Requested appointment';
                                                                apptStatusBg = Colors.colors.highContrastBG;
                                                                statusTextColor = Colors.colors.mediumContrast;
                                                            } else if (appointment.status === 'FULFILLED' && appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.REVIEW && (this.props?.profile?.signOffRole === PROVIDER_ROLES.ASSOCIATE || this.props?.profile?.signOffRole === PROVIDER_ROLES.DEFAULT)) {
                                                                statusToggle = true;
                                                                apptStatusText = 'Appointment notes in review';
                                                                apptStatusBg = Colors.colors.highContrastBG;
                                                                statusTextColor = Colors.colors.mediumContrast;
                                                            }else if (appointment.requireSupervisorSignOff && appointment.status === 'FULFILLED' && (appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.APPROVED) && (this.props?.profile?.signOffRole === PROVIDER_ROLES.ASSOCIATE || this.props?.profile?.signOffRole === PROVIDER_ROLES.DEFAULT)) {
                                                                statusToggle = true;
                                                                apptStatusText = appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.APPROVED?'Approved after review':'Rejected after review';
                                                                apptStatusBg = Colors.colors.highContrastBG;
                                                                statusTextColor = Colors.colors.mediumContrast;
                                                            }
                                                            return (
                                                                <CommonAppointmentBox
                                                                    key={appointment.appointmentId}
                                                                    appointment={appointment}
                                                                    onPress={() => {
                                                                        this.props.showAppointmentDetails(appointment);
                                                                    }}
                                                                    apptStatus={statusToggle}
                                                                    apptStatusText={apptStatusText}
                                                                    apptStatusBg={apptStatusBg}
                                                                    onChange={() => {
                                                                        this.props.showAppointmentDetails(appointment);
                                                                    }}
                                                                    onConfirm={() => {
                                                                        this.props.confirmAppointment(appointment);
                                                                    }}
                                                                    statusTextColor={statusTextColor}
                                                                    today={appointment.status === 'BOOKED' && moment().isSame(moment(appointment.startTime), 'days') && !isMissed(appointment)}
                                                                    rating={appointment.feedback && appointment.feedback.rating}
                                                                    confirmed={activeSegmentId === 'current' && appointment.status === 'BOOKED' && !isMissed(appointment)}
                                                                    buttonOptions={activeSegmentId === 'pending'}
                                                                    profile = {this.props?.profile}
                                                                    isProviderApp = {this.props?.isProviderApp}
                                                                    connections={this.props.connections}
                                                                />)
                                                        }}/>
                                            }
                                        </>

                                }

                            </View>
                        )
                    }
                </View>



                <SearchFloatingButton
                    icon="plus"
                    onPress={this.props.startBookingFlow}
                    isFiltering={false}
                />
            </Container>
        );
    };
}


const styles = StyleSheet.create({
    header: {
        // backgroundColor: "#fff",
        paddingTop: 15,
        paddingLeft: 24,
        paddingRight: 18,
        elevation: 0,
        height: HEADER_SIZE,
    },
    bookActionList: {},
    singleAction: {
        marginBottom: 16,
    },
    emptyView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    emptyAnim: {
        width: '90%',
        // alignSelf: 'center',
        marginBottom: 30,
    },
    emptyTextMain: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.highContrast,
        alignSelf: 'center',
        marginBottom: 8
    },
    emptyTextDes: {
        alignSelf: 'center',
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: 'center',
        marginBottom: 32
    },
    bookBtn: {
        maxWidth: 240,
        alignSelf: 'center'
    },
});
