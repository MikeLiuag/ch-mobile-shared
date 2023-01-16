import React, {Component} from 'react';
import {StatusBar, StyleSheet, Text, View, FlatList, TouchableOpacity, Image} from 'react-native';
import {Container, Content, Radio} from 'native-base';
import {getAvatar, isIphoneX,addTestID} from '../../utilities';
import GradientButton from '../GradientButton';
import moment from "moment";
import Loader from "../Loader";
import {AVATAR_COLOR_ARRAY} from '../../constants';

export class PendingConnectionsComponent extends Component<props> {

    constructor(props) {
        super(props);
    }


    getNameByType = (itemName) => {

        switch (itemName) {
            case 'PRACTITIONER':
                return "Provider";
            case 'CHAT_GROUP':
                return "Group Chat";
            case 'MATCH_MAKER':
                return "Matchmaker";
            default:
                return "Member";
        }

    };

    renderListItem = ({item,index}) => {
        return (
            <TouchableOpacity
                {...addTestID('stay-connection - ' + (index+1))}
                activeOpacity={0.8}
                style={styles.singleItem}
                onPress={() => {
                    this.props.stayConnected(item)
                }}
            >

                <View style={styles.avatarBox}>
                    {item.profilePicture ?
                        <Image
                            style={styles.avatarImg}
                            resizeMode={"cover"}
                            source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}}/>
                        :
                        <View style={{
                            ...styles.proBg,
                            backgroundColor: AVATAR_COLOR_ARRAY[index % AVATAR_COLOR_ARRAY.length]
                        }}><Text style={styles.proLetter}>{item.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.textBox}>
                    <Text style={styles.conName}>{item.name}</Text>

                    {item.joinedDate ?
                        <Text
                            style={styles.conDes}>{this.getNameByType(item.type)} since {moment(item.joinedDate).format('MMMM D, Y')}
                        </Text>:
                        <Text style={styles.conDes}>{this.getNameByType(item.type)}</Text>
                    }
                </View>
                <View style={styles.radioBox}>
                    <Radio
                        color={"#3fb2fe"}
                        selectedColor={"#3fb2fe"}
                        selected={item.isConnected}
                        onPress={() => {
                            this.props.stayConnected(item)
                        }}
                    />
                </View>
            </TouchableOpacity>
        );
    };

    render() {
        if(this.props.isLoading) {
            return (<Loader/>)
        }

        return (
            <Container>
                <StatusBar
                    backgroundColor="transparent"
                    barStyle='dark-content'
                    translucent
                />
                <Content>
                    <Text
                        {...addTestID('New-pending-connection-header')}
                        style={styles.connectionTitle}>You Have New Pending Connections</Text>
                    <View style={styles.connectionList}>
                        <FlatList
                            {...addTestID('list-item')}
                            data={this.props.connections}
                            renderItem={this.renderListItem}
                            keyExtractor={item => item.connectionId}
                        />
                    </View>
                </Content>
                <View style={styles.greBtn}>
                    <GradientButton
                        testId = "continue"
                        onPress={this.props.navigateToChatList}
                        text="Continue"
                    />
                </View>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    contentBG: {
        backgroundColor: '#f7f9ff',
    },
    connectionTitle: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 24,
        lineHeight: 32,
        letterSpacing: 1,
        marginTop: 70,
        marginBottom: 40,
        textAlign: 'center'
    },
    connectionList: {},
    singleItem: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f5f5f5',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    avatarBox: {},
    avatarImg: {
        width: 48,
        height: 48,
        overflow: 'hidden',
        borderRadius: 30,
        marginRight: 16
    },
    textBox: {
        flex: 1
    },
    conName: {
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 0.3,
        marginBottom: 5
    },
    conDes: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13
    },
    radioBox: {
        marginRight: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#3fb2fe',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 4
    },
    greBtn: {
        paddingLeft: 24,
        paddingRight: 24,
        alignSelf: 'center',
        marginBottom: isIphoneX() ? 40 : 23
    },
    proBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetter: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
});
