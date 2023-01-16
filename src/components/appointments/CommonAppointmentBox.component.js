import React, { Component } from "react";
import { StyleSheet, Image, TouchableOpacity} from "react-native";
import { Text, View} from "native-base";
import {Colors, TextStyles, CommonStyles } from '../../styles';
import { PrimaryButton } from "../PrimaryButton";
import AwesomeIcon from "react-native-vector-icons/FontAwesome";
import {Rating} from 'react-native-elements';
import {
    APPOINTMENT_STATUS,
    DEFAULT_IMAGE,
    APPOINTMENT_SIGNOFF_STATUS,
    PROVIDER_ROLES,
    CONTACT_NOTES_FLAGS, CONTACT_NOTES_STATUS
} from '../../constants';
export class CommonAppointmentBox extends Component<Props> {

    renderDurationText = (duration)=>{
        let hours = Math.floor(duration / 60);
        let minutes = duration % 60;
        let text = '';
        if(hours>0) {
            text = hours + ' hour'
        }
        if(minutes>0) {
            text+=' ' + minutes + ' minute'
        };
        return <Text style={styles.infoContent}>{text+' session'}</Text>
    };
    checkPatientProhibitiveToMarkProfileRed = (item) => {
        const contactNotes = item?.contactNotes
        let isPatientProhibitive = false
        for (let contactNote of contactNotes) {
            if (contactNote.flag === CONTACT_NOTES_FLAGS.PROHIBITIVE && contactNote.status === CONTACT_NOTES_STATUS.ACTIVE) {
                isPatientProhibitive = true;
                break;
            }
        }
        return isPatientProhibitive;
    }
    render() {
        const { S3_BUCKET_LINK } = this.props;
        let isPatientProhibitive=false
        if(this.props?.connections?.length>0)
        {
            let connection = this.props?.connections?.activeConnections?.filter(connection=>connection.connectionId===this.props?.appointment?.participantId)[0];
            if(!connection) {
                connection = this.selectedMember;
            }
            isPatientProhibitive =this.checkPatientProhibitiveToMarkProfileRed(connection)
        }
        return (
            <TouchableOpacity
                onPress={this.props.onPress}
                style={styles.appointmentBox}>
                <View style={styles.apptDateRow}>
                    {
                        this.props.today?
                            <View style={styles.todayBox}>
                                <AwesomeIcon name={'calendar-check-o'} color={Colors.colors.secondaryIcon} size={22} />
                                <Text style={styles.todayText}>Today</Text>
                            </View> :
                            <Text style={styles.dateText}>{`${this.props?.appointment?.month} ${this.props?.appointment?.date}, ${this.props?.appointment?.year}`}</Text>
                    }
                    <Text style={styles.sessionText}>{this.props.appointment.startText} - {this.props.appointment.endText}</Text>
                </View>
                <View style={styles.apptContentRow}>
                    <Text style={styles.apptMainText}>{this.props.appointment.serviceName}</Text>
                    <View style={{...styles.contentWrapper,marginBottom: 8}}>
                        <View style={this?.props.isProviderApp?isPatientProhibitive?styles.colorImgBGRed:styles.colorImgBG:styles.colorImgBG}>

                            {
                                this.props.appointment.avatar? (
                                    <>
                                        <Image
                                            style={styles.personImg}
                                            resizeMode={'cover'}
                                            source={{uri: this.props.appointment.avatar || S3_BUCKET_LINK + DEFAULT_IMAGE}}  />
                                        <View style={styles.statusDot}></View>
                                    </>

                                ): (
                                    <View
                                        style={{
                                            ...styles.proBgMain,
                                            backgroundColor: this.props.appointment.colorCode,
                                        }}>
                                        <Text style={styles.proLetterMain}>
                                            {this.props.appointment.participantName && this.props.appointment.participantName.charAt(0).toUpperCase()}
                                        </Text>
                                    </View>
                                )
                            }

                        </View>
                        <View style={styles.personDetails}>
                            <Text style={styles.infoTitle}>{this.props.appointment.participantName}</Text>
                            <Text style={styles.infoContent}>{this.renderDurationText(this.props.appointment.serviceDuration)}</Text>
                            {!(this.props.appointment?.requireSupervisorSignOff && this.props.profile?.signOffRole === "SUPERVISOR") && (
                                this.props.rating && (
                                    <View style={styles.ratingBox}>
                                        <Rating
                                            readonly
                                            type="custom"
                                            showRating={false}
                                            ratingCount={5}
                                            imageSize={24}
                                            ratingColor={Colors.colors.secondaryIcon}
                                            selectedColor={Colors.colors.secondaryIcon}
                                            startingValue={this.props.rating}
                                            fractions={2}
                                            tintColor={'#fff'}
                                            ratingBackgroundColor={Colors.colors.secondaryColorBG}
                                        />
                                        <Text style={styles.ratingText}>{this.props.rating}.0</Text>
                                    </View>
                                )
                            )}

                            {!(this.props.appointment?.requireSupervisorSignOff && this.props.profile?.signOffRole === "SUPERVISOR") && (
                                this.props.apptStatus && (
                                    <View style={[styles.apptStatus, { backgroundColor: this.props.apptStatusBg}]}>
                                        <Text style={[styles.apptStatusText, { color: this.props.statusTextColor }]}>{this.props.apptStatusText}</Text>
                                    </View>
                                )
                            )}

                        </View>
                    </View>

                    {(this.props.appointment?.requireSupervisorSignOff && this.props.profile?.signOffRole === "SUPERVISOR") &&  (
                        <View style={styles.contentWrapper}>
                            <View style={styles.colorImgBG}>
                                {
                                    this.props.appointment?.practitionerImage? (
                                        <>
                                            <Image
                                                style={styles.personImg}
                                                resizeMode={'cover'}
                                                source={{uri: S3_BUCKET_LINK + this.props.appointment?.practitionerImage || S3_BUCKET_LINK + DEFAULT_IMAGE}}  />
                                        </>

                                    ): (
                                        <View
                                            style={{
                                                ...styles.proBgMain,
                                                backgroundColor: this.props.appointment.colorCode,
                                            }}>
                                            <Text style={styles.proLetterMain}>
                                                {this.props.appointment?.practitionerName && this.props.appointment?.practitionerName?.charAt(0).toUpperCase()}
                                            </Text>
                                        </View>
                                    )
                                }

                            </View>
                            <View style={styles.personDetails}>
                                <Text style={styles.infoTitle}>{this.props.appointment?.practitionerName}</Text>
                                <Text style={styles.infoContent}>{this.props.appointment?.practitionerDesignation}</Text>
                            </View>
                        </View>
                    )}

                </View>
                <View style={styles.apptBtnRow}>
                    {
                        this.props.buttonOptions && (
                            this.props?.isProviderApp &&
                            this.props?.profile?.signOffRole === PROVIDER_ROLES.SUPERVISOR &&
                            this.props.appointment?.status === APPOINTMENT_STATUS.FULFILLED
                            && (this.props.appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.REVIEW)?
                                <View style={{...styles.blueBtnWrap,justifyContent:'center'}}>
                                    <View style={{...styles.blueBtn,width:'100%'}}>
                                        <PrimaryButton
                                            onPress={this.props.onConfirm}
                                            text={'Review & Sign'}/>
                                    </View>
                                </View>
                                :
                                this.props?.isProviderApp && this.props?.profile?.signOffRole === PROVIDER_ROLES.ASSOCIATE
                                && this.props.appointment?.status === APPOINTMENT_STATUS.FULFILLED
                                && (this.props.appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.REVIEW)?
                                    <View style={styles.blueBtnWrap}>
                                        <View>
                                            <PrimaryButton
                                                onPress={this.props.onConfirm}
                                                text={'Review'}/>
                                        </View>
                                    </View>
                                    :
                                    this.props?.isProviderApp
                                    && this.props.appointment?.status === APPOINTMENT_STATUS.FULFILLED
                                    && (this.props.appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.DRAFTED || this.props.appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.REJECTED)?
                                        <View style={styles.blueBtnWrap}>
                                            <View >
                                                <PrimaryButton
                                                    onPress={this.props.onConfirm}
                                                    text={this.props.appointment?.signOffStatus === APPOINTMENT_SIGNOFF_STATUS.REJECTED?"Re-review Notes":'Complete Notes'}/>
                                            </View>
                                        </View>
                                        :
                                        <View style={styles.blueBtnWrap}>
                                            <View style={styles.blueBtn}>
                                                <PrimaryButton
                                                    onPress={this.props.onConfirm}
                                                    text={'Confirm'}/>
                                            </View>
                                            <View style={styles.blueBtn}>
                                                <PrimaryButton
                                                    onPress={this.props.onChange}
                                                    bgColor={Colors.colors.primaryColorBG}
                                                    textColor={Colors.colors.primaryText}
                                                    text={'Change'}/>
                                            </View>
                                        </View>
                        )
                    }
                </View>
            </TouchableOpacity>

        );
    }
}
const styles = StyleSheet.create({
    appointmentBox: {
        ...CommonStyles.styles.shadowBox,
        borderRadius: 12,
        paddingBottom: 24,
        marginBottom: 16
    },
    apptDateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomColor: Colors.colors.mediumContrastBG,
        borderBottomWidth: 1
    },
    todayBox: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    todayText: {
        color: Colors.colors.secondaryText,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        paddingLeft: 8
    },
    dateText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS
    },
    sessionText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText
    },
    apptContentRow: {
        paddingHorizontal: 24,
        paddingTop: 16
    },
    apptMainText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        marginBottom: 8
    },
    contentWrapper: {
        flexDirection: 'row',
        // alignItems: 'center'
    },
    colorImgBG: {
        width: 48,
        height: 48,
        position: 'relative'
    },
    colorImgBGRed: {
        width: 54,
        height: 54,
        borderRadius: 28,
        position: 'relative',
        borderColor: Colors.colors.darkRed,
        borderWidth: 2,
        marginRight: 12,
        padding: 1
    },
    personImg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        padding:8,
        borderColor: Colors.colors.highContrastBG,
        borderWidth: 1
    },
    statusDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: Colors.colors.neutral50Icon,
        borderColor: Colors.colors.white,
        borderWidth: 2,
        position: 'absolute',
        bottom: 3,
        right: 2
    },
    personDetails: {
        paddingLeft: 12,
        flex: 1
    },
    infoTitle: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS
    },
    infoContent: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    ratingText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.captionText,
        paddingLeft: 8
    },
    apptStatus: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: Colors.colors.highContrastBG,
        borderRadius: 16,
        marginTop: 8,
        alignSelf: 'flex-start'
    },
    apptStatusText: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
    },
    apptBtnRow: {
        paddingHorizontal: 24
    },
    blueBtnWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 16
    },
    blueBtn: {
        width: '48%'
    },
    greenBtn: {

    },
    proBgMain: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.whiteColor,
    },
    segmentBtnText: {
        textAlign: 'center',
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.subTextS,
        width: '100%'
    }
});
