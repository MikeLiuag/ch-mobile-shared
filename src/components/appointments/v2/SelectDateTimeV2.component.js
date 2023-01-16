import React, {Component} from 'react';
import {Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import momentTimeZone from 'moment-timezone';
import Modal from 'react-native-modalbox';
import {Picker} from 'react-native-wheel-pick';
import {addTestID, AlertUtil, getDSTOffset, getHeaderHeight, isIphoneX} from '../../../utilities';
import {BackButton} from '../../BackButton';
import {Colors, CommonStyles, TextStyles} from '../../../styles';
import {PrimaryButton} from '../../PrimaryButton';
import {ToggleSwitch} from '../../ToggleSwitch';
import {ContentLoader} from '../../ContentLoader';
import {TIME_KEY_VALUE, TIME_PICKER} from '../../../constants';
import Loader from '../../Loader';

const isIos = Platform.OS === 'ios';

const HEADER_SIZE = getHeaderHeight();

export class SelectDateTimeV2Component extends Component<Props> {
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
            selectedYear: this.currentYear,
            slots: [],
            currentViewPage: 0,
            openFilterModal: false,
            selectedDays: [],
            startTime: '01',
            endTime: '23',
            timeSpan : 0,
            providerSchedule: [],
            filterApplied: false,
        };
    }

    componentDidMount = () => {
        this.getMasterSchedule()
    };

    /**
     * @function getDaysInMonth
     * @description This method is used to get days in month.
     */
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
                    date: dateValue, day: _moment.format('ddd'),
                });
            }

            date.setDate(date.getDate() + 1);
        }
        return days;
    };

    /**
     * @function isDateSelected
     * @description This method is used to check selecetd Date.
     */
    isDateSelected = (date) => {
        if (this.state.selectedDate === null) {
            return false;
        }
        return parseInt(this.state.selectedDate) === parseInt(date);
    };

    /**
     * @function isDateToday
     * @description This method is used to check current date & selected Date.
     */
    isDateToday = (date) => {
        return this.state.selectedMonth === this.currentMonth && parseInt(date) === parseInt(this.currentDayOfMonth);
    };

    /**
     * @function onStartTimeItemSelected
     * @description This method is used to set startTime.
     */
    onStartTimeItemSelected = (selectedValue) => {
        this.setState({startTime: selectedValue});
    };

    /**
     * @function onEndTimeItemSelected
     * @description This method is used to set end time
     */
    onEndTimeItemSelected = selectedValue => {
        this.setState({endTime: selectedValue});
    };

    /**
     * @function closeFilterModal
     * @description This method is used to close filter modal.
     */
    closeFilterModal = () => {
        let callBack = this.applyFilters;
        if (this.state.selectedDays.length === 0) {
            callBack = this.clearFilters;
        }
        this.setState({
            openFilterModal: false,
        }, callBack);
    };

    /**
     * @function dayToggleSwitchHandler
     * @description This method is used to update toggle value of day.
     */
    dayToggleSwitchHandler = (day) => {
        let {selectedDays, startTime, endTime} = this.state;
        if (selectedDays.some((selectedDay) => selectedDay === day)) {
            let index = selectedDays.indexOf(day);
            selectedDays.splice(index, 1);
        } else {
            selectedDays.push(day);
        }
        this.setState({selectedDays: selectedDays});
    };

    /**
     * @function applyFilters
     * @description This method is used to apply filters.
     */
    applyFilters = () => {
        if (this.state.selectedDays.length > 0) {
            this.setState({openFilterModal: false, filterApplied: true},()=>{
                this.getMasterSchedule();
            });
        }
    };

    /**
     * @function clearFilters
     * @description This method is used to clear filters.
     */
    clearFilters = () => {
        this.setState({
            providerSchedule: [],
            selectedDays: [],
            selectedSlot: null,
            selectedDate: this.currentDayOfMonth,
            openFilterModal: false,
            filterApplied: false,
            startTime: 0,
            endTime: 0,
        }, this.getMasterSchedule);
    };

    /**
     * @function renderBottomModal
     * @description This method is used to render bottom modal.
     */
    renderBottomModal = () => {
        return (<View style={styles.greBtn}>
            <PrimaryButton
                color={Colors.colors.whiteColor}
                onPress={() => {
                    this.reviewAppointment();
                }}
                text="Continue"
            />

        </View>);
    };

    /**
     * @function getSelectedTime
     * @description This method is used to get selected time value.
     */
    getSelectedTime = (value) => {
        let time = TIME_KEY_VALUE.find(time => time.key === value);
        return time?.value;
    };

    /**
     * @function getSelectedMonth
     * @description This method is used to get selected month.
     */
    getSelectedMonth = () => {
        let month = this.state.selectedMonth + 1;
        if (month < 10) {
            return '0' + month;
        } else {
            return month;
        }
    };

    /**
     * @function getAvailableSlots
     * @description This method is used to get available slots
     */
    getAvailableSlots = async () => {
        this.setState({isLoading: true});
        const tz = this.props.appointments.timezone ? this.props.appointments.timezone : momentTimeZone.tz.guess(true);
        const date = this.state.selectedDate + '-' + this.getSelectedMonth() + '-' + this.state.selectedYear;
        let response = await this.props.getAvailableSlots(this.props.originalAppointment ? this.props.originalAppointment.participantId : (this.props.isMemberApp ? this.props.selectedMember.userId : this.props.selectedMember.connectionId), this.props.selectedService.id, date, tz);
        if (response.errors) {
            AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
            this.setState({isLoading: false, slots: []});
        } else {
            const hasSlots = response.length > 0;
            if (this.isDateToday(this.state.selectedDate)) {
                response = response.filter(slot => {
                    const dstOffset = getDSTOffset();
                    const now = parseInt(momentTimeZone().tz(tz).utcOffset(dstOffset).format('HHmm'));
                    return now < moment(slot.start).utcOffset(dstOffset).format('HHmm');
                });
            }
            const state = {isLoading: false, slots: response};
            if (!hasSlots) {
                state.selectedSlot = null;
            }
            this.setState(state);
        }
    };


    /**
     * @function slotSelected
     * @description This method is used to set selected slot.
     */
    slotSelected = (slot) => {
        this.setState({selectedSlot: slot});
    };

    /**
     * @function getTimeFromMilitaryStamp
     * @description This method is used to get time from military stamp.
     */
    getTimeFromMilitaryStamp = (stamp) => {
        const stringStamp = (stamp + '');
        if (stringStamp.length === 1) {
            return {
                time: '12:0' + stringStamp, amPm: 'AM',
            };
        } else if (stringStamp.length === 2) {
            return {
                time: '12:' + stringStamp, amPm: 'AM',
            };
        } else if (stringStamp.length === 3) {
            let hr = stringStamp.substr(0, 1);
            let min = stringStamp.substr(1);
            return {
                time: '0' + hr + ':' + min, amPm: 'AM',
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
                time: hr + ':' + min, amPm: amPM,
            };
        }
    };

    /**
     * @function reviewAppointment
     * @description This method is used to review appointment.
     */
    reviewAppointment = () => {
        const dateObject = new Date(this.state.selectedYear, parseInt(this.getSelectedMonth()) - 1, this.state.selectedDate);
        const _moment = moment(dateObject);
        const selectedSchedule = {
            day: this.state.selectedDate,
            dateDesc: _moment.format('dddd') + ', ' + this.state.selectedDate + ' ' + _moment.format('MMMM') + ' ' + this.state.selectedYear,
            dayDateText: _moment.format('MMMM') + ' ' + this.state.selectedDate,
            slotStartTime: this.getTimeFromMilitaryStamp(this.state.selectedSlot.start),
            slotEndTime: this.getTimeFromMilitaryStamp(this.state.selectedSlot.end),
            month: this.getSelectedMonth(),
            year: this.state.selectedYear,
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
            this.props.navigateToAppointmentDetailsScreen(this.props.originalAppointment, {
                ...this.props.originalAppointment,
                serviceId: this.props.selectedService.id,
                serviceName: this.props.selectedService.name,
                serviceDuration: this.props.selectedService.duration,
                serviceCost: this.props.selectedService.cost,
                recommendedCost: this.props.selectedService.recommendedCost,
                marketCost: this.props.selectedService.marketCost,
            }, this.props.selectedService, selectedSchedule, this.props.selectedMember,);
        }
    };

    /**
     * @function selectDay
     * @description This method is used to get slots based on selected day.
     */
    selectDay = (date) => {
        if (this.state.selectedDate !== date) {
            this.setState({selectedDate: date, selectedSlot: null}, () => {
                if (this.state.providerSchedule.length > 0) {
                    this.getMasterScheduleSlots();
                } else {
                    this.getAvailableSlots();
                }
            });
        }
    };


    /**
     * @function renderDays
     * @description This method is used to render days.
     */
    renderDays = () => {
        let daysOfMonth = [];
        const tz = this.props.appointments.timezone ? this.props.appointments.timezone : momentTimeZone.tz.guess(true);
        if (this.state.providerSchedule.length > 0) {
            daysOfMonth = this.state.providerSchedule
                .filter(schedule => {
                    return moment(schedule.scheduleDate, 'DD-MM-yyyy').format('MM') === this.getSelectedMonth().toString();
                },).map(schedule => {
                    const date = moment(schedule.scheduleDate, 'DD-MM-yyyy');
                    let availableSlots = schedule.availableSlots;
                    if (this.isDateToday(schedule.scheduleDate)) {
                        availableSlots = availableSlots.filter(slot => {
                            const now = parseInt(momentTimeZone().tz(tz).format('HHmm'));
                            return now < slot.start;
                        });
                    }
                    return {date: date.format('DD'), day: date.format('ddd'), availableSlots: availableSlots};
                });
        } else if (this.state.providerSchedule.length === 0 && this.state.filterApplied) {
            daysOfMonth = [];
        } else {
            daysOfMonth = this.getDaysInMonth(this.state.selectedMonth, this.state.selectedYear);
        }
        const days = daysOfMonth?.map((data, index) => {
            if(data?.availableSlots) {
                let showDotView = true;
                let isAvailable = data?.availableSlots?.length > 0;
                if(!isAvailable &&  index > 0) {
                    showDotView = daysOfMonth[index - 1]?.availableSlots?.length > 0;
                }
                return (<View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {isAvailable ?
                        <TouchableOpacity
                            {...addTestID('Select-' + (index + 1))}
                            key={this.state.selectedMonth + data.date + data.day}
                            style={this.isDateSelected(data.date) ? [styles.singleday, {borderColor: Colors.colors.mainPink20}] : styles.singleday}
                            onPress={() => {
                                this.selectDay(data.date);
                            }}
                        >
                            <Text style={styles.selectedMonthText}>{data.day}</Text>
                            <Text style={this.isDateSelected(data.date) ? [styles.dateText, {color: Colors.colors.secondaryText}] : styles.dateText}>{data.date}</Text>
                            {!this.props?.modalView && (
                                <Text style={styles.selectedMonthText}>{moment.months(this.state.selectedMonth)}</Text>
                            )}
                            <Text style={styles.totalSlotsText}>{(data?.availableSlots?.length < 1 ? 'No slots' : `${data?.availableSlots?.length} Slot${data?.availableSlots?.length>1?'s':''}`) || ' '}</Text>
                        </TouchableOpacity> : showDotView && (
                        <View style={{
                            height: 12,
                            width: 12,
                            borderRadius: 6,
                            backgroundColor: Colors.colors.swipeBg,
                            marginLeft: 8,
                            marginRight: 8,
                        }}/>)}
                </View>);
            }
        });

        return (
            <View style={styles.dayScroll}>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    {days}
                </ScrollView>
            </View>
        );
    };

    /**
     * @function renderMonthCarousal
     * @description This method is used to render month carousal.
     */
    renderMonthCarousal = () => {
        const {selectedMonth} = this.state;
        const startMonth = this.currentMonth;
        const endMonth = startMonth + 12;
        const monthsList = new Array(12).fill()
            .map((_, index) => startMonth + index)
            .map(month => {
                if (month >= 12) {
                    return {
                        position: month, month: month - 12, year: this.currentYear + 1,
                    };
                } else {
                    return {
                        position: month, month: month, year: this.currentYear,
                    };
                }
            });
        return (<ScrollView  style={{...styles.monthWrapper, marginBottom: this.props?.modalView ? 26 : 42}}
                             horizontal={true}
                             showsHorizontalScrollIndicator={false}>
            {monthsList.map(month => {
                return (<TouchableOpacity onPress={() => {
                    if (this.state.selectedMonth !== month.month) {
                        this.setState({
                            selectedMonth: month.month,
                            selectedYear: month.year,
                            selectedDate: null,
                            slots: [],
                            selectedSlot: null,
                        }, () => {
                            if (this.state.providerSchedule.length > 0) {
                                this.getMasterSchedule();
                            } else {
                                this.getAvailableSlots();
                            }
                        });
                    }
                }} style={styles.monthSlide} key={'month-' + month.month}>
                    <Text style={selectedMonth === month.month ? {
                        ...styles.monthText, color: Colors.colors.mainPink
                    } : styles.monthText}>{moment.months(month.month)}</Text>
                </TouchableOpacity>);
            })}
        </ScrollView>);
    };


    /**
     * @function renderSlots
     * @description This method is used to render slots
     */
    renderSlots = () => {
        const availableSlots = this.state.slots.map((slot, i, index) => {
            const startTime = this.getTimeFromMilitaryStamp(slot.start);
            const endTime = this.getTimeFromMilitaryStamp(slot.end);

            const isSelected = this.state.selectedSlot === slot;
            return (<TouchableOpacity
                {...addTestID('slot-selected-' + (i + 1))}
                key={'slot-' + i}
                onPress={() => {
                    this.slotSelected(slot);
                }}
                style={isSelected && !this.props?.modalView ? {...styles.singleSlot, ...styles.singleSlotSelected, width: '100%'}
                    :isSelected && this.props?.modalView ? { ...styles.singleSlot, ...styles.singleSlotSelectedModal, width: '100%' }
                        :styles.singleSlot
                }>
                <Text style={isSelected && !this.props?.modalView ? [styles.sTimeText, {color: Colors.colors.secondaryText}]
                        : isSelected && this.props?.modalView ? [styles.sTimeText, {color: Colors.colors.primaryText}]
                            : styles.sTimeText}>{startTime.time}{' '}{startTime.amPm}</Text>
                <AwesomeIcon
                    style={styles.slotIcon}
                    name="long-arrow-right" size={20}
                    color={isSelected && !this.props?.modalView ? Colors.colors.secondaryIcon
                        :isSelected && this.props?.modalView ? Colors.colors.primaryIcon
                            : Colors.colors.neutral50Icon}/>
                <Text style={isSelected && !this.props?.modalView ? [styles.sTimeText, {color: Colors.colors.secondaryText}]
                        : isSelected && this.props?.modalView ? [styles.sTimeText, {color: Colors.colors.primaryText}]
                            : styles.sTimeText}>{endTime.time}{' '}{endTime.amPm}</Text>

            </TouchableOpacity>);

        });
        return (<View style={styles.slotWrapper}>
            {this.state.isLoading ? (<ContentLoader type={'slots'} numItems={6}/>) : (<View>

                    {this.state.selectedDate && (
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22}}>

                            <Text style={styles.slotHeading}>{availableSlots.length} slots available</Text>
                            <Text
                                style={styles.slotDate}>{this.state.selectedDate}{' '}{moment.months(this.state.selectedMonth)}{' '}{this.state.selectedYear}</Text>
                        </View>)}
                    <View style={styles.slotList}>
                        {availableSlots.length === 0 ? <View style={styles.emptySlot}>
                            <Text
                                style={styles.noSlotText}>{this.state.selectedDate || this.state.filterApplied ? 'No time slot available for this day.Try to select another day.' : 'Please pick a date from the list'}</Text>
                            <Image
                                {...addTestID('empty-slot-png')}
                                style={styles.noSlotImg}
                                resizeMode="contain"
                                source={require('../../../assets/images/emptySlot.png')}/>
                        </View> : availableSlots}
                    </View>
                </View>

            )}
        </View>);
    };

    /**
     * @function getMasterScheduleSlots
     * @description This method is used to get master schedule slots.
     */
    getMasterScheduleSlots = () => {
        try {
            const tz = this.props?.timezone ? this.props?.timezone : momentTimeZone.tz.guess(true);
            const date = this.state.selectedDate + '-' + this.getSelectedMonth() + '-' + this.state.selectedYear;
            let response = this.state.providerSchedule.filter(schedule => schedule.scheduleDate === date).map(schedule => schedule.availableSlots)[0];
            if (response) {
                const hasSlots = response.length > 0;
                if (this.isDateToday(this.state.selectedDate)) {
                    response = response.filter(slot => {
                        const now = momentTimeZone().tz(tz).format('HHmm');
                        return now < slot.start;
                    });
                }
                const state = {isLoading: false, slots: response};
                if (!hasSlots) {
                    state.selectedSlot = null;
                }
                this.setState(state);
            } else {
                this.setState({slots: [], isLoading: false});
            }
        } catch (e) {
            console.log('error', e);
            this.setState({slots: [], isLoading: false});
        }
    };

    /**
     * @function getMasterSchedule
     * @description This method is used to get master schedule .
     */
    getMasterSchedule = async () => {
        this.setState({isLoading: true});
        const timeZone = this.props?.timezone ? this.props?.timezone : momentTimeZone.tz.guess(true);
        let {selectedDays, startTime, endTime,filterApplied,selectedMonth,selectedYear,timeSpan} = this.state;

        startTime = this.getSelectedTime(startTime);
        endTime = this.getSelectedTime(endTime);

        const providerId = this.props?.isMemberApp ? (this.props?.originalAppointment ? this.props?.originalAppointment?.participantId :
            this.props?.selectedMember?.userId || this.props?.selectedMember?.connectionId ) : this.props?.providerId;

        const memberId = this.props?.isMemberApp ? this.props?.memberId : this.props?.originalAppointment ? this.props?.originalAppointment?.participantId :
            this.props?.selectedMember?.userId  || this.props?.selectedMember?.connectionId ;

        if(filterApplied){
            const endDate = moment().endOf('month');
            const currentDate = moment();
            timeSpan = endDate.diff(currentDate, 'days')
        }
        try {
            let payload = {
                providerId: providerId,
                memberId : memberId,
                serviceId: this.props.selectedService.id,
                selectedDays: filterApplied ? selectedDays : [],
                duration: filterApplied ? this.props.selectedService.duration : 0,
                startTime: filterApplied ? startTime * 100 : 0,
                endTime: filterApplied ? endTime * 100 : 0,
                month: moment().month(selectedMonth).format("MMMM"),
                year: selectedYear,
                monthlySlots: filterApplied ? null : true,
                timeZone: timeZone,
                timeSpan: timeSpan,
            };
            let response = await this.props.getMasterSchedule(payload);
            if (response.errors) {
                AlertUtil.showErrorMessage(response.errors[0].endUserMessage);
                this.setState({isLoading: false, providerSchedule: []});
            } else if (response.masterScheduleItems.length > 0) {

                let masterSchedule = response.masterScheduleItems[0].providerSchedule.map(item => {
                    return {
                        scheduleDate: item.scheduleDate, availableSlots: item.availableServices[0].availableSlots,
                    };
                });
                const date = moment(response.masterScheduleItems[0].firstAvailability, 'DD-MM-yyyy').format('DD');
                this.setState({
                    providerSchedule: masterSchedule, isLoading: false, selectedDate: date,
                }, this.getMasterScheduleSlots);
            } else {
                this.setState({
                    providerSchedule: [], isLoading: false, selectedDate: null, slots: [],
                });
            }
        } catch (e) {
            console.log('Error getting master schedule', e);
            this.setState({
                providerSchedule: [], isLoading: false, selectedDate: null, slots: [],
            });
        }
    };

    render() {
        if (this.state.isLoading && this.state.filterApplied) {
            return <Loader/>;
        }
        return (<Container style={{backgroundColor: this.props?.modalView ? Colors.colors.whiteColor :Colors.colors.screenBG}}>
            {!this.props?.modalView && (
                <Header noShadow={false} transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios' ? null : 'transparent'}
                        translucent
                        barStyle={'dark-content'}
                    />
                    <Left>
                        <View style={styles.backButton}>
                            <BackButton
                                {...addTestID('back')}
                                onPress={this.props.backClicked}
                            />
                        </View>
                    </Left>
                    <Body style={{flex: 2}}>
                        <Title
                            {...addTestID('select-dateTime-appointment')}
                            style={styles.headerText}>Select date & time</Title>
                    </Body>
                    <Right>
                        <Button transparent
                                style={{alignItems: 'flex-end', paddingRight: 7, marginRight: 8}}
                                onPress={() => {
                                    this.setState({openFilterModal: true});
                                }}
                        >
                            <Image style={styles.filterIcon} source={require('../../../assets/images/filter.png')}/>
                        </Button>
                    </Right>
                </Header>
            )}
            <Content showsVerticalScrollIndicator={false}>
                <View style={{...styles.monthDate, padding: this.props?.modalView ? 0 : 24}}>
                    {this.props?.modalView && (
                        <View style={styles.modalTitleWrapper}>
                            <Text style={styles.modalTitleText}>Change Date & Time</Text>
                        </View>
                    )}
                    {this.renderMonthCarousal()}
                    {this.renderDays()}
                    {this.renderSlots()}
                </View>
            </Content>
            <Modal
                backdropPressToClose={true}
                backdropColor={Colors.colors.overlayBg}
                backdropOpacity={1}
                onClosed={this.closeFilterModal}
                style={{...CommonStyles.styles.commonModalWrapper, maxHeight: '80%'}}
                entry={'bottom'}
                position={'bottom'}
                ref={'filterModal'}
                swipeArea={100}
                isOpen={this.state.openFilterModal}
            >
                <View style={{...CommonStyles.styles.commonSwipeBar}}
                      {...addTestID('swipeBar')}
                />
                <Content
                    showsVerticalScrollIndicator={false}>
                    <Text style={styles.timeHeaderText}>
                        Filter by days & time slots
                    </Text>
                    <View style={styles.timeBox}>


                        <Picker
                            style={styles.pickerStyle}
                            textColor={Colors.colors.lowContrast}
                            textSize={34}
                            selectedItemTextColor={Colors.colors.highContrast}
                            itemStyle={pickerItemStyle}
                            selectedValue={this.state.startTime}
                            itemSpace={24}
                            pickerData={TIME_PICKER}
                            onValueChange={this.onStartTimeItemSelected}
                        />


                        {/*<WheelPicker style={POBstyles.customWheel}*/}
                        {/*             isCyclic={true}*/}
                        {/*             hideIndicator={true}*/}
                        {/*             selectedItemTextSize={34}*/}
                        {/*             itemTextSize={34}*/}
                        {/*             itemTextColor={Colors.colors.lowContrast}*/}
                        {/*             selectedItemTextFontFamily={'Manrope-Bold'}*/}
                        {/*             itemTextFontFamily={'Manrope-Bold'}*/}
                        {/*             selectedItemTextColor={Colors.colors.highContrast}*/}
                        {/*             initPosition={this.state.initHour}*/}
                        {/*             data={TIME_PICKER}*/}
                        {/*             onItemSelected={this.onStartTimeItemSelected}/>*/}
                        <View style={styles.iconSection}>
                            <Icon type="FontAwesome" name="long-arrow-right"
                                  style={styles.arrowIcon}/>
                        </View>


                        <Picker
                            style={styles.pickerStyle}
                            textColor={Colors.colors.lowContrast}
                            textSize={34}
                            selectedItemTextColor={Colors.colors.highContrast}
                            selectedValue={this.state.endTime}
                            itemSpace={24}
                            pickerData={TIME_PICKER}
                            onValueChange={this.onEndTimeItemSelected}
                            itemStyle={pickerItemStyle}
                        />


                        {/*<WheelPicker style={POBstyles.customWheel}*/}
                        {/*             isCyclic={true}*/}
                        {/*             hideIndicator={true}*/}
                        {/*             selectedItemTextSize={34}*/}
                        {/*             itemTextSize={34}*/}
                        {/*             selectedItemTextFontFamily={'Manrope-Bold'}*/}
                        {/*             itemTextFontFamily={'Manrope-Bold'}*/}
                        {/*             itemTextColor={Colors.colors.lowContrast}*/}
                        {/*             selectedItemTextColor={Colors.colors.highContrast}*/}
                        {/*             initPosition={14}*/}
                        {/*             data={TIME_PICKER}*/}
                        {/*             onItemSelected={this.onEndTimeItemSelected}/>*/}
                    </View>
                    <View style={styles.dayList}>
                        {moment.weekdays().map((day) => <View style={styles.singleDay}>
                            <Text style={styles.dayText}>{day}</Text>
                            <ToggleSwitch
                                testId={'day-toggle'}
                                switchOn={this.state.selectedDays.some((selectedDay) => selectedDay === day.toUpperCase())}
                                backgroundColorOn={Colors.colors.mainPink}
                                backgroundColorOff={Colors.colors.neutral50Icon}
                                onPress={() => {
                                    this.dayToggleSwitchHandler(day.toUpperCase());
                                }}
                            />
                        </View>,)}
                    </View>
                    <View style={styles.slotBtns}>
                        {/*<View style={{ marginBottom: 16}}>*/}
                        {/*    <PrimaryButton*/}
                        {/*        testId="schedule"*/}
                        {/*        onPress={() => {*/}
                        {/*            this.applyFilters()*/}
                        {/*        }}*/}
                        {/*        text="Apply Filters"*/}
                        {/*    />*/}
                        {/*</View>*/}
                        <PrimaryButton
                            testId="schedule"
                            textColor={Colors.colors.primaryText}
                            bgColor={Colors.colors.primaryColorBG}
                            onPress={() => {
                                this.clearFilters();
                            }}
                            text="Clear Filters"
                        />
                    </View>
                </Content>
            </Modal>
            <View>
                {this.state.selectedSlot && this.renderBottomModal()}
            </View>
        </Container>);

    }
}

