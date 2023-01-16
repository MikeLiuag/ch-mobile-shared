import React, {Component} from "react";
import {FlatList, Platform, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image} from "react-native";

import {Container, Content} from "native-base";
import {HEADER_NORMAL, HEADER_X, COLOR_ARRAY} from '../../constants';
import {addTestID, isIphoneX, getHeaderHeight} from "../../utilities";
import {ContentLoader} from "../ContentLoader";
import LinearGradient from "react-native-linear-gradient";
import {EmptyContent} from "../EmptyContent";
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import {InlineSearch} from "../inline-search";

const HEADER_SIZE = getHeaderHeight();

export class TopicListComponent extends Component<props> {


    static navigationOptions = {
        header: null,
    };

    constructor(props) {
        super(props);

        this.state = {
            iconColor: '#3fb2fe',
            showBack:true,
        };

        this.searchRef = null;
    }

    willBlur = ()=>{
        if (this.searchRef) {
            this.searchRef.cancelSearch();
        }
    };

    getReadArticlesCount = (item)=> {
        let count = 0;
        const readArticlesSlug = this.props.readArticles.map(entry =>entry.slug);
        item.educationOrder.forEach(eduOrder => {
            const index = readArticlesSlug.indexOf(eduOrder.sys.id);
            if(index>-1){
                count++;
            }
        })

        return count;
    }


