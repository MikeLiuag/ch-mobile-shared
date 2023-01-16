import React, {Component} from 'react';
import {AppState, StyleSheet} from 'react-native';
import {Container, Content, Text, View} from 'native-base';
import LottieView from "lottie-react-native";
import alfie from "../../assets/animations/Dog_Calendar";
import {AppointmentsCardComponent} from "./AppointmentCard.component";
import {isCloseToBottom} from '../../utilities';


const filters = {
    TODAY: 'Today',
    ACTION_REQUIRED: 'Action Required',
    REQUESTED: 'Requested',
    SCHEDULED: 'Scheduled',
    COMPLETED: 'Completed',
    CANCELLED: 'Cancelled',
    NO_SHOW: 'No Show'
}

export class AppointmentCardListComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            appointments: this.props.appointments,
            sliceFrom: 0,
            appState : AppState.currentState
        };
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if(prevProps.selectedFilter !== this.props.selectedFilter) {
            this.setState({appointments: this.props.appointments, sliceFrom: 0});
            if(this.scrollView) {
                this.scrollView.scrollTo({y: 0, animated: false});
            }
        } else if(prevProps.appointments.length!==this.props.appointments.length) {
            this.setState({appointments: this.props.appointments, sliceFrom: 0});
            if(this.scrollView) {
                this.scrollView.scrollTo({y: 0, animated: false});
            }
        }
    }



    componentDidMount(): void {
        AppState.addEventListener('change', this._handleAppState);
    }
    componentWillUnmount(): void {
        AppState.removeEventListener('change', this._handleAppState);
    }

    _handleAppState = () => {
        if(this.state.appState === 'active') {
            if(this.animation) {
                this.animation.play();
            }
        }
    };

    getStatusByFilter = () => {
        const selectedFilter = this.props.selectedFilter;
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


    getEmptyMessages = () => {
        let emptyStateMsg = '';
        let emptyStateHead = '';
        const filterType = this.getStatusByFilter();
        switch(filterType) {
            case
            'TODAY'
            :
                emptyStateHead = 'No Appointments Today';
                emptyStateMsg = 'You have no appointments today. If you don’t think this is right, then check your scheduled appointments' + (this.props.isProviderApp?'.' : ' or reach out to your provider.');
                break;
            case
            'NEEDS_ACTION'
            :
                emptyStateHead = 'No Actions Required';
                emptyStateMsg = 'You have no appointments with actions required right now. You’ll only have appointments in this section if you have to approve a new appointment or changes to an existing appointment.'
                break;
            case
            'PROPOSED'
            :
                emptyStateHead = 'No Requested Appointments';
                emptyStateMsg = 'You have no requested appointments currently. If you don’t think this is right, then check your scheduled appointments' + (this.props.isProviderApp?'.' : ' or reach out to your provider.');
                break;
            case
            'BOOKED'
            :
                emptyStateHead = 'No Appointments Scheduled';
                emptyStateMsg = 'You have no scheduled appointments right now. You’ll only have appointments in this section if you have an upcoming appointment scheduled.'
                break;
            case
            'FULFILLED'
            :
                emptyStateHead = 'No Completed Appointments, Yet';
                emptyStateMsg = 'You have no completed appointments. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.'
                break;
            case
            'CANCELLED'
            :
                emptyStateHead = 'No Cancelled Appointments';
                emptyStateMsg = 'You have no cancelled appointments. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.'
                break;
            case
            'No Show'
            :
                emptyStateHead = 'No Show Appointments';
                emptyStateMsg = 'You do not have any no show appointments right now. You’ll only have appointments in this section if you have any no show appointment.'
                break;
        }
        return(
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
            </View>
        )
    };

    render() {
        const sliceFrom = this.state.sliceFrom;
        const appointmentViews = this.state.appointments
            .slice(0, sliceFrom+10)
            .map((appointment, index) => {
                return (<AppointmentsCardComponent
                    key={appointment.appointmentId}
                    appointment={appointment}
                    showDetails={this.props.showDetails}
                    addToCalendar={this.props.addToCalendar}
                    index = {index}
                />);
            });
        return (
            <Container>
                <Content innerRef={(ref)=>{
                    this.scrollView = ref;
                }} onScroll={({nativeEvent}) => {
                    if (
                        isCloseToBottom(nativeEvent) &&
                        (sliceFrom + 10) < this.props.appointments.length
                        && !this.state.sliceLocked
                    ) {
                        console.log('Close to Bottom');
                        this.setState({sliceFrom: sliceFrom+10, sliceLocked: true});
                        setTimeout(()=>{
                            this.setState({sliceLocked: false})
                        }, 1000);
                    }
                }} style={styles.mainBG}>
                    <View style={styles.apptList}>
                        {appointmentViews.length === 0? this.getEmptyMessages() : appointmentViews}
                    </View>
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
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
        color: '#25345C',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        alignSelf: 'center',
        fontSize: 15,
        letterSpacing: 0.5,
        lineHeight: 15,
        marginBottom: 20
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
        textAlign: 'center'
    },
    mainBG: {
        backgroundColor: '#f8f9fd',
    },
    apptList: {
        padding: 24
    },
});
