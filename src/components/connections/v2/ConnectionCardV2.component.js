import React, {PureComponent} from "react";
import {Image, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Icon} from "native-base";
import {addTestID, getAvatar} from "../../../utilities";
import {CHATBOT_DEFAULT_AVATAR, DEFAULT_AVATAR_COLOR,TAB_SEGMENTS_OPTIONS,CONNECTION_TYPES} from "../../../constants";
import {Colors, TextStyles} from "../../../styles";

export class ConnectionCardV2Component extends PureComponent {

    constructor(props) {
        super(props);
    }

    render() {
        const {connection, subText} = this.props;
        return (
            <TouchableOpacity
                {...addTestID('Navigate-to-connection')}
                activeOpacity={0.8}
                style={styles.singleItem}
                onPress={() => {
                    if(this.props.activeSegment !== TAB_SEGMENTS_OPTIONS.PENDING) {
                        this.props.navigateToProfile(connection);
                    }
                }}
            >
                <View style={styles.avatarContainer}>
                    {connection.profilePicture ?
                        <Image
                            resizeMode={'cover'}
                            style={styles.avatarImage} source={{uri: getAvatar(connection, this.props.S3_BUCKET_LINK)}}/>
                        : connection.type === CONNECTION_TYPES.CHAT_BOT ? (<Image
                                resizeMode={'cover'}
                                style={styles.avatarImage} source={{uri: CHATBOT_DEFAULT_AVATAR}}/>) :
                            <View style={{
                                ...styles.proBg,
                                backgroundColor: connection.colorCode ? connection.colorCode : DEFAULT_AVATAR_COLOR
                            }}><Text
                                style={styles.proLetter}>{connection.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.contact}>
                    <Text style={styles.contactUsername} numberOfLines={2}>{connection.name}</Text>
                    <Text style={styles.subText}>{subText}</Text>
                </View>
                <View style={styles.nextWrapper}>
                    <Button
                        {...addTestID('navigate-to-connection-btn')}
                        transparent style={styles.nextBtn} onPress={() => {
                        this.props.openOptions(connection);
                    }}>
                        <Icon type={"Feather"} name="more-horizontal" sie={24}
                              color={Colors.colors.mainBlue}/>
                    </Button>
                </View>
            </TouchableOpacity>
        );
    }

};
const styles = StyleSheet.create({
    singleItem: {
        flex: 1,
        flexDirection: "row",
        paddingLeft: 8,
        paddingRight: 24,
        backgroundColor: Colors.colors.whiteColor,
        alignItems: 'center',
        marginBottom: 16
    },
    avatarContainer: {
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.colors.whiteColor
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    contact: {
        flex: 1,
        backgroundColor: Colors.colors.whiteColor,
    },
    contactUsername: {
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.bodyTextS,
        color: Colors.colors.highContrast,
        marginBottom: 3
    },
    subText: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextExtraS,
        color: Colors.colors.lowContrast,
        textTransform: 'capitalize'
    },
    nextWrapper: {
        height: 60,
        justifyContent: "center"
    },
    proBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    proLetter: {
        color: Colors.colors.whiteColor,
        ...TextStyles.mediaTexts.manropeBold,
        ...TextStyles.mediaTexts.TextH3,
        textTransform: 'uppercase'
    },
    nextBtn: {},
    nextIcon: {}
});
