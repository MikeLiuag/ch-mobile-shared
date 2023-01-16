import React, {Component} from 'react';
import {Container, Content, Text, View} from 'native-base';
import {Linking, Platform, StatusBar, StyleSheet, TouchableOpacity} from "react-native";
import {addTestID, isIphoneX} from '../../../utilities';
import {BackButton} from "../../BackButton";
import {Colors, TextStyles} from "../../../styles";
import FeatherIcons from "react-native-vector-icons/Feather";
import {GET_SUPPORT_EMAIL, GET_SUPPORT_HELP_LINE} from "../../../constants"

export class SupportInfoComponent extends Component<Props> {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            supportEmail: ''
        }
    }

    backClicked = () => {
        this.props.goBack();
    };

    dialNumber = () => {
        let phoneNumber = '';
        if (Platform.OS === 'android') {
            phoneNumber = `tel:${GET_SUPPORT_HELP_LINE}`;
        } else {
            phoneNumber = `tel://${GET_SUPPORT_HELP_LINE}`;
        }
        this.setState({message: "", supportEmail: ""})
        Linking.openURL(phoneNumber);
    };

    onChangeMessage = (message) => {
        this.setState({message});
    }

    sendMessage = () => {
        Linking.openURL(`mailto:${GET_SUPPORT_EMAIL}?subject=Need help`)
    }

    render() {
        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                <StatusBar
                    backgroundColor={Platform.OS === 'ios' ? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <View style={styles.backButtonWrapper}>
                    <BackButton
                        {...addTestID('back-btn')}
                        onPress={this.backClicked}
                    />
                </View>
                <Content showsVerticalScrollIndicator={false} style={{paddingTop: 36,paddingLeft:24,paddingRight:24}}>
                    <View>
                        <Text {...addTestID('notifications')}
                              style={styles.mainTitle}>Get Support</Text>
                        <Text style={styles.subTitle}>
                            Get support or leave feedback for our team.
                        </Text>
                    </View>

                    <View style={styles.mainIconsWrapper}>
                        <TouchableOpacity onPress={()=>this.dialNumber()}>
                            <View style={styles.iconViewStyle}>
                                <View style={styles.iconInnnerViewStyle}>
                                    <FeatherIcons style={styles.editIcon}
                                                  color={Colors.colors.primaryIcon}
                                                  size={28}
                                                  name='phone-call'
                                    />
                                    <Text style={styles.iconText}>Call us</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.sendMessage}>
                            <View style={styles.iconViewStyle}>
                                <View style={styles.iconInnnerViewStyle}>
                                    <FeatherIcons style={styles.editIcon}
                                                  color={Colors.colors.informationIcon}
                                                  size={28}
                                                  name='mail'
                                    />
                                    <Text style={styles.iconText}>Write email</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    backButtonWrapper: {
        position: 'relative',
        zIndex: 2,
        paddingTop: isIphoneX() ? 50 : 44,
        paddingLeft: 22
    },
    mainTitle: {
        ...TextStyles.mediaTexts.serifProExtraBold,
        ...TextStyles.mediaTexts.TextH1,
        color: Colors.colors.highContrast,
    },
    subTitle: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        marginTop: 16
    },
    sectionTitle: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.overlineTextS,
        textTransform: 'uppercase',
        color: Colors.colors.lowContrast,
        marginTop: 24,
        marginBottom: 24
    },
    notificationList: {
        marginBottom: 50
    },
    singleItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        paddingBottom: 12
    },
    itemName: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.mediumContrast
    },
    textBox: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.captionText,
        color: Colors.colors.lowContrast
    },
    gradientWrapper: {
        marginTop:24
    },
    mainIconsWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 40,
        marginBottom: 40,
    },
    iconViewStyle: {
        display: 'flex',
        alignItems: 'center',
        padding: 16,
        justifyContent: 'center',
        paddingTop: 38,
        paddingBottom: 38,
        width: 155,
        height: 156,
        backgroundColor: Colors.colors.primaryColorBG,
        borderRadius: 12
    },
    iconInnnerViewStyle: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconText: {
        ...TextStyles.mediaTexts.manropeMedium,
        ...TextStyles.mediaTexts.subTextM,
        color: Colors.colors.primaryText
    },
    editIcon: {
        bottom: 20
    }
});
