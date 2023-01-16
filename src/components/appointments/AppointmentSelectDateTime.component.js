import React, {Component} from 'react';
import {StatusBar, StyleSheet, TouchableOpacity, View, Image, ScrollView} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';
import { isIphoneX, AlertUtil, addTestID} from '../../utilities';
import GradientButton from '../../components/GradientButton';
import LinearGradient from 'react-native-linear-gradient';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {ContentLoader} from '../ContentLoader';
import momentTimeZone from 'moment-timezone';
import ViewPager from '@react-native-community/viewpager';

export class AppointmentSelectDateTimeComponent extends Component<Props> {
    constructor(props) {
        super(props);
        this.currentMoment = moment();
        this.currentDayOfMonth = this.currentMoment.format('DD');
        this.currentMonth = this.currentMoment.month();
        this.currentYear = parseInt(this.currentMoment.format('Y'));
        this.state = {
            isLoading: false,
            index: 1,
            selectDate: false,
            selectedDate: this.currentDayOfMonth,
            selectSlot: false,
            selectedMonth: this.currentMonth,
            totalSlots: 3,
            slots: [],
            currentViewPage: 0,
        };
    }

    componentDidMount = () => {
        this.getAvailableSlots();
    };


    getDaysInMonth = (month, year) => {
        const date = new Date(year, month, 1);

        const days = [];
        while (date.getMonth() === month) {
            const _moment = moment(new Date(date));
            const dateValue = _moment.format('DD');
            let dayToShow = true;
            if (month === this.currentMonth) {
                if (parseInt(dateValue) < parseInt(this.currentDayOfMonth)) {
                    dayToShow = false;
                }
            }
            if (dayToShow) {
                days.push({
                    date: dateValue,
                    day: _moment.format('ddd'),
                });
            }

            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    isDateSelected = (date) => {
        if (this.state.selectedDate === null) {
            return false;
        }
        return parseInt(this.state.selectedDate) === parseInt(date);
    };

    isDateToday = (date) => {
        return this.state.selectedMonth === this.currentMonth && parseInt(date) === parseInt(this.currentDayOfMonth);
    };

    selectDay = (date) => {
        if (this.state.selectedDate !== date) {
            this.setState({selectedDate: date, selectedSlot: null}, () => {
                this.getAvailableSlots();
            });
        }
    };

    renderDays = () => {
        const daysOfMonth = this.getDaysInMonth(this.state.selectedMonth, this.currentYear);
        const days = daysOfMonth.map((data,index) => {
            return (
                <TouchableOpacity
                    {...addTestID('Select-'+(index+1))}
                    key={this.state.selectedMonth + data.date + data.day}
                    style={this.isDateSelected(data.date) ? [styles.singleday, {borderColor: '#3fb2fe'}] : styles.singleday}
                    onPress={() => {
                        this.selectDay(data.date);
                    }}
                >
                    <Text style={styles.dateText}>{data.date}</Text>
                    <Text style={styles.dayText}>{this.isDateToday(data.date) ? 'Today' : data.day}</Text>
                    {

                        this.isDateSelected(data.date) ?
                            <View style={styles.checkWrapper}>
                                <Ionicon name="ios-checkmark-circle" size={25} color="#3fb2fe"/>
                            </View> : null
                    }
                </TouchableOpacity>
            );

        });

        return (
            <View style={styles.dayScroll}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {days}
                </ScrollView>
            </View>
        );
    };

    getSelectedMonth = () => {
        let month = this.state.selectedMonth + 1;
        if (month < 10) {
            return '0' + month;
        } else {
            return month;
        }

    };


    getAvailableSlots = async () => {
        this.setState({isLoading: true});
        const tz = this.props.appointments.timezone ? this.props.appointments.timezone : momentTimeZone.tz.guess(true);
        const date = this.state.selectedDate + '-' + this.getSelectedMonth() + '-' + this.currentYear;
        let response = await this.props.getAvailableSlots(this.props.originalAppointment ? this.props.originalAppointment.participantId : (this.props.isMemberApp ? this.props.selectedMember.userId : this.props.selectedMember.connectionId),
            this.props.selectedService.id, date, tz);

        if (response.errors) {
            AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
            this.setState({isLoading: false, slots: []});
        } else {
            const hasSlots = response.length > 0;
            if (this.isDateToday(this.state.selectedDate)) {
                response = response.filter(slot => {
                    const now = parseInt(momentTimeZone().tz(tz).format('HHmm'));
                    return now < slot.start;
                });
            }
            console.log(response);
            const state = {isLoading: false, slots: response};
            if (!hasSlots) {
                state.selectedSlot = null;
            }
            this.setState(state);
        }
    };

    slotSelected = (slot) => {
        this.setState({selectedSlot: slot});
    };


    getTimeFromMilitaryStamp = (stamp) => {
        const stringStamp = (stamp + '');
        if (stringStamp.length === 1) {
            return {
                time: '12:0' + stringStamp,
                amPm: 'AM',
            };
        } else if (stringStamp.length === 2) {
            return {
                time: '12:' + stringStamp,
                amPm: 'AM',
            };
        } else if (stringStamp.length === 3) {
            let hr = stringStamp.substr(0, 1);
            let min = stringStamp.substr(1);
            return {
                time: '0' + hr + ':' + min,
                amPm: 'AM',
            };
        } else {
            let hr = stringStamp.substr(0, 2);
            let min = stringStamp.substr(2);
            let amPM = 'AM';
            if (parseInt(hr) >= 12) {
                if (hr > 12) {
                    hr = parseInt(hr) - 12;
                    if (hr < 10) {
                        hr = '0' + hr;
                    }
                }
                amPM = 'PM';
            }
            return {
                time: hr + ':' + min,
                amPm: amPM,
            };
        }

    };

    reviewAppointment = () => {
        const dateObject = new Date(this.currentYear, parseInt(this.getSelectedMonth()) - 1, this.state.selectedDate);
        const _moment = moment(dateObject);
        const selectedSchedule = {
            day: this.state.selectedDate,
            dateDesc: _moment.format('dddd') + ', ' + this.state.selectedDate + ' ' + _moment.format('MMMM') + ' ' + this.currentYear,
            dayDateText: _moment.format('MMMM') + ' ' + this.state.selectedDate,
            slotStartTime: this.getTimeFromMilitaryStamp(this.state.selectedSlot.start),
            slotEndTime: this.getTimeFromMilitaryStamp(this.state.selectedSlot.end),
            month: this.getSelectedMonth(),
            year: this.currentYear,
            slot: this.state.selectedSlot,
        };
        const updateCallback = this.props.updateAppointment;
        if (updateCallback) {
            updateCallback({
                ...this.props.originalAppointment,
                serviceId: this.props.selectedService.id,
                serviceName: this.props.selectedService.name,
                serviceDuration: this.props.selectedService.duration,
                serviceCost: this.props.selectedService.cost,
                recommendedCost: this.props.selectedService.recommendedCost,
                marketCost: this.props.selectedService.marketCost,
                isChanged: true,
                selectedSchedule,
            });
        }
        if (this.props.selectedMember) {
            this.props.navigateToRequestApptConfirmDetailsScreen(this.props.selectedService, selectedSchedule, this.props.selectedMember);
        } else {
            this.props.navigateToAppointmentDetailsScreen(this.props.originalAppointment,
                {
                    ...this.props.originalAppointment,
                    serviceId: this.props.selectedService.id,
                    serviceName: this.props.selectedService.name,
                    serviceDuration: this.props.selectedService.duration,
                    serviceCost: this.props.selectedService.cost,
                    recommendedCost: this.props.selectedService.recommendedCost,
                    marketCost: this.props.selectedService.marketCost
                },
                this.props.selectedService,
                selectedSchedule,
                this.props.selectedMember,
            );
        }
    };

    renderMonthCarousal = () => {
        const monthViews = [];
        for (let i = this.currentMonth; i < moment.months().length; i++) {
            monthViews.push(
                <View style={styles.monthslide} key={'month-' + i}>
                    <Text style={styles.monthText}>{moment.months(i)}</Text></View>,
            );
        }
        return (
            <View style={styles.monthWrapper}>

                <Button
                    {...addTestID('Select-month')}
                    transparent
                    disabled={this.state.selectedMonth === this.currentMonth}
                    // style={{padding: 5}}
                    onPress={() => {
                        this._carousel.setPage(this.state.currentViewPage - 1);
                    }}
                >
                    <Ionicon name="md-arrow-round-back" size={28}
                             color={this.state.selectedMonth === this.currentMonth ? '#acacac' : '#3fb2fe'}/>
                </Button>
                <ViewPager
                    ref={ref => (this._carousel = ref)}
                    style={{flex: 1, height: 18}}
                    initialPage={0}
                    scrollEnabled={false}
                    onPageSelected={({nativeEvent}) => {
                        const {position} = nativeEvent;

                        if ((position + this.currentMonth) !== this.state.selectedMonth) {
                            this.setState({
                                selectedMonth: position + this.currentMonth,
                                selectedDate: null,
                                slots: [],
                                currentViewPage: position,
                                selectedSlot: null,
                            });
                        }
                    }}
                    orientation={'horizontal'}>
                    {monthViews}
                </ViewPager>

                <Button
                    {...addTestID('selected-month')}
                    transparent
                    disabled={this.state.selectedMonth === 11}
                    // style={{padding: 5}}
                    onPress={() => {
                        console.log({selectedMonth: this.state.selectedMonth});
                        this._carousel.setPage(this.state.currentViewPage + 1);
                    }}
                >
                    <Ionicon name="md-arrow-round-forward" size={28}
                             color={this.state.selectedMonth === 11 ? '#acacac' : '#3fb2fe'}/>
                </Button>


            </View>
        );
    };

    renderSlots = () => {
        const availableSlots = this.state.slots.map((slot, i, index) => {
            const startTime = this.getTimeFromMilitaryStamp(slot.start);
            const endTime = this.getTimeFromMilitaryStamp(slot.end);
            return (
                <TouchableOpacity
                    {...addTestID('slot-selected-'+(i+1))}
                    key={'slot-' + i}
                    onPress={() => {
                        this.slotSelected(slot);
                    }}
                    style={this.state.slots.length < 4 ?
                        (this.state.slots.length < 3 ?
                            this.state.selectedSlot === slot ?
                                {...styles.singleSlotSelected, width: '100%', height: 100} : {
                                    ...styles.singleSlot,
                                    width: '100%',
                                    height: 100,
                                } :
                            this.state.selectedSlot === slot ? {
                                ...styles.singleSlotSelected,
                                width: '100%',
                            } : {...styles.singleSlot, width: '100%'}) :
                        this.state.selectedSlot === slot ? styles.singleSlotSelected : styles.singleSlot}

                >
                    <View style={styles.slotLeft}>
                        <Text style={styles.sTimeText}>{startTime.time}</Text>
                        <Text style={styles.AmPm}>{startTime.amPm}</Text>
                    </View>
                    <AwesomeIcon
                        style={styles.slotIcon}
                        name="arrow-circle-right" size={20}
                        color={this.state.selectedSlot === slot ? '#3fb2fe' : '#b3bec9'}/>
                    <View style={styles.slotRight}>
                        <Text style={styles.sTimeText}>{endTime.time}</Text>
                        <Text style={styles.AmPm}>{endTime.amPm}</Text>
                    </View>
                </TouchableOpacity>
            );

        });
        return (
            <View style={styles.slotWrapper}>
                {this.state.isLoading ? (<ContentLoader numItems={6}/>) : (
                    <View>
                        {this.state.selectedDate && (
                            <Text style={styles.slotHeading}>{availableSlots.length} Time Slots Available</Text>)}
                        <View style={styles.slotList}>
                            {availableSlots.length === 0 ?
                                <View style={styles.emptySlot}>
                                    <Text
                                        style={styles.noSlotText}>{this.state.selectedDate ? 'No time slot available for this day.Try to select another day.' : 'Please pick a date from the list'}</Text>
                                    <Image
                                        {...addTestID('empty-slot-png')}
                                        style={styles.noSlotImg}
                                        resizeMode="contain"
                                        source={require('../../assets/images/emptySlot.png')}/>
                                </View> :
                                availableSlots
                            }
                        </View>
                    </View>

                )}
            </View>
        );
    };

    render() {
        return (
            <Container>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={['#fff', '#FFF', '#f7f9ff']}
                    style={{flex: 1}}
                >
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                            translucent
                            barStyle={'dark-content'}
                        />
                        <Left>
                            <Button
                                {...addTestID('back')}
                                transparent
                                style={styles.backBtn}
                                onPress={this.props.backClicked}>
                                <Icon
                                    name="angle-left"
                                    type={'FontAwesome'}
                                    style={styles.backIcon}
                                />
                            </Button>
                        </Left>
                        <Right/>
                    </Header>
                    <Content>
                        <Text
                            {...addTestID('request-appointment')}
                            style={styles.apptHeading}>Request Appointment</Text>
                        <Text
                            {...addTestID('select-date-&-time')}
                            style={styles.proText}>Select Date & Time</Text>
                        <View style={styles.monthDate}>
                            {this.renderMonthCarousal()}
                            {this.renderDays()}
                            {this.renderSlots()}
                        </View>
                    </Content>
                    <View style={styles.nextBtn}>
                        {
                            this.state.selectedSlot ?
                                <GradientButton
                                    testId = "next"
                                    text="Next"
                                    onPress={() => {
                                        this.reviewAppointment();
                                    }}
                                /> : null
                        }
                    </View>
                </LinearGradient>
            </Container>


        );

    }
}


const styles = StyleSheet.create({
    header: {
        paddingTop: 35,
        paddingLeft: 18,
        paddingRight: 18,
    },
    stepperText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Bold',
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 1,
        lineHeight: 12,
    },
    backBtn: {},
    backIcon: {
        color: '#3fb2fe',
        fontSize: 30,
    },
    apptHeading: {
        marginTop: 30,
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        textAlign: 'center',
        lineHeight: 24,
        letterSpacing: 1,
        marginBottom: 16,
    },
    proText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        letterSpacing: 0.8,
        lineHeight: 18,
        textAlign: 'center',
        marginBottom: 20,
    },
    monthDate: {
        // paddingLeft: 19,
        // paddingRight: 19
    },
    monthWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 17,
        paddingRight: 17,
        marginBottom: 20,
    },
    monthslide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthText: {
        color: '#25345c',
        fontSize: 16,
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        lineHeight: 18,
        letterSpacing: 0.5,
    },
    dayScroll: {
        paddingLeft: 16,
    },
    singleday: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.07)',
        borderRadius: 8,
        marginBottom: 16,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        width: 80,
        height: 108,
    },
    dayText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 19,
        letterSpacing: 0.28,
    },
    dateText: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 18,
        lineHeight: 20,
        letterSpacing: 0.39,
        marginBottom: 4,
    },
    slotWrapper: {
        paddingTop: 16,
        paddingLeft: 24,
        paddingRight: 24,
    },
    slotHeading: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 14,
        letterSpacing: 0.5,
        textAlign: 'center',
        fontWeight: '600',
        marginBottom: 10,
    },
    slots: {},
    slotList: {
        paddingTop: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    singleSlot: {
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 10,
        shadowOpacity: 0.8,
        elevation: 0,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 5,
        height: 65,
        width: 145,
    },
    singleSlotSelected: {
        borderWidth: 1,
        borderColor: '#3fb2fe',
        borderRadius: 8,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        margin: 5,
        width: 145,
        height: 65,
    },
    slotLeft: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        borderRightColor: 'rgba(0,0,0,0.07)',
        borderRightWidth: 1,
        height: '100%',
    },
    slotIcon: {
        position: 'absolute',
        left: '50%',
        marginLeft: -10,
    },
    slotRight: {
        alignItems: 'center',
        flex: 1,
    },
    sTimeText: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        letterSpacing: 0.32,
        marginBottom: 4,
    },
    AmPm: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 11,
        letterSpacing: 0.24,
        lineHeight: 11,
        textTransform: 'uppercase',
    },
    emptySlot: {
        paddingRight: 45,
        paddingLeft: 45,
        alignItems: 'center',
    },
    noSlotText: {
        color: '#646c73',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 20,
        letterSpacing: 0,
        textAlign: 'center',
    },
    noSlotImg: {
        width: '100%',
    },
    checkWrapper: {
        marginTop: 10,
        alignItems: 'center',
    },
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24,
    },
});



