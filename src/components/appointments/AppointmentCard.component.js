import React, {Component} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {Button, Text, View} from 'native-base';
import AntIcon from 'react-native-vector-icons/AntDesign';
import AwesomeIcons from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import {DEFAULT_AVATAR_COLOR } from "../../constants";
import {addTestID, getTimeDifference, isTimeElapsed} from '../../utilities';
import LinearGradient from 'react-native-linear-gradient';
import {Rating} from 'react-native-elements';


export class AppointmentsCardComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            appointment: this.props.appointment,
        };
    }

    componentDidMount(): void {
        if (this.state.appointment.status === 'BOOKED') {
            this.iv = setInterval(() => {
                this.setState({
                    ...this.state,
                });
            }, 1000);
        }
    }

    shouldComponentUpdate(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean {
        return !(nextProps.appointment.appointmentId === this.props.appointment.appointmentId
            && nextProps.appointment.status === this.props.appointment.status && nextProps.appointment.status !== 'BOOKED');

    }

    componentWillUnmount(): void {
        if (this.iv) {
            clearInterval(this.iv);
            this.iv = null;
        }
    }

    getBorderColorByStatus = (status) => {
        switch (status) {
            case 'NEEDS_ACTION':
                return '#0092f1';
            case 'PROPOSED':
                return '#0092f1';
            case 'CANCELLED':
                return '#BFC7BD';
            case 'FULFILLED':
                return '#ffca00';
            default:
                return '#77c70b';
        }
    };


    isMissed = (appt) => {
        return moment(appt.endTime).diff(moment(), 'minutes') < 0;
    };

    render() {
        const appt = this.state.appointment;
        const timeDifference = getTimeDifference(appt.startTime);
        return (
            <TouchableOpacity
                {...addTestID('Appointment-card-'+(this.props.index))}
                key={appt.appointmentId + 'touchable'}
                              onPress={() => {
                                  this.props.showDetails(appt);
                              }}>
                <View key={appt.appointmentId + '-v'}

                      style={[styles.singleAppt, {borderLeftColor: this.getBorderColorByStatus(appt.status)}]}>
                    <View style={styles.leftSide}>
                        <Text style={styles.pdate}>{appt.date}</Text>
                        <Text style={styles.pmonth}>{appt.month}</Text>
                        {appt.status !== 'FULFILLED' && appt.status !== 'CANCELLED' && (
                            <View style={styles.timeBox}>
                                <Text style={styles.ptime}>{appt.startText}</Text>
                                <AntIcon
                                    style={styles.arrow}
                                    name="arrowdown" color="#b3bec9" size={20}/>
                                <Text style={styles.ptime}>{appt.endText}</Text>
                            </View>
                        )}

                    </View>
                    <View style={styles.rightSide}>
                        <View style={styles.topRow}>
                            {appt.avatar?
                                <Image
                                    {...addTestID('profile-image')}
                                    style={styles.proImage}
                                    resizeMode="cover"
                                    source={{uri: appt.avatar}}/>
                                :
                                <View style={{
                                    ...styles.proBgMain,
                                    backgroundColor: appt.colorCode?appt.colorCode:DEFAULT_AVATAR_COLOR
                                }}><Text
                                    {...addTestID('participantName - ' + appt.participantName)}
                                    style={styles.proLetterMain}>{appt.participantName.charAt(0).toUpperCase()}</Text></View>
                            }
                            <View style={styles.proDetails}>
                                <Text style={styles.proName} numberOfLines={1}>{appt.participantName}</Text>
                                <Text style={styles.proDes} numberOfLines={2}>{appt.serviceName}</Text>
                            </View>
                        </View>
                        <View style={styles.btnRow}>
                            {(appt.status === 'NEEDS_ACTION') && (
                                <LinearGradient
                                    start={{x: 0, y: 1}}
                                    end={{x: 1, y: 0}}
                                    colors={['#4FACFE', '#34b6fe', '#00C8FE']}
                                    style={styles.confirmBtn}
                                >
                                    <Button
                                        {...addTestID('appointment-details')}
                                        transparent onPress={() => {
                                        this.props.showDetails(appt);
                                    }}
                                            style={{flex: 1}}>
                                        <Text
                                            style={styles.sessionText}>Confirm Appointment</Text>
                                    </Button>
                                </LinearGradient>
                            )}
                            {appt.status === 'BOOKED' && isTimeElapsed(appt.startTime) && !this.isMissed(appt) && (
                                <Button
                                    {...addTestID('Start-session')}
                                    onPress={() => {this.props.showDetails(appt)}} style={styles.sessionBtn}>
                                    <Text style={styles.sessionText}>Start Session</Text>
                                </Button>
                            )}
                            {appt.status === 'BOOKED' && this.isMissed(appt) && (
                                <View style={{...styles.awaitingBtn, backgroundColor: 'rgba(0,0,0,0.05)'}}
                                      disabled={true}>
                                    <Text style={{...styles.awaitingText, color: 'rgba(12,9,10,0.59)'}}>You missed
                                        it</Text>
                                </View>
                            )}
                            {appt.status === 'BOOKED' && !isTimeElapsed(appt.startTime) && (
                                <View style={styles.completedInfo}>
                                    <Button
                                        transparent
                                        onPress={() => {!appt.addedInCalendar ? this.props.addToCalendar(appt) : null}} style={styles.calendarIcon}>
                                        <AwesomeIcons
                                            style={styles.calIco}
                                            name={!appt.addedInCalendar ? "calendar-plus-o" : "calendar-check-o"} color="#77c70b" size={25}/>
                                    </Button>
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
                            {appt.status === 'PROPOSED' && (
                                <View style={{...styles.awaitingBtn, backgroundColor: 'rgba(0,146,241,0.05)'}}
                                      disabled={true}>
                                    <Text style={{...styles.awaitingText, color: '#0092f1'}}>Awaiting
                                        Confirmation</Text>
                                </View>
                            )}
                            {appt.status === 'CANCELLED' && (
                                <View style={{...styles.awaitingBtn, backgroundColor: 'rgba(100,108,115,0.05)'}}
                                      disabled={true}>
                                    <Text style={{...styles.awaitingText, color: '#646c73'}}>Cancelled</Text>
                                </View>
                            )}
                            {appt.status === 'FULFILLED'
                            && (
                                <View style={{margin: 12, flexDirection: 'row', justifyContent: 'center'}}>
                                    <Rating
                                        readonly
                                        type='star'
                                        showRating={false}
                                        ratingCount={5}
                                        imageSize={22}
                                        selectedColor='#ffca00'
                                        startingValue={appt.feedback && appt.feedback.rating ? appt.feedback.rating : 0}
                                        fractions={2}
                                    />
                                    {appt.feedback && appt.feedback.rating && (
                                        <Text style={{marginTop: 2, marginLeft: 10}}>
                                            {appt.feedback.rating}
                                        </Text>)}
                                </View>

                            )}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>

        );
    }
}

const styles = StyleSheet.create({
    singleAppt: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 3,
        overflow: 'hidden',
        borderLeftWidth: 4,
        borderTopLeftRadius: 3,
        borderBottomLeftRadius: 3,
        borderLeftColor: '#77c70b',
        borderBottomColor: '#fff',
        borderTopColor: '#fff',
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 5,
            height: 5,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 3,
    },
    leftSide: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        padding: 16,
        borderRightWidth: 1,
        borderRightColor: '#f5f5f5',
    },
    pdate: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        letterSpacing: 0,
        lineHeight: 20,
        color: '#25345c',
        marginBottom: 9,
    },
    pmonth: {
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 12,
        letterSpacing: 0.5,
        lineHeight: 13,
        color: '#969fa8',
        marginBottom: 16,
    },
    ptime: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        letterSpacing: 0,
        lineHeight: 15,
        color: '#515d7d',
    },
    arrow: {
        marginTop: 8,
        marginBottom: 8,
    },
    timeBox: {
        alignItems: 'center',
    },
    rightSide: {
        flex: 1,
    },
    topRow: {
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        flexDirection: 'row',
        flex: 1,
        padding: 16,
    },
    proImage: {
        width: 48,
        height: 48,
        borderRadius: 25,
        overflow: 'hidden',
    },
    proDetails: {
        justifyContent: 'center',
        paddingLeft: 16,
        flex: 1,
    },
    proName: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.3,
        marginBottom: 8,
    },
    proDes: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 13,
        letterSpacing: 0.3,
    },
    btnRow: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        flex: 1,
    },
    completedInfo: {
        flexDirection: 'row',
        height: 24,
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
    sessionBtn: {
        backgroundColor: '#77c70b',
        height: 40,
        borderRadius: 4,
        minWidth: 195,
        justifyContent: 'center',
    },
    calendarIcon: {
        height: 40,
        justifyContent: 'flex-start',
        paddingTop: 0
    },
    calIco: {
        marginTop: -8,
        marginRight: 5
    },
    confirmBtn: {
        height: 40,
        borderRadius: 4,
        minWidth: 195,
        justifyContent: 'center',
        alignItems: 'center',
    },
    awaitingBtn: {
        backgroundColor: 'rgba(59,207,255,0.65)',
        height: 40,
        borderRadius: 24,
        minWidth: 195,
        justifyContent: 'center',
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
    awaitingText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 13,
        letterSpacing: 0.7,
        color: '#fff',
        alignSelf: 'center',
    },
    proBgMain:{
        width: 48,
        height: 48,
        borderRadius: 25,
        //borderColor: '#3A86DA',
        //borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
});

