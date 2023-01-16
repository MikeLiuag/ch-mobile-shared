import React, {Component} from "react";
import {StyleSheet, View, TouchableOpacity, Text, SectionList, Image, AppState} from "react-native";
import {Button, Icon, Segment} from "native-base";
import {addTestID, getAvatar} from "../../utilities";
import {CHATBOT_DEFAULT_AVATAR, DEFAULT_AVATAR_COLOR} from "../../constants";
import LottieView from "lottie-react-native";
import alfie from "../../assets/animations/Dog_with_phone_and_provider";

export class Connections extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            activeConnectionsVisible: this.props.activeConnectionsVisible,
            appState : AppState.currentState
        }
    }

    static getDerivedStateFromProps(props) {
        return {
            activeConnectionsVisible: props.activeConnectionsVisible,
            appState : AppState.currentState
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
    }

    renderListItem = ({item,index}) => {
        return (
            <TouchableOpacity
                {...addTestID('Navigate-to-connection')}
                activeOpacity={0.8}
                style={styles.singleItem}
                onPress={() => {
                    this.props.navigateToConnection(item);
                }}
            >

                <View style={styles.avatarContainer}>
                    {item.profilePicture ?
                        <Image
                            resizeMode={'cover'}
                            style={styles.avatarImage} source={{uri: getAvatar(item, this.props.S3_BUCKET_LINK)}}/>
                        :item.type==='CHAT_BOT'?(<Image
                                resizeMode={'cover'}
                                style={styles.avatarImage} source={{uri: CHATBOT_DEFAULT_AVATAR}}/>):
                            <View style={{
                                ...styles.proBg,
                                backgroundColor: item.colorCode ? item.colorCode : DEFAULT_AVATAR_COLOR
                            }}><Text style={styles.proLetter}>{item.name.charAt(0).toUpperCase()}</Text></View>
                    }
                </View>
                <View style={styles.contact}>
                    <Text style={styles.contactUsername} numberOfLines={2}>{item.name}</Text>
                    {
                        this.props.getConnectionSubText(item) && (
                            <Text style={styles.subText}>
                                {this.props.getConnectionSubText(item)}
                            </Text>
                        )
                    }
                </View>
                <View style={styles.nextWrapper}>
                    {/*<View style={styles.contactMetaWrapper}>*/}
                    {/*    {item.lastMessageTimestamp ? (*/}
                    {/*        <Text style={styles.lastMessageTimestamp}>*/}
                    {/*            {moment(item.lastMessageTimestamp).fromNow()}*/}
                    {/*        </Text>*/}
                    {/*    ) : null}*/}
                    {/*</View>*/}

                    {/*{*/}
                    {/*    item.lastMessageUnread ?*/}
                    {/*        <View style={styles.orangeDot}>*/}
                    {/*            <Text style={styles.unreadText}>1</Text>*/}
                    {/*        </View> : null*/}
                    {/*}*/}
                    <Button
                        {...addTestID('navigate-to-connection-btn')}
                        transparent style={styles.nextBtn} onPress={() => {
                        this.props.navigateToConnection(item)
                    }}>
                        <Icon type={"FontAwesome"} name="angle-right" style={styles.nextIcon}/>
                    </Button>
                </View>
            </TouchableOpacity>
        );
    };

    emptyState = () => {
        let emptyStateMsg = '';
        this.state.activeConnectionsVisible ?
            emptyStateMsg = 'You do not have any active connections right now. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.'
            :
            emptyStateMsg = 'You don’t have any past connections. Past connections are people, groups, or chatbots that you were previously connected to, but have disconnected from. If you don’t think this is right, you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.'

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
                {
                    this.state.activeConnectionsVisible ?
                        <Text style={styles.emptyTextMain}>You Have No Active Connections</Text>
                        :
                        <Text style={styles.emptyTextMain}>You Have No Past Connections</Text>
                }
                <Text style={styles.emptyTextDes}>{emptyStateMsg}</Text>
            </View>
        );
    }

    render() {
        return (
            <View style={styles.segmentItems}>
                <Segment style={styles.tabHead}>
                    <Button
                        {...addTestID('active-btn')}
                        first
                            active={this.state.activeConnectionsVisible}
                            onPress={() => {
                                this.setState({activeConnectionsVisible: true});
                                this.props.sectionChanged(true);
                            }}
                            style={[styles.firstBtn, {backgroundColor: this.state.activeConnectionsVisible ? '#515d7d' : '#FFF'}]}>
                        <Text
                            style={[styles.tabTitle, {color: this.state.activeConnectionsVisible ? '#fff' : '#515d7d'}]}>Active</Text>
                    </Button>
                    <Button
                        {...addTestID('past-btn')}
                        last
                            active={!this.state.activeConnectionsVisible}
                            onPress={() => {
                                this.setState({activeConnectionsVisible: false});
                                this.props.sectionChanged(false);
                            }}
                            style={[styles.pastBtn, {backgroundColor: !this.state.activeConnectionsVisible ? '#515d7d' : '#FFF'}]}>
                        <Text
                            style={[styles.tabTitle, {color: !this.state.activeConnectionsVisible ? '#fff' : '#515d7d'}]}>Past</Text>
                    </Button>
                </Segment>

                <SectionList
                    {...addTestID('active-list-items')}
                    sections={this.props.activeSections}
                    keyExtractor={(item, index) => item + index}
                    renderItem={this.renderListItem}
                    stickySectionHeadersEnabled={false}
                    renderSectionHeader={({section: {title, count}}) => (
                        <View
                            style={styles.headRow}>
                            <Text style={styles.ListTitle}>{title}</Text>
                            <Text style={styles.listCount}>{count}</Text>
                        </View>
                    )}
                    ListEmptyComponent={this.emptyState}
                    contentContainerStyle={{ paddingBottom: 70}}
                />
            </View>
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
        alignSelf: 'center',
        marginBottom: 30,
        paddingLeft: 20
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
    tabHead: {
        backgroundColor: 'transparent',
        width: '92%',
        alignSelf: 'center',
        paddingBottom: 24,
        alignItems: 'flex-start',
        height: 60
    },
    segmentItems: {
        // paddingBottom: isIphoneX()? 20: 0,
        flex: 1
    },
    firstBtn: {
        borderColor: '#515d7d',
        borderWidth: 1,
        width: '40%',
        minWidth: 140,
        borderRadius: 50,
        marginRight: 15,
        borderTopLeftRadius: 50,
        borderBottomLeftRadius: 50,
        justifyContent: 'center',
        height: 32,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
    },
    pastBtn: {
        borderColor: '#515d7d',
        borderWidth: 1,
        borderLeftWidth: 1,
        width: '40%',
        minWidth: 140,
        borderRadius: 50,
        borderTopRightRadius: 50,
        borderBottomRightRadius: 50,
        justifyContent: 'center',
        height: 32,
        shadowColor: 'rgba(0,0,0,0.07)',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
    },
    tabTitle: {
        color: '#515d7d',
        fontSize: 14,
        lineHeight: 16,
        letterSpacing: 0.54,
        fontFamily: 'Roboto-Bold',
        fontWeight: '600'
    },
    headRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        height: 40,
        paddingRight: 16,
        paddingLeft: 16,
        backgroundColor: '#f7f9ff',
        borderTopColor: '#f5f5f5',
        borderTopWidth: 0.5
    },
    ListTitle: {
        fontFamily: 'Roboto-Bold',
        color: '#515d7d',
        fontSize: 12,
        fontWeight: '500',
        letterSpacing: 0.46,
        lineHeight: 12,
        textTransform: 'uppercase'
    },
    listCount: {
        fontFamily: 'Roboto-Bold',
        color: '#969fa8',
        fontSize: 12,
        lineHeight: 23,
        width: 24,
        height: 24,
        borderRadius: 13,
        backgroundColor: '#fff',
        borderWidth: 1,
        textAlign: 'center',
        borderColor: 'rgba(0,0,0,0.1)',
        overflow: 'hidden'
    },
    singleItem: {
        flex: 1,
        flexDirection: "row",
        borderColor: "#EEE",
        borderWidth: 0.5,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        alignItems: 'center'
    },
    avatarContainer: {
        // height: 60,
        width: 80,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    avatarImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: "#4FACFE",
        borderWidth: 2
    },
    contact: {
        // height: 60,
        flex: 1,
        backgroundColor: "#fff",
        // paddingTop: 10
    },
    contactUsername: {
        fontFamily: "Roboto-Bold",
        fontSize: 15,
        lineHeight: 15,
        color: "#25345c",
        letterSpacing: 0.3,
        marginBottom: 3
        // marginTop: 3
    },
    subText: {
        fontFamily: "Roboto-Regular",
        fontSize: 13,
        lineHeight: 19,
        color: "#969fa8",
        letterSpacing: 0,
        textTransform: 'capitalize'
    },
    nextWrapper: {
        height: 60,
        justifyContent: "center"
    },
    nextBtn: {
        paddingRight: 0
    },
    nextIcon: {
        fontSize: 32,
        color: '#3fb2fe',
        marginRight: 5
    },
    contactMetaWrapper: {
        marginLeft: 15,
        marginRight: 8,
    },
    lastMessageTimestamp: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#b3bec9',
        letterSpacing: 0,
        lineHeight: 12
    },
    orangeDot: {
        width: 25,
        height: 25,
        backgroundColor: '#ff7f05',
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        marginRight: 5
    },
    unreadText: {
        color: '#fff',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 13,
        letterSpacing: 0.26
    },
    proBg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },
    proLetter: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },
});

