import React, {Component} from 'react';
import {Image, Platform, SectionList, StatusBar, StyleSheet, TouchableOpacity, View,} from 'react-native';
import {CheckBox, Container, Content, Header, Text} from 'native-base';
import {getAvatar, isIphoneX,addTestID, getHeaderHeight} from '../../utilities';
import {SliderSearch} from '../slider-search'
import GradientButton from './../GradientButton';
import {HEADER_NORMAL, HEADER_X,DEFAULT_AVATAR_COLOR} from '../../constants';
import moment from 'moment';
import Loader from './../Loader';

const HEADER_SIZE = getHeaderHeight();

export class AddMembersComponent extends Component<Props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            nameFocus: false,
            selectedConnections: [],
            connections: this.props.connections
        };
    }

    getSections = () => {
        let connections = this.state.connections;
        const filteredConnections = {
            providers: connections.filter(
                connection => connection.type === 'PRACTITIONER',
            ),
            members: connections.filter(connection => connection.type === 'PATIENT'),
            matchmakers: connections.filter(connection => connection.type === 'MATCH_MAKER'),
        };
        const activeSections = [];
        if (filteredConnections.providers.length > 0) {
            activeSections.push({
                title: 'PROVIDERS',
                count: filteredConnections.providers.length,
                data: filteredConnections.providers,
            });
        }
        if (filteredConnections.matchmakers.length > 0) {
            activeSections.push({
                title: 'MATCH MAKERS',
                count: filteredConnections.matchmakers.length,
                data: filteredConnections.matchmakers,
            });
        }
        if (filteredConnections.members.length > 0) {
            activeSections.push({
                title: 'MEMBERS',
                count: filteredConnections.members.length,
                data: filteredConnections.members,
            });
        }
        return activeSections;
    };

    propagate = (connections)=>{
        this.setState({connections});
    }

    selectConnection = (item)=>{
        let {selectedConnections}=this.state;
        if(selectedConnections.includes(item.connectionId)) {
            selectedConnections = selectedConnections.filter(conId=>conId!==item.connectionId);
        }else {
            selectedConnections.push(item.connectionId);
        }
        this.setState({selectedConnections});
    };


    render() {
        return(
            <Container>
                <Header transparent style={styles.header}>
                    <StatusBar
                        backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                        translucent
                        barStyle={'dark-content'}
                    />
                    <SliderSearch
                        options={{
                            screenTitle: 'Group Members',
                            searchFieldPlaceholder: 'Search Connections',
                            backClicked: this.props.goBack,
                            showBack: true,
                            isDrawer: false,
                            listItems: this.props.connections,
                            filter: (connections, query) => {
                                const active = connections.filter(connection =>
                                    connection.name
                                        .toLowerCase()
                                        .includes(query.toLowerCase().trim()),
                                );
                                return active;
                            },
                        }}
                        propagate={this.propagate}
                    />
                </Header>
                <Content>

                    <SectionList
                        {...addTestID('get-connection')}
                        sections={this.getSections()}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item, index }) =>
                            <TouchableOpacity>
                                <TouchableOpacity
                                    {...addTestID('connections - ', (index+1))}
                                    activeOpacity={0.8}
                                    style={styles.singleItem}
                                    onPress={() => {
                                        this.selectConnection(item);
                                    }}>
                                    <View style={styles.avatarContainer}>
                                        {item.profilePicture?
                                            <Image
                                                {...addTestID('avatar-image - ' + (index+1))}
                                                style={styles.avatarImage} source={{uri: getAvatar(item)}} />
                                            :
                                            <View style={{
                                                ...styles.proBgMain,
                                                backgroundColor: item.colorCode?item.colorCode:DEFAULT_AVATAR_COLOR
                                            }}><Text
                                                style={styles.proLetterMain}>{item.name.charAt(0).toUpperCase()}</Text></View>
                                        }
                                    </View>


                                    <View style={styles.contact}>
                                        <Text style={styles.contactUsername} numberOfLines={2}>{item.name}</Text>
                                        <Text style={styles.subText} numberOfLines={1}>
                                            {item.lastModified?'Connected Since ' +
                                                moment(item.lastModified).format('MMM YYYY')
                                                :''}

                                        </Text>
                                    </View>
                                    <View style={styles.checkWrapper}>
                                        <CheckBox onPress={()=>{this.selectConnection(item)}} checked={this.state.selectedConnections.includes(item.connectionId)} color="#3fb2fe"/>
                                    </View>
                                </TouchableOpacity>
                            </TouchableOpacity>
                        }
                        renderSectionHeader={({section: {title,count}}) => (
                            <View style={styles.headRow}>
                                <Text style={styles.ListTitle}>{title}</Text>
                                <Text style={styles.listCount}>{count}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text style={styles.emptyTextDes}>No Connections Found</Text>}
                    />
                </Content>
                <View style={styles.greBtn}>
                    <GradientButton
                        testId = "add-member"
                        disabled={this.state.selectedConnections.length===0}
                        onPress={() => {
                            this.createGroup();
                        }}
                        text={this.props.editMode?"Add Members":"Create Group"}
                    />
                </View>
                {this.props.isLoading && (
                    <Loader/>
                )}
            </Container>
        );
    };

    createGroup = ()=>{
        this.props.createGroup(this.state.selectedConnections);
    };
}

const styles = StyleSheet.create({
    header: {
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        backgroundColor: '#fff',
        elevation: 0,
        justifyContent: 'flex-start',
        height: HEADER_SIZE,
        paddingTop: 15,
        paddingLeft: 18,
        paddingRight: 18
    },
    backButton: {
        marginLeft: 15,
        width: 35
    },
    groupTitle: {
        textAlign: 'center',
        color: '#25345c',
        fontFamily: 'Roboto-Regular',
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3,
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
        textAlign: 'center',
        marginTop: 24
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
        textTransform: 'uppercase',
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
        overflow: 'hidden',
    },
    singleItem: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#EEE',
        borderWidth: 0.5,
        paddingRight: 15,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatarContainer: {
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    avatarImage: {
        width: 48,
        height: 48,
        borderRadius: 25,
        borderColor: '#4FACFE',
        borderWidth: 1,
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
    contact: {
        flex: 2
    },
    contactUsername: {
        fontFamily: 'Roboto-Bold',
        fontSize: 14,
        lineHeight: 15,
        letterSpacing: 0.3,
        color: '#25345c',
        fontWeight: '600'
    },
    subText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 19,
        color: '#969fa8',
        letterSpacing: 0
    },
    checkWrapper: {
        paddingRight: 15
    },
    greBtn: {
        padding: 24,
        paddingBottom: isIphoneX()? 36 : 24
    }
});
