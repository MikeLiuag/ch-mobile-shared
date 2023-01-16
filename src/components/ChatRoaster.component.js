import React, {Component} from "react";
import {StyleSheet, View, FlatList, TouchableOpacity, Image} from "react-native";
import {ContentLoader} from "./ContentLoader";
import {Button, Text} from "native-base";
import {getAvatar} from "../utilities";
import AntIcon from 'react-native-vector-icons/AntDesign';
import moment from "moment";

export class ChatRoaster extends Component<Props> {
    constructor(props) {
        super(props);
    }

    renderRoasterContact = ({item}) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
                this.props.openChat(item);
            }}
            style={styles.singleItem}
        >
            <View style={styles.avatarContainer}>
                <View
                    style={
                        item.contactType !== 'CHAT_BOT' &&
                        item.lastMessageUnread
                            ? styles.dot
                            : styles.noDot
                    }
                />
                <Image
                    resizeMode={'cover'}
                    style={styles.avatarImage}
                    source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}}
                />
                {/*<View*/}
                {/*    style={*/}
                {/*        item.contactType === 'ORGANIZATION'*/}
                {/*            ? null*/}
                {/*            : item.contactType !== 'ORGANIZATION' &&*/}
                {/*            item.connectionStatus === 'online'*/}
                {/*            ? styles.state*/}
                {/*            : styles.stateGrey*/}
                {/*    }*/}
                {/*/>*/}
            </View>
            <View style={styles.contact}>
                <Text style={styles.contactUsername}>
                    {item.name}
                </Text>
                <Text style={styles.subText} numberOfLines={1}>
                    {'' || item.lastMessage}
                </Text>
            </View>
            <View style={styles.contactMetaContainer}>
                <View style={styles.contactMetaWrapper}>
                    {item.lastMessageTimestamp ?
                        (
                            <Text style={styles.lastMessageTimestamp}>
                                {moment(item.lastMessageTimestamp).fromNow()}
                            </Text>
                        ) : null}
                </View>

                <View>
                    <Button transparent style={styles.launchChatButton}>
                        <AntIcon name="right" size={16} color="#25345C"/>
                    </Button>
                </View>
            </View>
        </TouchableOpacity>
    );

    render() {
        return (
            <View style={{flex: 1}}>
                {/*{this.renderContentLoader()}*/}
                {this.props.isLoading ?
                    // null
                    (
                        <ContentLoader type="chat" numItems="9"/>
                    )
                    : (
                        <FlatList
                            data={this.props.chats}
                            style={styles.list}
                            renderItem={this.renderRoasterContact}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    )}

            </View>
        );
    }

}

const styles = StyleSheet.create({
    list: {
        borderColor: '#B7D2E5',
        borderBottomWidth: 1,
        backgroundColor: 'white'
    },
    singleItem: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderColor: "#EEE",
        borderWidth: 0.5
    },
    avatarContainer: {
        height: 60,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: '#4FACFE',
        borderWidth: 2
    },
    contact: {
        height: 60,
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 10
    },
    contactUsername: {
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        color: '#25345C'
    },
    subText: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 12,
        color: '#25345C'
    },
    contactMetaContainer: {
        height: 60,
        paddingTop: 10,
        alignItems: 'flex-end',
    },
    contactMetaWrapper: {
        marginLeft: 15,
        marginRight: 8
    },
    lastMessageTimestamp: {
        fontWeight: '500',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#25345C'
    },
    launchChatButton: {
        width: 13,
        height: 20,
        marginLeft: 35,
        paddingLeft: 0,
        paddingTop: 0,
        marginTop: 5,
        marginRight: 12,
    },
    dot: {
        backgroundColor: '#25345C',
        width: 8,
        height: 8,
        borderRadius: 8,
        position: 'absolute',
        left: 1,
        alignSelf: 'center',
        borderColor: '#EAEDF3',
        borderWidth: 1
    },
    noDot: {
        display: 'none'
    }
});

