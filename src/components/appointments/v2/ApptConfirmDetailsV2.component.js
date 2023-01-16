import React, {Component} from "react";
import {StatusBar, StyleSheet, TouchableOpacity, View, Image, Platform, KeyboardAvoidingView } from 'react-native';
import {Button, Container, Content, Left, Right, Body, Title, Header, Text, Icon} from 'native-base';
import Loader from "../../Loader";
import {BackButton} from "../../BackButton";
import {addTestID, getAvatar, getHeaderHeight, isIphoneX} from "../../../utilities";
import AntIcon from "react-native-vector-icons/AntDesign";
import {PrimaryButton} from "../../PrimaryButton";
import Modal from "react-native-modalbox";
import {Colors, CommonStyles, TextStyles} from "../../../styles";
import {CommonTextArea} from "../../CommonTextArea";
import {DEFAULT_AVATAR_COLOR} from "../../../constants";
const HEADER_SIZE = getHeaderHeight();

export class ApptConfirmDetailsV2Component extends Component {
    constructor(props) {
        super(props);
        this.state = {
            primaryConcernModal: false
        };
    }

    editPrimaryConcern = ()=>{
        this.setState({
            primaryConcernModal: true
        });
    };

    closePrimaryConcernModal = ()=>{
        this.setState({
            primaryConcernModal: false
        });
    };

    render = () => {
        StatusBar.setBarStyle('dark-content', true);
        if (this.props.isLoading) {
            return (<Loader/>);
        }
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>

                <Header transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === "ios" ? null : "transparent"}
                        translucent
                        barStyle={"dark-content"}
                    />
                    <Left>
                        <View style={styles.backButton}>
                            <BackButton
                                {...addTestID('back')}
                                onPress={this.props.backClicked}
                            />
                        </View>
                    </Left>

                    <Body style={styles.headerRow}>
                        {this.props.primaryConcern !== "" && (
                            <Title
                                {...addTestID("confirm-appointment")}
                                style={styles.headerText}>Confirm Appointment</Title>
                        )}
                    </Body>
                    <Right>

                        {/*{this.state.msgText === "" && (
                            <Button transparent
                                    style={{alignItems: 'flex-end', paddingRight: 7, marginRight: 8}}
                                    onPress={() => {
                                        this.refs.modalContact.open()
                                    }}
                            >
                                <FeatherIcons size={30} color={Colors.colors.mainBlue} name="more-horizontal"/>
                            </Button>
                        )}*/}
                    </Right>

                </Header>
                <Content style={{paddingLeft: 24, paddingRight: 24, paddingTop: 24 }}>
                    <Text style={styles.apptHeading}>Confirm your Appointment</Text>
                    <Text style={styles.proText}>Review your appointment request. Confirm it if everything is
                        correct or make changes if needed.</Text>
                    <View style={styles.list}>
                        <TouchableOpacity onPress={this.props.changeUser} style={styles.listItem}>
                            <View style={styles.imageWrapper}>
                                {this.props.selectedUser?.profilePicture ?
                                    <Image
                                        {...addTestID('Pro-Image')}
                                        style={styles.proImage}
                                        resizeMode="cover"
                                        source={{uri: getAvatar(this.props.selectedUser, this.props.S3_BUCKET_LINK)}}/>
                                    :
                                    <View style={{
                                        ...styles.proBgMain,
                                        backgroundColor: this.selectedProvider?.colorCode ? this.selectedProvider?.colorCode : DEFAULT_AVATAR_COLOR
                                    }}><Text
                                        style={styles.proLetterMain}>{this.props.selectedUser?.name.charAt(0).toUpperCase()}</Text></View>
                                }
                            </View>
                            <View style={{...styles.itemDetail, paddingLeft: 16}}>
                                <Text style={styles.itemName}>{this.props.selectedUser?.name}</Text>
                                <Text style={styles.itemDes} numberOfLines={1}>

