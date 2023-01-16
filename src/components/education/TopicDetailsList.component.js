import React, {Component} from 'react';
import {FlatList, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Dimensions} from 'react-native';
import {Button, Container} from 'native-base';
import {addTestID, defaultPageSize, isIphoneX,AlertUtil} from '../../utilities';
import {ContentfulClient} from '../../lib';
import {ContentLoader} from '../ContentLoader';
import {EmptyContent} from '../EmptyContent';
import AwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {InlineSearch} from '../inline-search';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
import Loader from "../Loader";

const width = Dimensions.get("window").width;
export class TopicDetailsListComponent extends Component<props> {
    constructor(props) {
        super(props);

        this.state = {
            topic: this.props.topic,
            contentList: [],
            skip: 0,
            hasMore: true,
            isSearching: false,
            searchQuery: '',
            isLoadingMore: false,
            isLoading: true,
            iconColor: '#fff',
            showBack: true,

        };
    }


    getReadCount = () => {
        let markAsCompleted = this.props.markAsCompleted;
        let readArticles = 0
        this.state.contentList.forEach(content =>{
            markAsCompleted.forEach(markContent =>{
                if(content.entryId === markContent.slug){
                    readArticles++;
                }
            })
        })
        return readArticles;

    }


    async componentWillMount() {
        console.log("Recommended = " + this.props.fromRecommendedContent);
        !this.props.fromRecommendedContent ? await this.getContentByTopic() : await this.getContentBySlug();

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.markAsCompleted && prevProps.markAsCompleted && this.props.fromRecommendedContent) {
            const currentCount = this.getRecommendedCount();
            if (prevState.recommendedCount !== currentCount) {
                if (currentCount > 0) {
                    this.getContentBySlug();
                }
            }
        }
    }

    getRecommendedCount = () => {
        let {markAsCompleted, assignedContent} = this.props;
        markAsCompleted = markAsCompleted.map(content => content.slug);
        let count = 0;
        assignedContent.assignedContent.forEach(content => {
            if (!markAsCompleted.includes(content.contentSlug)) {
                count++;
            }
        });
        return count;
    }


    getContentBySlug = async () => {
        this.setState({
            recommendedCount: this.getRecommendedCount()
        });
        try {
            const contentList = await Promise.all(this.props.assignedContent.assignedContent.map(async (content) => {
                let params = {
                    'content_type': 'educationalContent',
                    'sys.id': content.contentSlug,
                };
                const entries = await ContentfulClient.getEntries(params);
                if (entries && entries.total > 0) {
                    const entry = entries.items[0];
                    return {
                        title: entry.fields.title,
                        description: entry.fields.description,
                        entryId: entry.sys.id,
                        contentDuration: entry.fields.contentLengthduration,
                        contentAudio: entry.fields.contentAudio
                            ? entry.fields.contentAudio.fields.file.url
                            : '',
                        bookmarked: false,
                        markedAsCompleted: false,
                        fields: entry.fields,
                        sys: {
                            id: entry.sys.id
                        }
                    }
                }
            }));
            this.setState({
                ...this.state,
                contentList,
                skip: this.state.skip + contentList.length,
                hasMore: contentList.length >= defaultPageSize,
                isLoadingMore: false,
                isLoading: false,
            });
        }
        catch (error) {
            console.warn(error);
            AlertUtil.showErrorMessage('Unable to get data from contentful');
            this.setState({...this.state, isLoadingMore: false, isLoading: false});
        }
    }

    getContentByTopic = async () => {
        try {
            const contentList = [];
            if (this.props.topic.educationOrder) {
                this.props.topic.educationOrder.forEach(eduOrder => {
                    if (eduOrder.fields) {
                        contentList.push({
                            title: eduOrder.fields.title,
                            description: eduOrder.fields.description,
                            entryId: eduOrder.sys.id,
                            contentDuration: eduOrder.fields.contentLengthduration,
                            contentAudio: eduOrder.fields.contentAudio
                                ? eduOrder.fields.contentAudio.fields.file.url
                                : '',
                            bookmarked: false,
                            markedAsCompleted: false,
                        });

                    }
                })
            }

            this.setState({
                ...this.state,
                contentList: [
                    ...this.state.contentList,
                    ...contentList
                ],
                skip: this.state.skip + contentList.length,
                hasMore: contentList.length < defaultPageSize ? false : true,
                isLoadingMore: false,
                isLoading: false,
            });
        } catch (error) {
            console.warn(error);
            AlertUtil.showErrorMessage('Unable to get data from contentful.');
            this.setState({...this.state, isLoadingMore: false, isLoading: false});
        }
    };

    getPercentage = (read, total) => {
        if (total === 0) {
            return 0;
        } else {
            return read * 100 / total;
        }
    };


    render() {
        if (this.state.isLoading) {
            return <Loader/>
        }
        return (
            <Container style={styles.container}>
                <StatusBar
                    backgroundColor="transparent"
                    barStyle='light-content'
                    translucent
                />
                <View style={styles.searchWrapper}>
                    <InlineSearch
                        options={{
                            screenTitle: '',
                            searchFieldPlaceholder: 'Search Learning Library',
                            bookmarked: this.props.bookmarked ? this.props.bookmarked : [],
                            markedAsCompleted: this.props.markAsCompleted ? this.props.markAsCompleted : [],
                            searchType: 'ByTopic',
                            educationOrder: this.props.fromRecommendedContent?this.state.contentList:this.props.topic.educationOrder,
                            backClicked: this.props.backClicked,
                            iconColor: this.state.iconColor,
                            showBack: this.state.showBack,
                            openSelectedEducation: this.props.openSelectedEducation,
                        }}
                    />
                </View>
                <ScrollView
                    onScroll={({nativeEvent}) => {
                        // if (
                        //     isCloseToBottom(nativeEvent) &&
                        //     this.state.hasMore &&
                        //     this.state.isLoadingMore !== true
                        // ) {
                        //     !this.props.fromRecommendedContent ? this.getContentByTopic() : null;
                        // }
                    }}
                    showsVerticalScrollIndicator={false}
                    style={styles.contentWrapper}>
                    <View noShadow transparent style={styles.topicHeader}>
                        <View style={styles.imgBG}>
                            <Image
                                style={styles.greImage}
                                resizeMode={'cover'}
                                source={
                                    this.props.fromRecommendedContent ? require('../../assets/images/recommended-bg.png')
                                        :
                                        (this.state.topic.image
                                                ? {
                                                    uri: 'https:' + this.state.topic.image.fields.file.url,
                                                }
                                                : require('../../assets/images/general-topic-bg.png')
                                        )
                                }
                            />

                            <View style={{paddingLeft: 50, paddingRight: 50, zIndex: 40}}>
                                <Image
                                    style={styles.topIcon}
                                    resizeMode={'contain'}
                                    source={
                                        this.props.fromRecommendedContent ? require('../../assets/images/heart-ico.png')
                                            :
                                            (this.state.topic.icon
                                                    ? {
                                                        uri: 'https:' + this.state.topic.icon.fields.file.url,
                                                    }
                                                    : require('../../assets/images/general-icon.png')
                                            )
                                    }
                                />
                                <Text style={styles.largeText}>
                                    {this.props.fromRecommendedContent ? "Recommended for you" : (this.state.topic.name ? this.state.topic.name : '')}
                                </Text>
                                <Text style={styles.subHead} numberOfLines={4}>
                                    {this.props.fromRecommendedContent ? "These recommendations have been selected for you based on your conversations with Alfie and your providers" :
                                        (this.state.topic.description
                                            ? this.state.topic.description.content[0].content[0].value
                                            : '')}
                                </Text>


                                {this.props.fromRecommendedContent?

                                    <View style={styles.barWrapper}>
                                        <ProgressBarAnimated
                                            // style={{width: '100%'}}
                                            width={ width - 100}
                                            value={this.getPercentage(this.getReadCount(), this.state.contentList.length)}
                                            height={6}
                                            backgroundColor="#fff"
                                            borderRadius={0}
                                        />

                                        <View style={{
                                            marginTop: 8,
                                            marginBottom:40,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between'
                                        }}>

                                            <Text
                                                style={styles.completedText}>Completed</Text>
                                            <Text style={styles.lightText}>
                                                <Text
                                                    style={styles.boldText}>{this.getReadCount()}{' '}
                                                    of {this.state.contentList.length} </Text>
                                            </Text>
                                        </View>


                                    </View>
                                    :null}
                            </View>

                            {/*</LinearGradient>*/}
                        </View>
                    </View>
                    {this.state.isLoading ? (
                        <ContentLoader type="chat" numItems="12"/>
                    ) : this.state.contentList && this.state.contentList.length !== 0 ? (

                        <FlatList
                            data={this.state.contentList}
                            style={styles.list}
                            renderItem={({item, index}) => {
                                let isBookmarked = false;

                                this.props.bookmarked ?
                                    this.props.bookmarked
                                        .forEach(eachContent => {
                                            if (item.entryId === eachContent['slug']) {
                                                isBookmarked = true;
                                            }
                                        }) : null
                                let isCompleted = false;

                                this.props.markAsCompleted ?
                                    this.props.markAsCompleted
                                        .forEach(eachContent => {
                                            if (item.entryId === eachContent['slug']) {
                                                isCompleted = true;
                                            }
                                        }) : null

                                return (
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.singleItem}
                                        {...addTestID('education-content-' + (index+1))}
                                        onPress={() => {
                                            this.props.openSelectedEducation(item, item.entryId);
                                        }}>

                                        <View style={styles.iconContainer}>
                                            <Image
                                                style={styles.readIcon}
                                                resizeMode={'contain'}
                                                source={
                                                    item.contentAudio !== ''
                                                        ? require('../../assets/images/read-listen-icon.png')
                                                        : require('../../assets/images/reading-icon.png')
                                                }
                                            />
                                            {isCompleted ? (
                                                <View style={item.contentAudio !== '' ?
                                                    [styles.completedIcon, {right: 18}] : styles.completedIcon}>
                                                    <AwesomeIcon name="check" size={12} color="#FFF"/>
                                                </View>
                                            ) : null}
                                            <Text style={styles.mainText}>
                                                {item.contentDuration}
                                            </Text>
                                        </View>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.itemTitle}>{item.title}</Text>
                                            <Text style={styles.subText} numberOfLines={2}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        {isBookmarked ?
                                            <View style={styles.markWrapper}>
                                                <Button transparent style={styles.nextButton}>
                                                    <AwesomeIcon
                                                        name='bookmark'
                                                        size={20}
                                                        color="red"
                                                    />
                                                </Button>
                                            </View>
                                            : null}
                                    </TouchableOpacity>
                                );
                            }}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    ) : (
                        <View style={{padding: 10, backgroundColor: '#fff', zIndex: -1}}>
                            <EmptyContent message="No Education Material Found"/>
                        </View>
                    )}
                </ScrollView>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        marginTop: -5
    },
    contentWrapper: {
        zIndex: 50,
        // marginTop: isIphoneX()? MARGIN_X : 0
        marginTop: -130,
        width: '100%',
        paddingRight: 0,
        paddingLeft: 0
    },
    topicHeader: {
        backgroundColor: '#fff',
        // height: 440
    },
    gredientBG: {
        paddingTop: 100
    },
    imgBG: {
        paddingTop: 100,
        zIndex: -1
    },
    searchWrapper: {
        flexDirection: 'row',
        zIndex: 100,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: isIphoneX() ? 26 : 3
    },
    backBox: {
        flex: 0.5,
    },
    fieldBox: {
        flex: 2,
    },
    searchField: {
        color: '#FFF',
    },
    cancelBox: {
        flex: 0.5,
    },
    backBtn: {
        paddingLeft: 0,
    },
    backIcon: {
        color: '#FFF',
        fontSize: 35,
    },
    cancelBtn: {
        color: '#FFF',
        fontSize: 15,
        lineHeight: 19.5,
        fontFamily: 'Roboto-Regular',
    },
    searchBtn: {
        paddingRight: 0,
    },
    searchIcon: {
        color: '#FFF',
        fontSize: 22,
        transform: [{rotateZ: '90deg'}],
    },
    greImage: {
        flex: 1,
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '100%',
        // height: 440,
    },
    topIcon: {
        marginTop: 16,
        alignSelf: 'center',
        marginBottom: 16,
        width: 60,
        height: 60,
    },
    largeText: {
        fontSize: 24,
        lineHeight: 36,
        letterSpacing: 1,
        fontFamily: 'Roboto-Regular',
        textAlign: 'center',
        color: '#FFF',
        marginBottom: 16,
    },
    subHead: {
        fontFamily: 'Roboto-Regular',
        color: '#FFF',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 40,
    },
    titleMain: {
        color: '#25345C',
        fontFamily: 'Roboto-Regular',
        fontSize: 14,
        fontWeight: '500',
    },
    readStatus: {
        color: '#3CB1FD',
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        fontWeight: '500',
    },
    list: {
        backgroundColor: '#FFF',
        paddingBottom: 60,
    },
    singleItem: {
        flex: 1,
        flexDirection: 'row',
        borderColor: '#f5f5f5',
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 1,
        borderTopWidth: 0,
        padding: 24,
    },
    iconContainer: {
        paddingRight: 10,
        alignItems: 'center',
        maxWidth: 80
    },
    completedIcon: {
        position: 'absolute',
        right: 0,
        top: 0,
        borderColor: '#FFF',
        borderWidth: 4,
        width: 27,
        height: 27,
        borderRadius: 15,
        backgroundColor: '#3fb2fe',
        justifyContent: 'center',
        alignItems: 'center',
    },
    readIcon: {
        width: 50,
        height: 50,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingLeft: 10,
    },
    mainText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        letterSpacing: 0.28,
        color: '#999',
        width: 'auto',
        textAlign: 'center'
    },
    itemTitle: {
        color: '#25345c',
        fontFamily: 'Roboto-Bold',
        fontWeight: '600',
        fontSize: 14,
        letterSpacing: 0.28,
        lineHeight: 14,
        marginBottom: 8
    },
    subText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        lineHeight: 18,
        color: '#646c73',
        width: '90%',
    },
    markWrapper: {
        paddingTop: 10,
    },
    nextButton: {},
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
    barWrapper: {
        //paddingLeft: 10,
        //paddingRight: 10,
        //paddingBottom: 40,
    },
    completedText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Roboto-Bold',
        fontWeight: '500',
        fontStyle:'normal',
        lineHeight:15,
    },
    boldText: {
        color: '#fff',
        fontSize: 13,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'normal',
        fontStyle:'normal',
        lineHeight:15,
    },
});
