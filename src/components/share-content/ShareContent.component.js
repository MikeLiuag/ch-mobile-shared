import React, {Component} from "react";
import {FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import {Button, Container, Content, Header} from "native-base";
import {DEFAULT_AVATAR_COLOR } from "../../constants";
import {EmptyContent} from "../EmptyContent";
import {SliderSearch} from "../slider-search";
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {addTestID, isIphoneX} from "../../utilities";
import LinearGradient from "react-native-linear-gradient";
import Loader from "../Loader";


export class ShareContentComponent extends Component<props> {
    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            showBack: true
        };
    }

    componentDidUpdate(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: SS): void {
        if (prevProps.data.length !== this.props.data.length) {
            this.setState({data: this.props.data});
        }
    }

    propagate = (data) => {
        this.setState({data});
    };

    clearSearch = () => {
        this.setState({data: this.props.data});
    };

    render() {
        if(this.props.isLoading) {
            return (<Loader/>)
        }
        return (
            <Container style={styles.container}>
                <Header
                    noShadow
                    transparent
                    style={styles.shareHeader}>
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="dark-content"
                        translucent
                    />
                    <SliderSearch
                        options={{
                            screenTitle: this.props.assigningSelf?'Assign Content':'Share Content',
                            searchFieldPlaceholder: this.props.educationSelected ? 'Search Connections' : 'Search Education Content',
                            listItems: this.props.data,
                            filter: (data, query) => {
                                const active = data.filter(item =>
                                    item.title
                                        .toLowerCase()
                                        .includes(query.toLowerCase().trim()),
                                );
                                return active;
                            },
                            showBack: this.state.showBack,
                            backClicked: this.props.goBack,
                        }}
                        propagate={this.propagate}/>
                </Header>
                <Content>
                    {this.state.data && this.state.data.length !== 0 ?
                        <FlatList
                            data={this.state.data}
                            style={styles.list}
                            renderItem={({item}) => {
                                return (
                                    <TouchableOpacity
                                        {...addTestID('education-selected')}
                                        activeOpacity={0.8}
                                        style={styles.singleItem}
                                    >
                                        {this.props.educationSelected && (
                                            <View style={styles.avatarContainer}>
                                                {item.avatar?
                                                    <Image
                                                        style={styles.avatarImage}
                                                        source={item.avatar}
                                                    />
                                                    :
                                                    <View style={{
                                                        ...styles.proBg,
                                                        backgroundColor: item.colorCode?item.colorCode:DEFAULT_AVATAR_COLOR
                                                    }}><Text
                                                        style={styles.proLetter}>{item.title.charAt(0).toUpperCase()}</Text></View>
                                                }
                                            </View>
                                        )}

                                        <View style={styles.contact}>
                                            <Text style={styles.contactUsername}>{item.title}</Text>
                                            <Text numberOfLines={2} style={styles.subText}>{item.subtitle}</Text>
                                        </View>
                                        <View style={styles.nextWrapper}>
                                            <LinearGradient
                                                start={{x: 0, y: 1}}
                                                end={{x: 1, y: 0}}
                                                colors={item.contentShared === true ? ["#f8f9fb", "#f8f9fb", "#f8f9fb"] : ["#4FACFE", "#34b6fe", "#00C8FE"]}
                                                style={styles.greButton}
                                            >
                                                <Button disabled={item.contentShared === true} transparent style={styles.nextBtn} onPress={() => {
                                                    this.props.shareContent(item)
                                                }}>
                                                    {item.contentShared === true ?
                                                        <Text
                                                            style={[styles.titleBoldText, {color: '#b3bec9'}]}>{this.props.assigningSelf?'ASSIGNED':'SHARED'}</Text>
                                                        :
                                                        <Text style={styles.titleBoldText}>{this.props.assigningSelf?'ASSIGN':'SHARE'}</Text>
                                                    }

                                                </Button>
                                            </LinearGradient>
                                        </View>

                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        /> :
                        <EmptyContent
                            message={this.props.educationSelected ? "No Active Connection Found" : "No Content to be shared"}/>
                    }

                </Content>
                {!this.props.assigningSelf && (
                    <View style={styles.educationInfo}>
                        <LinearGradient
                            start={{x: 0, y: 1}}
                            end={{x: 1, y: 0}}
                            colors={["#4FACFE", "#34b6fe", "#6078ea"]}
                            style={styles.eduGreBG}
                        >
                            <Text
                                style={styles.contentTitle}>{this.props.educationSelected ? "CONTENT TO BE SHARED" : "MEMBER TO SHARE WITH"}</Text>
                            <View style={[styles.singleItem, {borderRadius: 8, overflow: 'hidden'}]}>
                                <View style={styles.iconContainer}>

                                    {this.props.educationSelected ?
                                        <Image
                                            style={this.props.educationSelected ? styles.readIcon : [styles.readIcon, {
                                                borderRadius: 80,
                                                overflow: 'hidden'
                                            }]}
                                            resizeMode={'contain'}
                                            source={
                                                // this.props.dialog.contentAudio !== ''
                                                //     ? require('../../assets/images/read-listen-icon.png')
                                                //     : require('../../assets/images/reading-icon.png')
                                                this.props.selection.avatar
                                            }
                                        />
                                        :
                                        (this.props.selection.profilePicture ?
                                                <Image
                                                    style={this.props.educationSelected ? styles.readIcon : [styles.readIcon, {
                                                        borderRadius: 80,
                                                        overflow: 'hidden'
                                                    }]}
                                                    resizeMode={'contain'}
                                                    source={
                                                        // this.props.dialog.contentAudio !== ''
                                                        //     ? require('../../assets/images/read-listen-icon.png')
                                                        //     : require('../../assets/images/reading-icon.png')
                                                        this.props.selection.avatar
                                                    }
                                                />
                                                :
                                                <View style={{
                                                    ...styles.proBg,
                                                    backgroundColor: this.props.selection.colorCode ? this.props.selection.colorCode : DEFAULT_AVATAR_COLOR
                                                }}><Text
                                                    style={styles.proLetter}>{this.props.selection.title.charAt(0).toUpperCase()}</Text></View>
                                        )}
                                    {this.props.educationSelected && (<Text style={styles.durationText}>
                                        {this.props.selection.duration}
                                    </Text>)}
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={styles.mainText} numberOfLines={2}>{this.props.selection.title}</Text>
                                    <Text style={styles.subText} numberOfLines={2}>
                                        {this.props.selection.subtitle}
                                    </Text>
                                </View>
                                <View style={{justifyContent: 'center'}}>
                                    <Button transparent>
                                        <AwesomeIcon
                                            name='check-circle'
                                            size={22}
                                            color="#3fb2fe"
                                        />
                                    </Button>
                                </View>
                            </View>
                        </LinearGradient>
                    </View>
                )}


            </Container>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff'
    },
    shareHeader: {
        paddingLeft: 18,
        paddingRight: 18,
        borderBottomWidth: 0.5,
        borderBottomColor: '#DCDCDC'
    },
    list: {
        backgroundColor: '#FFF',
        paddingBottom: 20,
    },
    educationInfo: {
        height: '30%',
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        borderTopWidth: 0,
        overflow: 'hidden',
        maxHeight: isIphoneX() ? 200 : 180
    },
    eduGreBG: {
        paddingLeft: 24,
        paddingRight: 24,
        alignItems: 'center',
        flex: 1
    },
    singleItem: {
        flexDirection: 'row',
        borderBottomColor: '#f5f5f5',
        borderBottomWidth: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    titleBoldText: {
        fontSize: 13,
        color: '#fff',
        fontFamily: 'Roboto-Bold',
        letterSpacing: 0.7,
        fontWeight: '700'
    },
    contentTitle: {
        fontSize: 13,
        color: '#fff',
        fontFamily: 'Roboto-Bold',
        fontWeight: '700',
        marginTop: 16,
        marginBottom: 16
    },
    avatarContainer: {
        marginRight: 16,
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
        flex: 1,
        backgroundColor: "#fff",
        paddingRight: 20,
        justifyContent: 'center'
    },
    contactUsername: {
        fontFamily: "Roboto-Bold",
        fontSize: 15,
        lineHeight: 15,
        color: "#25345c",
        marginTop: 3
    },
    nextWrapper: {
        justifyContent: "center",
        width: 88,
    },
    greButton: {
        borderRadius: 4,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nextBtn: {
        height: 40
    },
    iconContainer: {
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 90
    },
    readIcon: {
        width: 50,
        height: 50,
    },
    durationText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        letterSpacing: 0.28,
        color: '#999',
        width: 'auto',
        textAlign: 'center'
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 5,
        paddingRight: 10
    },
    mainText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        letterSpacing: 0.28,
        color: '#25345c',
        fontWeight: '600',
        // width: 'auto',
    },
    subText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: '#969fa8',
        marginTop: 8
        // width: '90%',
    },

    proBg: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius: 25,
        //borderColor: "#4FACFE",
        //borderWidth: 2

    },
    proLetter: {
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        fontSize: 24,
        fontWeight: '600',
        textTransform: 'uppercase'
    },


});