                                    {this.props.isProviderApp?'Member': (this.props.selectedUser?.designation ? this.props.selectedUser?.designation : 'Therapist')}
                                </Text>
                            </View>
                            {!this.props.selectedUser?.fixedProvider && (
                                <View>
                                    <Button
                                        {...addTestID('Change-Provider-Edit-Btn')}
                                        transparent onPress={this.props.changeUser}>
                                        <Text uppercase={false} style={styles.editText}>Edit</Text>
                                    </Button>
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.props.changeService} style={styles.listItem}>
                            <View style={styles.itemDetail}>
                                <Text style={styles.itemName}>{this.props.selectedService.name}</Text>
                                <Text style={styles.itemDes} numberOfLines={1}>
                                    {this.props.selectedService.durationText}
                                </Text>
                            </View>
                            <View>
                                <Button
                                    {...addTestID('Change-Service-Edit-Btn')}
                                    transparent onPress={this.props.changeService}>
                                    <Text uppercase={false} style={styles.editText}>Edit</Text>
                                </Button>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity  onPress={this.props.changeSchedule} style={styles.listItem}>
                            <View style={styles.itemDetail}>
                                <Text style={styles.itemName}>{this.props.selectedSchedule.date}</Text>
                                <Text style={styles.itemDes} numberOfLines={1}>
                                    {this.props.selectedSchedule.slots}
                                </Text>
                            </View>
                            <View>
                                <Button
                                    {...addTestID('Change-Schedule-Edit-Btn')}
                                    transparent onPress={this.props.changeSchedule}>
                                    <Text uppercase={false} style={styles.editText}>Edit</Text>
                                </Button>
                            </View>
                        </TouchableOpacity>
                        <View style={styles.lastItem}>
                            {this.props.primaryConcern === "" ?
                                <View style={styles.concernWrapperDetail}>
                                    <TouchableOpacity
                                        {...addTestID('Edit-Request-Message')}
                                        onPress={this.editPrimaryConcern}>
                                        <View style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                        }}>
                                            <Text style={styles.msgPlaceholder}>Add Reason for Appointment</Text>
                                            <AntIcon name="plus" size={22} color={Colors.colors.mainBlue}/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                                :
                                <View>
                                    <Text style={styles.concernTextTile}>Primary Concern:</Text>
                                    {this.props.primaryConcern !== ''? <Text style={styles.concernText}>{this.props.primaryConcern}</Text>:null}
                                    <View style={styles.editRemoveConcernWrapper}>
                                        <Text
                                            onPress={this.editPrimaryConcern}
                                            style={{...styles.editText, marginRight: 24}}>Edit</Text>
                                        <Text
                                            onPress={() => {
                                                this.props.removePrimaryConcern()
                                            }}
                                            style={{
                                                ...styles.editText,
                                                color: Colors.colors.errorText
                                            }}>Remove</Text>
                                    </View>
                                </View>
                            }
                        </View>

                    </View>
                </Content>




                <View style={styles.nextBtn}>
                    <PrimaryButton
                        testId="request-appointment"
                        text='Confirm Appointment'
                        onPress={this.props.navigateToNextScreen}
                    />
                </View>


                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    isOpen={this.state.primaryConcernModal}
                    onClosed={this.closePrimaryConcernModal}
                    style={{...CommonStyles.styles.commonModalWrapper, maxHeight: 400}}
                    entry={"bottom"}
                    position={"bottom"} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />

                    <KeyboardAvoidingView
                        style={{flex: 1, bottom: 0}}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                        <Content
                            showsVerticalScrollIndicator={false}>
                            <View>
                                <Text style={styles.detailsTitle}>Add Reason for Appointment</Text>

                                <Text numberOfLines={4} style={styles.detailsPara}>
                                    {
                                        this.props.isProviderApp ? 'Specify why you wanted to schedule the appointment': 'Let the provider know the main reason why you wanted to schedule the appointment.'
                                    }

                                </Text>
                            </View>
                            <View style={styles.domainDetails}>
                                <CommonTextArea
                                    testID={'add-message'}
                                    value={this.props.primaryConcern || ""}
                                    autoFocus={false}
                                    multiline={true}
                                    placeholderText={'Add Reason for Appointment'}
                                    onChangeText={(text)=>{
                                        this.props.primaryConcernChanged(text)
                                    }}
                                    borderColor={Colors.colors.mainBlue}
                                />
                                <View style={styles.modalBtns}>
                                    <View>
                                        <PrimaryButton
                                            testId="add-message"
                                            text="Add Message"
                                            onPress={() => {
                                                this.closePrimaryConcernModal();
                                            }}
                                        />
                                    </View>
                                </View>
                            </View>
                        </Content>
                    </KeyboardAvoidingView>
                </Modal>

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

    apptHeading: {
        marginBottom: 8,
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
    },

    proText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.subTextL,
        color: Colors.colors.mediumContrast,
        marginBottom: 24
    },
    list: {},
    listItem: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: Colors.colors.whiteColor,
        borderColor: '#f5f5f5',
        shadowColor: 'rgba(37, 52, 92, 0.09)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
    },
    lastItem: {
        padding: 16,
        flexDirection: 'row',
        //alignItems: 'flex-start',
        marginBottom: 30,
        justifyContent: 'space-between',
        borderRadius: 12,
        backgroundColor: Colors.colors.whiteColor,
        borderWidth: 1,
        borderColor: '#f5f5f5',
        shadowColor: 'rgba(37, 52, 92, 0.09)',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
    },
    itemDetail: {
        flex: 1,
        //paddingLeft: 16,
    },

    imageWrapper: {
        // flex: 0.5
    },

    itemName: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH7,
        color: Colors.colors.highContrast,
    },
    itemDes: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lowContrast,
    },

    concernWrapperDetail: {
        flex: 1
    },

    msgPlaceholder: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.primaryText,
    },
    concernText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.overlineTextS,
        color: Colors.colors.mediumContrast,
    },
    concernTextTile: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH7,
        color: Colors.colors.highContrast,
    },

    editRemoveConcernWrapper: {
        flexDirection: 'row',
        marginTop: 8
    },

    proImage: {
        width: 48,
        height: 48,
        borderRadius: 80,
        overflow: 'hidden'
    },
    editText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.primaryText,
    },

    nextBtn: {
        padding: 24,
        paddingBottom: isIphoneX() ? 34 : 24,
        ...CommonStyles.styles.stickyShadow
    },
    proBgMain: {
        width: 48,
        height: 48,
        borderRadius: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.whiteColor,
    },

    domainDetails: {
        marginTop: 24,
        marginBottom: 24
    },

    detailsTitle: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
    },
    detailsPara: {
        color: Colors.colors.mediumContrast,
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextS
    },

    modalBtns: {
        paddingBottom: isIphoneX() ? 36 : 24,
        marginTop: 24
    },
    greBtn: {
        paddingBottom: isIphoneX() ? 36 : 24,
        backgroundColor: 'transparent'
    },
});