    render() {

        return (
            <Container style={styles.container}>

                <StatusBar
                    backgroundColor={Platform.OS === 'ios'? null : "transparent"}
                    translucent
                    barStyle={'dark-content'}
                />
                <View
                    style={{
                        paddingTop: isIphoneX()? 22 : 0, zIndex: 100,
                        borderBottomWidth: 0.5, borderBottomColor: '#f5f5f5', paddingLeft: 0
                    }}>
                    <InlineSearch
                        ref={(ref) => {
                            this.searchRef = ref;
                        }}
                        options={{
                            screenTitle: this.props.categoryName,
                            searchFieldPlaceholder: 'Search Learning Library',
                            bookmarked: this.props.bookmarked ? this.props.bookmarked : [],
                            markedAsCompleted: this.props.readArticles ? this.props.readArticles : [],
                            searchType: 'byCategory',
                            category: this.props.category,
                            iconColor: this.state.iconColor,
                            backClicked: this.props.backClicked,
                            openSelectedEducation: this.props.openSelectedEducation,
                            showBack:this.state.showBack,
                        }}
                    />
                </View>

                <Content
                    style={{zIndex: 50}}>
                    {/* Topic List ---- Starts */}
                    {this.props.filteredItems && this.props.filteredItems.length !== 0 ? <View style={styles.titleBox}>
                        <Text style={styles.titleMain}>Education Topics</Text>
                    </View> : null
                    }
                    {this.props.isLoading ? (
                        <ContentLoader type="chat" numItems="12"/>
                    ) : (
                        this.props.filteredItems && this.props.filteredItems.length !== 0 ?
                            <FlatList
                                data={this.props.filteredItems}
                                style={styles.list}

                                renderItem={({item, index}) => {
                                    const readArticles = this.props.readArticles !== 0?this.getReadArticlesCount(item):0;

                                    return (
                                        <TouchableOpacity
                                            activeOpacity={0.8}
                                            style={styles.singleItem}
                                            {...addTestID('topic-item-' + (index+1))}
                                            onPress={() => {
                                                this.props.onTopicSelected(item)
                                            }}
                                        >
                                            <View style={styles.gredientBox}>
                                                <LinearGradient
                                                    style={styles.greBG}
                                                    start={{x: 0, y: 0}}
                                                    end={{x: 1, y: 1}}
                                                    colors={COLOR_ARRAY[index % COLOR_ARRAY.length]}
                                                >
                                                    <Image
                                                        style={styles.greImage}
                                                        resizeMode={'contain'}
                                                        source={
                                                            item.topicIcon ?
                                                                {
                                                                    uri:
                                                                        'https:' +
                                                                        item.topicIcon.fields.file.url
                                                                } :
                                                                require("../../assets/images/general-icon.png")
                                                        }/>
                                                </LinearGradient>
                                            </View>
                                            <View style={styles.textBox}>
                                                <Text style={styles.titleText} numberOfLines={2}>{item.topic}</Text>
                                                {item.totalArticles !== undefined && this.props.showReadInfo && (
                                                    <View style={styles.barWrapper}>
                                                        <ProgressBarAnimated
                                                            style={{width: '100%'}}
                                                            width={200}
                                                            value={this.getPercentage(readArticles, item.totalArticles)}
                                                            height={6}
                                                            backgroundColor="#3FB2FE"
                                                            borderRadius={0}
                                                        />

                                                        <View style={{
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>

                                                            <Text
                                                                style={styles.completedText}>{this.getPercentageText(readArticles, item.totalArticles)}</Text>
                                                            <Text style={styles.lightText}>
                                                                <Text
                                                                    style={styles.boldText}>{readArticles} of {item.totalArticles} </Text>
                                                                articles read
                                                            </Text>
                                                        </View>


                                                    </View>
                                                )}
                                                {item.totalArticles !== undefined && !this.props.showReadInfo && (
                                                    <View style={styles.barWrapper}>
                                                        <View style={{
                                                            marginTop: 5,
                                                            flexDirection: 'row',
                                                            justifyContent: 'space-between'
                                                        }}>
                                                            <Text
                                                                style={styles.completedText}>{item.totalArticles} total articles</Text>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    );

                                }}
                                keyExtractor={(item, index) => index.toString()}
                            /> :
                            <EmptyContent message="No Education Topics Found"/>
                    )}
                    {/* Topic List ---- Ends */}
                </Content>
            </Container>
        )
    };

    getPercentage = (read, total) => {
        if (total === 0) {
            return 0;
        } else {
            return read * 100 / total;
        }
    };

    getPercentageText = (read, total) => {
        return parseInt(this.getPercentage(read, total)) + '%';
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: '#FFF',
    },
    libraryHeader: {
        backgroundColor: "#fff",
        marginBottom: 0,
        borderBottomColor: "#DCDCDC",
        borderBottomWidth: 1,
        elevation: 0,
        height: HEADER_SIZE,
    },
    headerText: {
        color: "#30344D",
        fontFamily: "Roboto-Regular",
        fontWeight: "600",
        fontSize: 18,
        lineHeight: 24,
        letterSpacing: 0.3,
        marginBottom: 8,
        alignSelf: 'center'
    },
    searchField: {
        fontFamily: "Titillium-Web-Light",
        color: "#B3BEC9",
        fontSize: 14,
        fontWeight: "100",
        marginTop: 16,
        marginBottom: 10,
        marginLeft: 8,
        marginRight: 8,
        paddingLeft: 15,
        borderRadius: 4,
        borderColor: "#B7D2E5",
        backgroundColor: "#FFF"
    },
    searchIcon: {
        width: 18,
        height: 18,
        marginRight: 15
    },
    titleBox: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16,
        height: 59,
        alignItems: 'center'
    },
    titleMain: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.81,
        lineHeight: 21,
        paddingLeft: 10
    },
    readStatus: {
        color: '#3CB1FD',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        fontWeight: '500'
    },
    list: {
        borderColor: "#B7D2E5",
        paddingLeft: 24,
        paddingRight: 24
    },
    singleItem: {
        flex: 1,
        flexDirection: "row",
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#f5f5f5',
        marginBottom: 16,
        shadowColor: "#f5f5f5",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowRadius: 8,
        shadowOpacity: 1.0,
        elevation: 1
    },
    gredientBox: {},
    greBG: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center'
    },
    greImage: {
        width: 55,
        height: 55
    },
    textBox: {
        justifyContent: 'center',
        flex: 1
    },
    titleText: {
        color: '#25345c',
        fontSize: 16,
        letterSpacing: 0.32,
        lineHeight: 22,
        fontFamily: 'Roboto-Regular',
        padding: 16
    },
    barWrapper: {
        paddingLeft: 16,
        paddingRight: 16
    },
    completedText: {
        color: '#3fb2fe',
        fontSize: 12,
        fontFamily: 'Roboto-Bold'
    },
    boldText: {
        color: '#646c73',
        fontFamily: 'Roboto-Bold',
        fontSize: 12
    },
    lightText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13
    },
    avatarContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderColor: "#4FACFE",
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
        paddingTop: 2
    },
    avatarImage: {
        width: 25,
        height: 25,
    },
    stateGrey: {
        backgroundColor: "#EAEDF3",
        width: 14,
        height: 14,
        borderRadius: 10,
        position: "absolute",
        left: 55,
        top: 10,
        borderColor: "#fff",
        borderWidth: 1
    },
    contact: {
        // height: 60,
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10
    },
    contactUsername: {
        fontWeight: "500",
        fontFamily: "Roboto-Regular",
        fontSize: 14,
        color: "#25345C"
    },
    subText: {
        fontFamily: "OpenSans-Regular",
        fontSize: 12,
        color: "#25345C"
    },
    statusWrapper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "flex-end",
        paddingTop: 10
    },
    contentStatus: {
        fontWeight: "500",
        fontFamily: "Roboto-Regular",
        fontSize: 12,
        color: "#25345C"
    },
    nextButton: {
        width: 13,
        height: 20,
        marginLeft: 35,
        paddingLeft: 0,
        paddingTop: 0,
        marginTop: 5
    },
    launchIcon: {
        width: 12,
        height: 12,
        resizeMode: "contain"
    },
    loadersty: {
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(255, 255, 255, 0.8)'
    },
});
