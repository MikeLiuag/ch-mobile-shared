import React, {Component} from 'react';
import {ScrollView, StatusBar, StyleSheet, AppState, Platform} from 'react-native';
import {Button, Container, Header, Text, View} from 'native-base';
import Loader from "../Loader";
import {SliderSearch} from "../slider-search";
import moment from "moment";
import {addTestID, isIphoneX, getHeaderHeight} from "../../utilities";
import {isEqual} from 'lodash';
import {AppointmentCardListComponent} from "./AppointmentCardList.component";
const HEADER_SIZE = getHeaderHeight();

const filters = {
    TODAY: 'Today',
    ACTION_REQUIRED: 'Action Required',
    REQUESTED: 'Requested',
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show'
}

export class AppointmentsListComponent extends Component<Props> {


    constructor(props) {
        super(props);
        this.state = {
            selectedFilter: filters.TODAY,
            appointments: this.props.appointments,
            appState : AppState.currentState
        };
        this.filterPositions = {};
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.appointments.length===this.props.appointments.length) {
            for(let i =0;i<this.props.appointments.length;i++) {
                const current = this.props.appointments[i];
                const prev = prevProps.appointments[i];
                if(!isEqual(current, prev)) {
                    this.setState({appointments: this.props.appointments});
                    break;
                }
            }
        } else {
            this.setState({appointments: this.props.appointments});
        }
    }


    componentDidMount(): void {
        this.iv = setInterval(()=>{
            this.setState({
                ...this.state
            });
        }, 1000);
        AppState.addEventListener('change', this._handleAppState);
    }
    componentWillUnmount(): void {
        if(this.iv) {
            clearInterval(this.iv);
            this.iv = null;
        }
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if(this.state.appState === 'active') {
            if(this.animation) {
                this.animation.play();
            }
        }
    }

    backClicked = () => {
        this.props.goBack();
    };

    changeFilter = (selectedFilter) => {
        this.setState({selectedFilter});
    };

    measureFilterLayout = (nativeEvent, filter, index)=>{
        const pos = (index*nativeEvent.layout.width+50);
        this.filterPositions[filter]=index>1?pos:0;
    };

    renderFilters = () => {
        const buttons = Object.keys(filters).map((key,index) => {
            const filter = filters[key];
            const appts = this.getAppointmentsByStatus(this.getStatusByFilter(filter));
            return (<Button
                {...addTestID('filter' + (filter))}
                key={filter + "-filter"}
                rounded
                onLayout={({nativeEvent})=>{this.measureFilterLayout(nativeEvent, filter, index)}}
                onPress={() => {
                    this.changeFilter(filter)
                }}
                style={this.state.selectedFilter === filter ? styles.filterBtnSelected : styles.filterBtn}
            >
                <Text
                    style={this.state.selectedFilter === filter ? styles.filterTextSelected : styles.filterText}>
                    {filter}
                </Text>
                {appts && appts.length>0 && (filter===filters.ACTION_REQUIRED || filter === filter.TODAY) &&  (
                    <View style={{...styles.countRing, backgroundColor: this.state.selectedFilter === filter ? '#515d7d': styles.countRing.backgroundColor}}>
                        <Text
                            style={this.state.selectedFilter === filter ? styles.filterCountSelected : {...styles.filterCount, color: filter===filters.ACTION_REQUIRED?'#ec0d4e':styles.filterCount.color}}>
                            {appts.length}
                        </Text>
                    </View>
                )}

            </Button>)
        })
        return (<ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            ref={(ref)=>{this.scrollView = ref}}
            onLayout={()=>{
                setTimeout(()=>{
                    if(this.scrollView) {
                        this.scrollView.scrollTo({x: this.filterPositions[this.state.selectedFilter], y:0, animated: true});
                    }
                }, 10);
            }}
            contentContainerStyle={{
                justifyContent: 'space-evenly',
                alignItems: 'flex-start',
                paddingRight: 20
            }}
            style={styles.filtersView}>
            {buttons}
        </ScrollView>)
    };

    getStatusByFilter = (selectedFilter) => {
        if(!selectedFilter) {
            selectedFilter = this.state.selectedFilter;
        }
        switch (selectedFilter) {
            case filters.TODAY:
                return 'TODAY';
            case filters.ACTION_REQUIRED:
                return 'NEEDS_ACTION';
            case filters.REQUESTED:
                return 'PROPOSED';
            case filters.SCHEDULED:
                return 'BOOKED';
            case filters.COMPLETED:
                return 'FULFILLED';
            case filters.CANCELLED:
                return 'CANCELLED';
            case filters.NO_SHOW:
                return 'No Show';

        }
    };

    propagate = (data) => {
        console.log(data);
        this.setState({appointments: data.appointments});
    };

    isMissed = (appt)=>{
        return moment(appt.endTime).diff(moment(), 'minutes')<0
    };

    getAppointmentsByStatus = (status)=>{
        let appointments;
        if (status === 'TODAY') {
            appointments = this.state.appointments.filter(appt => {
                return appt.status === 'BOOKED' && moment().isSame(moment(appt.startTime), 'days')
                    && !this.isMissed(appt);
            });
        } else if(status==='No Show') {
            appointments = this.state.appointments.filter(appt => {
                return appt.status === 'BOOKED' && this.isMissed(appt);
            });
        } else if(status==='BOOKED') {
            appointments = this.state.appointments.filter(appt => {
                return appt.status === 'BOOKED' && !this.isMissed(appt);
            });
        }  else if(status==='NEEDS_ACTION') {
            appointments = this.state.appointments.filter(appt => {
                return appt.status === 'NEEDS_ACTION';
            });
        } else {
            appointments = this.state.appointments.filter(appt => {
                return appt.status === status;
            });
        }
        return appointments;
    };

    getFilteredAppointments = ()=>{
        const status = this.getStatusByFilter();
        return this.getAppointmentsByStatus(status);
    };

    render() {
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        let appointments = [];
        if(!this.props.error) {
            appointments = this.getFilteredAppointments();
        }

        return (
            <Container>
                <Header transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios'? null : "transparent"}
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
                                appointments: this.props.appointments,
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
                            backClicked: this.backClicked

                        }}

                    />


                </Header>
                {!this.props.error && this.renderFilters()}
                {this.props.error ? (
                    (<View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16}}>Failed to load appointments.</Text>
                        <Text onPress={()=>{
                            if(this.props.fetch) {
                                this.props.fetch();
                            }
                        }} style={{marginTop: 20, fontFamily: 'Roboto-Regular',
                            fontSize: 16,
                            color: '#3fb2fe',}}>Retry</Text>
                    </View>)
                ): (<AppointmentCardListComponent
                    selectedFilter={this.state.selectedFilter}
                    appointments={appointments}
                    showDetails={this.props.showDetails}
                    addToCalendar={this.props.addToCalendar}
                />)}

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: HEADER_SIZE,
        paddingTop: 15,
        elevation: 0,
        paddingLeft: 18,
        paddingRight: 18,
        borderBottomColor: '#fff',
        borderBottomWidth: 0,
        flexDirection: 'column'
    },
    titletext: {
        color: '#25345c',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center'
    },
    filtersView: {
        flexGrow: 0,
        flexShrink: 0,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        backgroundColor: '#ffffff',
        height: 60,
        paddingBottom: 24,
        paddingLeft: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5'
    },
    filterBtn: {
        height: 32,
        borderWidth: 0.5,
        borderColor: '#f5f5f5',
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor: '#fff',
        marginRight: 8
    },
    filterText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.54,
        textTransform: 'capitalize'
    },
    filterBtnSelected: {
        height: 32,
        borderWidth: 0.5,
        borderColor: '#f5f5f5',
        shadowColor: '#f5f5f5',
        shadowOffset: {
            width: 5,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 2,
        backgroundColor: '#515d7d',
        marginRight: 8
    },
    filterTextSelected: {
        color: '#FFF',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        lineHeight: 16,
        fontSize: 14,
        letterSpacing: 0.54,
        textTransform: 'capitalize'
    },
    filterCount: {
        color: '#515d7d',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 13
    },
    filterCountSelected: {
        color: '#FFF',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 12,
        lineHeight: 13
    },
    countRing: {
        backgroundColor: 'rgba(236,13,78,0.1)',
        borderRadius: 15,
        width:24,
        height: 24,
        marginRight:5,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