const pickerItemStyle = {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    borderTopColor: 'transparent',
    color: Colors.colors.highContrast,
    ...TextStyles.mediaTexts.manropeBold,
    fontSize: 25,
};

const styles = StyleSheet.create({
    modalTitleWrapper:{
        marginBottom:28,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    modalTitleText:{
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.highContrast,
    },
    header: {
        paddingTop: 15,
        paddingLeft: 3,
        paddingRight: 0,
        height: HEADER_SIZE,
        ...CommonStyles.styles.headerShadow,
    },
    backButton: {
        marginLeft: 18,
        width: 40,
    },
    headerRow: {
        flex: 3,
        alignItems: 'center',
    },
    headerText: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH5,
        color: Colors.colors.highContrast,
        textAlign: 'center',
    },
    filterIcon: {
        height: 24,
        width: 24,
        marginRight: 12,
        paddingLeft: 0,
        paddingRight: 0,
    },
    monthDate: {
        padding: 24,
        paddingBottom: isIphoneX() ? 34 : 24,
    },
    monthWrapper: {
        flexDirection: 'row',
        marginBottom: 42,
    },
    monthSlide: {
        marginRight: 32,
    },
    dayScroll: {
        marginBottom: 22,
    },
    singleday: {
        ...CommonStyles.styles.shadowBox,
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0.03)',
        borderRadius: 8,
        marginBottom: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    monthText: {
        ...TextStyles.mediaTexts.manropeExtraBold,
        ...TextStyles.mediaTexts.TextH2,
        color: Colors.colors.mainPink20,
    },
    dateText: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH2,
        color: Colors.colors.highContrast,
    },
    selectedMonthText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.overlineTextS,
        color: Colors.colors.mediumContrast,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    totalSlotsText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast,
    },
    slotWrapper: {},
    slotHeading: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.highContrast,
    },
    slotDate: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lowContrast,
    },
    slots: {},
    slotList: {
        paddingTop: 20,
        paddingBottom: 20,
    },
    singleSlot: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        borderRadius: 8,
        ...CommonStyles.styles.shadowBox,
        marginBottom: 8,
        padding: 24,
        width: '100%',
    },
    singleSlotSelected: {
        borderColor: Colors.colors.mainPink20,
        backgroundColor: Colors.colors.whiteColor,
    },
    singleSlotSelectedModal: {
        borderColor: Colors.colors.mainBlue40,
        backgroundColor: Colors.colors.primaryColorBG,
    },
    slotIcon: {
        marginLeft: 16,
        marginRight: 16,
    },
    sTimeText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.subTextM,
        color: Colors.colors.highContrast,
    },
    emptySlot: {
        paddingRight: 45,
        paddingLeft: 45,
        alignItems: 'center',
    },
    noSlotText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.subTextM,
        color: Colors.colors.highContrast,
        textAlign: 'center',
    },
    noSlotImg: {
        width: '100%',
    },
    greBtn: {
        padding: this.props?.modalView ? 0 : 24,
        paddingBottom: isIphoneX() ? 36 : 24,
        borderTopRightRadius: 12,
        borderTopLeftRadius: 12,
        ...CommonStyles.styles.stickyShadow,
    },
    slotBtns: {
        paddingBottom: isIphoneX() ? 36 : 24,
    },
    timeHeaderText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH3,
        ...TextStyles.mediaTexts.serifProBold,
        marginBottom: 32,
    },
    changeText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeRegular,
        textAlign: 'center',
    },
    timeBox: {
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.colors.mediumContrastBG,
        marginBottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 24,
        paddingRight: 24,
        height: 150,
        overflow: 'hidden',
    },
    timeSection: {},
    timeBtn: {},
    timeText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH3,
        ...TextStyles.mediaTexts.manropeExtraBold,
    },
    iconSection: {
        // top: 20
    },
    arrowIcon: {
        color: Colors.colors.neutral500Icon,
        fontSize: 24,
    },
    dayList: {
        paddingBottom: 40,
    },
    singleDay: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    dayText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
    },
    pickerStyle: {
        backgroundColor: 'transparent',
        width: 100,
        height: isIos ? 100 : 130,
        marginTop: isIos ? -115 : 0,
    },
});




