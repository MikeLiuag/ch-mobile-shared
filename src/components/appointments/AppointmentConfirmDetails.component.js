import React, {Component} from 'react';
import {Image, Platform, StatusBar, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Body, Button, Container, Content, Header, Icon, Left, Right, Text, Title} from 'native-base';
import {getAvatar, isIphoneX,addTestID} from '../../utilities';
import GradientButton from '../../components/GradientButton';
import Ionicon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import CommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";
import momentTimeZone from "moment-timezone";
import Loader from "../Loader";
import {DEFAULT_AVATAR_COLOR} from "../../constants";


export class AppointmentConfirmDetailsComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }


    getSlotDesc = () => {
        return this.props.selectedSchedule.slotStartTime.time + ' ' + this.props.selectedSchedule.slotStartTime.amPm + ' -> '
            + this.props.selectedSchedule.slotEndTime.time + ' ' + this.props.selectedSchedule.slotEndTime.amPm
    };

    editRequestMessage = () => {
        this.props.editRequestMessage({
            setText: this.setRequestMessageText,
            text: this.state.msgText
        });
    };

    setRequestMessageText = (text) => {
        this.setState({msgText: text});
    };

    submitAppointmentRequest = async ()=>{
        const payload = {
            participantId: this.props.selectedUser.userId,
            serviceId: this.props.selectedService.id,
            slot: this.props.selectedSchedule.slot,
            day: this.props.selectedSchedule.day,
            month: parseInt(this.props.selectedSchedule.month),
            year: this.props.selectedSchedule.year,
            comment: this.state.msgText,
            timeZone: momentTimeZone.tz.guess(true)
        };
        console.log(payload);
        this.props.requestAppointment(payload);
    };


    render = () => {
        if(this.props.isLoading) {
            return (<Loader/>);
        }
        return (
            <Container>
                <LinearGradient
                    start={{x: 1, y: 1}}
                    end={{x: 1, y: 0}}
                    colors={["#fff", "#fff", "#f7f9ff"]}
                    style={{flex: 1}}
                >
                    <Header transparent style={styles.header}>
                        <StatusBar
                            backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                            translucent
                            barStyle={'dark-content'}
                        />
                        <Left>
                            <Button
                                {...addTestID('Back')}
                                transparent
                                style={styles.backBtn}
                                onPress={this.props.goBack}>
                                <Icon
                                    name="angle-left"
                                    type={'FontAwesome'}
                                    style={styles.backIcon}
                                />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={styles.stepperText}>Step 4 of 4</Title>
                        </Body>
                        <Right/>
                    </Header>
                    <Content
                        {...addTestID('Content-appointment-confirmation-details')}
                    >
                        <Text style={styles.apptHeading}>Request Appointment</Text>
                        <Text style={styles.proText}>Confirm Details</Text>
                        <View style={styles.list}>
                            <View
                                {...addTestID('selected-user')}
                                style={styles.listItem}>
                                <View style={styles.imageWrapper}>
                                    {this.props.selectedUser.profilePicture?
                                        <Image
                                            style={styles.proImage}
                                            resizeMode="cover"
                                            source={{uri: getAvatar(this.props.selectedUser, this.props.S3_BUCKET_LINK)}}/>
                                        :
                                        <View style={{
                                            ...styles.proBgMain,
                                            backgroundColor: this.props.selectedUser.colorCode?this.props.selectedUser.colorCode:DEFAULT_AVATAR_COLOR
                                        }}><Text
                                            style={styles.proLetterMain}>{this.props.selectedUser.name.charAt(0).toUpperCase()}</Text></View>
                                    }
                                </View>
                                <View style={styles.itemDetail}>
                                    <Text style={styles.itemName}>{this.props.selectedUser.name}</Text>
                                    <Text style={styles.itemDes} numberOfLines={1}>

                                        {!this.props.isProvider?
                                            this.props.selectedUser.designation
                                            : 'Connected Since ' + momentTimeZone(this.props.selectedUser.lastModified).format('MMMM D, Y')}
                                    </Text>
                                </View>
                                {!this.props.selectedUser.fixedProvider && (
                                    <View>
                                        <Button
                                            {...addTestID('Edit-change-user-btn')}
                                            transparent onPress={this.props.changeUser}>
                                            <Text uppercase={false} style={styles.editText}>Edit</Text>
                                        </Button>
                                    </View>
                                )}
                            </View>

                            <View
                                {...addTestID('selected-service')}
                                style={styles.listItem}>
                                <View style={styles.imageWrapper}>
                                    <View style={styles.iconWrapper}>
                                        <CommunityIcon color="#3fb2fe" name="webcam" size={28}/>
                                    </View>
                                </View>
                                <View style={styles.itemDetail}>
                                    <Text style={styles.itemName}>{this.props.selectedService.name}</Text>
                                    <Text style={styles.itemDes} numberOfLines={1}>
                                        {this.props.selectedService.durationText}, ${this.props.selectedService.recommendedCost}
                                    </Text>
                                </View>
                                <View>
                                    <Button
                                        {...addTestID('Edit-change-service-btn')}
                                        transparent onPress={this.props.changeService}>
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>
                            </View>

                            <View
                                {...addTestID('selected-schedule')}
                                style={styles.listItem}>
                                <View style={styles.imageWrapper}>
                                    <View style={styles.iconWrapper}>
                                        <Ionicon color="#3fb2fe" name="ios-time" size={26}/>
                                    </View>
                                </View>
                                <View style={styles.itemDetail}>
                                    <Text style={styles.itemName}>{this.props.selectedSchedule.dateDesc}</Text>
                                    <Text style={styles.itemDes} numberOfLines={1}>
                                        {this.getSlotDesc()}
                                    </Text>
                                </View>
                                <View>
                                    <Button
                                        {...addTestID('Edit-change-schedule-btn')}
                                        transparent  onPress={this.props.changeSchedule}>
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>
                            </View>

                            <View
                                {...addTestID('message')}
                                style={styles.lastItem}>
                                <View style={styles.imageWrapper}>
                                    <View style={styles.iconWrapper}>
                                        <CommunityIcon color="#3fb2fe" name="chat" size={26}/>
                                    </View>
                                </View>
                                <View style={styles.itemDetail}>
                                    <TouchableOpacity
                                        {...addTestID('Edit-request-message')}
                                        style={{paddingTop: 10}}
                                        onPress={() => {
                                            this.editRequestMessage();
                                        }}>
                                        <Text style={this.state.msgText? {...styles.msgPlaceholder, color: '#646c73'} : styles.msgPlaceholder}>{this.state.msgText?this.state.msgText:'Add message (optional)'}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View>
                                    <Button
                                        {...addTestID('Edit-request-message-btn')}
                                        transparent
                                            onPress={this.editRequestMessage}
                                    >
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>
                            </View>


                        </View>
                    </Content>
                    <View style={styles.nextBtn}>
                        <GradientButton
                            testId = "request-appointment"
                            text="Request Appointment"
                            onPress={this.submitAppointmentRequest}
                        />
                    </View>
                </LinearGradient>
            </Container>
        );
    };
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
        lineHeight: 12
    },
    backBtn: {
        marginLeft: 0,
        width: 30
    },
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
        marginBottom: 16
    },
    proText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 17,
        letterSpacing: 0.8,
        lineHeight: 18,
        textAlign: 'center',
        marginBottom: 30
    },
    list: {
        // padding: 16
    },
    listItem: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: '#f5f5f5',
        borderBottomColor: '#f5f5f5'
    },
    lastItem: {
        padding: 24,
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 30
    },
    imageWrapper: {
        // flex: 0.5
    },
    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: 'rgba(63,178,254,0.1)',
        alignItems: 'center',
        justifyContent: 'center'
    },
    proImage: {
        width: 48,
        height: 48,
        borderRadius: 25,
        overflow: 'hidden'
    },
    itemDetail: {
        flex: 1,
        paddingLeft: 16
    },
    itemName: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.3
    },
    itemDes: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 19,
        letterSpacing: 0.28
    },
    msgPlaceholder: {
        color: '#b3bec9',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        lineHeight: 22,
        letterSpacing: 0.2
    },
    editText: {
        color: '#3fb2fe',
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        letterSpacing: 0.3,
        fontWeight: '600'
    },
    checkWrapper: {
        paddingRight: 16
    },
    nextBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        paddingBottom: isIphoneX() ? 34 : 24
    },

    proBgMain:{
        width: 48,
        height: 48,
        borderRadius: 25,
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

