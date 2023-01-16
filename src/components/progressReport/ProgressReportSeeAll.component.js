import React, {Component} from 'react';
import {
    ActivityIndicator,
    Image,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {Body, Button, Container, Content, Header, Left, Text} from 'native-base';
import Icon from 'react-native-vector-icons/Feather';
import LottieView from 'lottie-react-native';
import teamAnim from '../../assets/animations/Dog_with_Computer';
import moment from 'moment/moment';
import Loader from '../Loader';
import {
    addTestID,
    defaultPageSize,
    getDurationText,
    getHeaderHeight,
    isCloseToBottom,
    isIphoneX,
    valueExists
} from '../../utilities';
import {Colors, CommonStyles, TextStyles} from '../../styles';
import {BackButton} from "../BackButton";
import {CommonSegmentHeader} from "../CommonSegmentHeader";
import {SingleCheckListItem} from "../SingleCheckListItem";
import {DatePicker} from 'react-native-wheel-pick';
import Modal from 'react-native-modalbox';
import {ContentfulClient} from "../../lib";
import {PrimaryButton} from "../PrimaryButton";
import {ACTIVITY_ACTION_TYPES} from "../../constants";
import alfie from "../../../src/assets/animations/Dog_with_Can.json";

const HEADER_SIZE = getHeaderHeight();


const isIos = Platform.OS === 'ios'

export class ProgressReportSeeAllComponent extends Component<props> {
    constructor(props) {
        super(props);
        this.callbackKey = 'ProgressReportSeeAllComponent';
        this.state = {
            isLoading: this.props.section === 'RECENT_ACTIVITY' || this.props.section === 'ASSIGNED_CONTENT' || this.props.section === "OUTCOMES" || this.props.section === 'RISK_TAGS' || this.props.section === "DCT_ATTEMPTS",
            hasMore: this.props.section === 'RECENT_ACTIVITY' || this.props.section === 'ASSIGNED_CONTENT' || this.props.section === "OUTCOMES" || this.props.section === 'RISK_TAGS' || this.props.section === "DCT_ATTEMPTS",
            isLoadingMore: null,
            pageNumber: 0,
            isError: false,
            recentActivity: [],
            assignedContent: [],
            outcomesCompleted: [],
            riskTag: [],
            dctAttempts: [],
            scorable: false,
            dctTitle: null,
            isModalVisible: false,
            selectedActivity: null,
            infoModalOpen: false,
        };

    }

    infoDrawerClose = () => {
        this.setState({infoModalOpen: false});
    };

    filterDrawerClose = () => {
        this.refs.modalFilterView.close();
    };

    componentDidMount(): void {
        this.loadProgressReport(false);
        if (this.props.section === 'ASSIGNED_CONTENT' && this.props.addNotificationCallback) {
            this.props.addNotificationCallback('CONTENT_ASSIGNED', this.callbackKey, () => {
                this.loadAssignedContent(false);
            });
        }
    }

    loadProgressReport = (loadMore) => {
        if (this.props.section === 'RECENT_ACTIVITY') {
            this.loadRecentActivity(loadMore);
        }
        if (this.props.section === 'OUTCOMES') {
            this.loadOutcomesCompleted(loadMore);
        }
        if (this.props.section === 'ASSIGNED_CONTENT') {
            this.loadAssignedContent(loadMore);
        }
        if (this.props.section === 'DCT_ATTEMPTS') {
            this.loadDCTAttempts(loadMore);
        }
        if (this.props.section === 'RISK_TAGS') {
            this.loadRiskTag(loadMore);
        }
    };
    loadDCTAttempts = async loadMore => {
        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }
            const dctAttemptResult = await this.props.getDCTCompletionList(
                this.props.data.userId,
                this.props.data.dctId,
                this.state.pageNumber,
                defaultPageSize,
            );

            if (dctAttemptResult.errors) {
                this.setState({
                    isLoading: false,
                    isError: dctAttemptResult.errors[0],
                });
            } else {
                this.setState({
                    dctAttempts: [
                        ...this.state.dctAttempts,
                        ...dctAttemptResult.DCTCompletionsList,
                    ],
                    pageNumber: this.state.pageNumber + 1,
                    hasMore:
                        dctAttemptResult.DCTCompletionsList.length >= defaultPageSize,
                    dctTitle: dctAttemptResult.dctTitle,
                    scorable: dctAttemptResult.scorable,
                    isLoadingMore: null,
                    isLoading: false,
                    isError: false,
                });
            }
        } catch (error) {
            console.log('Unable to get DCT attempts Outcomes...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };

    load = async loadMore => {
        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }

            const outcomesCompleted = await this.props.getUserActivity(
                this.props.userId,
                this.state.pageNumber,
                defaultPageSize,
            );

            if (outcomesCompleted.errors) {
                this.setState({
                    isLoading: false,
                    isError: outcomesCompleted.errors[0],
                });
            } else {
                this.setState({
                    outcomesCompleted: [
                        ...this.state.outcomesCompleted,
                        ...outcomesCompleted.outcomeCompleted.outcomeCompletedList,
                    ],
                    pageNumber: this.state.pageNumber + 1,
                    hasMore:
                        outcomesCompleted.outcomeCompleted.length >= defaultPageSize,
                    isLoadingMore: null,
                    isLoading: false,
                    isError: false,
                });
            }
        } catch (error) {
            //AlertUtil.showErrorMessage('Unable to get Completed Outcomes...');
            console.log('Unable to get Completed Outcomes...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };

    loadOutcomesCompleted = async loadMore => {
        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }

            const outcomesCompleted = await this.props.getUserActivity(
                this.props.userId,
                this.state.pageNumber,
                defaultPageSize,
            );

            if (outcomesCompleted.errors) {
                this.setState({
                    isLoading: false,
                    isError: outcomesCompleted.errors[0],
                });
            } else {
                this.setState({
                    outcomesCompleted: [
                        ...this.state.outcomesCompleted,
                        ...outcomesCompleted.outcomeCompleted.outcomeCompletedList,
                    ],
                    pageNumber: this.state.pageNumber + 1,
                    hasMore:
                        outcomesCompleted.outcomeCompleted.length >= defaultPageSize,
                    isLoadingMore: null,
                    isLoading: false,
                    isError: false,
                });
            }
        } catch (error) {
            console.log('Unable to get Completed Outcomes...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };

    loadRiskTag = async loadMore => {
        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }

            const riskTagResponse = await this.props.getUserActivity(
                this.props.userId,
                this.state.pageNumber,
                defaultPageSize,
            );

            if (riskTagResponse.errors) {
                this.setState({
                    isLoading: false,
                    isError: riskTagResponse.errors[0],
                });
            } else {
                this.setState({
                    riskTag: [
                        ...this.state.riskTag,
                        ...riskTagResponse.riskTags.riskTagList,
                    ],
                    pageNumber: this.state.pageNumber + 1,
                    hasMore:
                        riskTagResponse.riskTags.totalRiskTags.length >= defaultPageSize,
                    isLoadingMore: null,
                    isLoading: false,
                    isError: false,
                });
            }
        } catch (error) {
            console.log('Unable to get Risk tags...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };

    updateContentTitles = async (contentActivityList) => {
        return Promise.all(contentActivityList.map(activity => {
            return this.getContentTitle(activity).then(title => {
                activity.referenceText = title;
            });
        }));
    };

    getContentTitle = (activity) => {
        const slugContent = activity.referenceText;
        let params = {
            'content_type': 'educationalContent',
            'sys.id': slugContent,
        };
        return ContentfulClient.getEntries(params).then(entries => {
            if (entries && entries.total > 0) {
                return entries.items[0].fields.title;
            }
        });
    };

    loadRecentActivity = async loadMore => {
        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }

            const recentActivity = await this.props.getUserActivity(
                this.props.userId,
                this.state.pageNumber,
                defaultPageSize,
            );

            if (recentActivity.errors) {
                this.setState({
                    isLoading: false,
                    isError: recentActivity.errors[0],
                });
            } else {

                const contentActivities = recentActivity.recentActivities.filter(activity => activity.activityType === 'CONTENT');
                if (contentActivities && contentActivities.length > 0) {
                    await this.updateContentTitles(contentActivities);
                }

                this.setState({
                    recentActivity: [
                        ...this.state.recentActivity,
                        ...recentActivity.recentActivities,
                    ],
                    pageNumber: this.state.pageNumber + 1,
                    hasMore:
                        recentActivity.recentActivities.length >= defaultPageSize,
                    isLoadingMore: null,
                    isLoading: false,
                    isError: false,
                });
            }
        } catch (error) {
            //AlertUtil.showErrorMessage('Unable to get recent activities...');
            console.log('Unable to get recent activities...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };

    componentWillUnmount(): void {
        if (this.props.removeNotificationCallback) {
            this.props.removeNotificationCallback('CONTENT_ASSIGNED', this.callbackKey);
        }
    }

    loadAssignedContent = async loadMore => {

        try {
            if (loadMore) {
                this.setState({isLoadingMore: true});
            } else {
                this.setState({isLoading: true});
            }
            let assignedContent;
            if (this.props.isProviderApp) {
                assignedContent = await this.props.getAssignedContent(
                    this.props.userId,
                    this.state.pageNumber,
                    defaultPageSize,
                );
            } else {
                assignedContent = await this.props.getAssignedContent(
                    this.state.pageNumber,
                    defaultPageSize,
                );
            }
            if (assignedContent.errors) {
                this.setState({
                    isLoading: false,
                    isError: assignedContent.errors[0],
                });
            } else {
                Promise.all(assignedContent.assignedContent.map(async content => {
                    let params = {
                        'content_type': 'educationalContent',
                        'sys.id': content.contentSlug
                    };
                    const entries = await ContentfulClient.getEntries(params);
                    if (entries && entries.total > 0) {
                        content.title = entries.items[0].fields.title;
                    }
                    return content;
                })).then((data) => {
                    this.setState({
                        assignedContent: [
                            ...this.state.assignedContent,
                            ...data,
                        ],
                        pageNumber: this.state.pageNumber + 1,
                        hasMore: false,
                        isLoadingMore: null,
                        isLoading: false,
                        isError: false,
                    });
                })
            }
        } catch (error) {
            //AlertUtil.showErrorMessage('Unable to get recent activities...');
            console.log('Unable to get Assigned Content...' + error);
            this.setState({isLoadingMore: false, isLoading: false, hasMore: false});
        }
    };


    isIsoDate = str => {
        if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
        var d = new Date(str);
        return d.toISOString() === str;
    };

    getFormattedActivity = (desc, ref) => {
        if (this.isIsoDate(ref)) {
            ref = moment(ref).format('MMMM D, Y');
        }
        return desc.replace('%s', ref);
    };

    getRecentActivity = () => {
        if (this.state.recentActivity && this.state.recentActivity.length > 0) {
            return this.state.recentActivity.map((activity, i) => {
                let iconType = 'activity';
                if (activity.activityType === 'LOGIN') {
                    iconType = 'log-in';
                } else if (activity.activityType === 'CONTENT') {
                    iconType = 'book-open';
                } else if (activity.activityType === 'CONVERSATION') {
                    iconType = 'message-circle';
                } else if (activity.activityType === 'DCT') {
                    iconType = 'pie-chart';
                }
                return (
                    <View key={i} style={styles.wholeList}>
                        <View style={styles.singleEntry}>
                            <View style={[styles.iconSide, {backgroundColor: Colors.colors.primaryColorBG}]}>
                                <Icon name={iconType} size={24} color={Colors.colors.primaryIcon}/>
                            </View>
                            <View style={styles.textBox}>
                                <Text style={styles.duskText} numberOfLines={2}>
                                    {this.getFormattedActivity(
                                        activity.activityDescription,
                                        activity.referenceText,
                                    )}
                                </Text>
                                <Text style={styles.timeText}>
                                    {activity.activityTimeDifference}
                                </Text>
                            </View>
                            {activity.reference !== null &&
                            <View style={{justifyContent: 'center'}}>
                                <Button transparent style={styles.infoButton}
                                        onPress={() => {
                                            this.recentActivityDetailModal(activity)
                                        }}>
                                    <Icon name="info" size={24} color={Colors.colors.primaryIcon}/>
                                </Button>
                            </View>
                            }
                        </View>
                    </View>
                );
            });
        } else {
            let emptyStateHead = 'No activity';
            let emptyStateMsg = 'You have no recent activity. If you don’t think this is right, ' +
                ' you can let us know by emailing help@confidanthealth.com and we’ll check it out for you.';
            return (
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
                    <Text style={styles.emptyTextMain}>{emptyStateHead}</Text>
                    <Text style={styles.emptyTextDes}>{emptyStateMsg}</Text>
                </View>
            );
        }
    };

    getAssignedContent = () => {
        return this.state.assignedContent.map((content, i) => {
            return (
                <View key={i} style={styles.wholeList}>
                    <View style={styles.singleEntry}>
                        <View style={[styles.iconSide, {backgroundColor: Colors.colors.successBG}]}>
                            <Icon name={'book'} size={24} color={Colors.colors.successIcon}/>
                        </View>
                        <View style={styles.textBox}>
                            <View
                                style={styles.activityText}>
                                <Text style={styles.duskBold} numberOfLines={1}>{content.title}</Text>
                                {this.props.isProviderApp ? null :
                                    (
                                        <Text style={styles.slateText}>assigned by
                                            {' '}<Text style={styles.duskBold}>{content.assigneeName}</Text>
                                        </Text>
                                    )}
                            </View>
                        </View>
                        <Text style={styles.timeText}>
                            {content.timeDifference}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    getOutcomes = () => {
        return this.state.outcomesCompleted.map((outcome, i) => {
            return (
                <TouchableOpacity
                    {...addTestID('dct-clicked')}
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.dctClicked(outcome.refId, outcome.scorable)
                    }}
                >
                    <View key={i} style={styles.wholeList}>
                        <View style={styles.singleEntry}>
                            <View style={[styles.colorSide, {backgroundColor: outcome.colorCode}]}>
                                <Text style={styles.largeText}>{outcome.latestDCTScore}</Text>
                                <Text style={styles.smallText}>{outcome.differenceDCTScore}</Text>
                            </View>
                            <View style={styles.textBox}>
                                <Text
                                    style={[styles.duskText, {paddingLeft: 16}]}
                                    numberOfLines={2}>
                                    {outcome.title}
                                </Text>
                            </View>
                            <Button transparent style={styles.nextButton} onPress={() => {
                                this.props.dctClicked(outcome.refId)
                            }}>
                                <Icon name="arrow-right" size={32} color="#3fb2fe"/>
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    getDCTAttempts = () => {
        return this.state.dctAttempts.map((dctAttempt, i) => {
            return (
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.8}
                    onPress={() => {
                        this.props.dctAttemptClicked(this.props.data.userId, this.props.data.dctId, dctAttempt.refId, dctAttempt.score, this.state.dctTitle, dctAttempt.dctCompletionDate, dctAttempt.colorCode, this.state.scorable)
                    }}>
                    <View key={i} style={styles.wholeList}>
                        <View style={styles.singleEntry}>
                            <View style={[styles.colorSide, {backgroundColor: dctAttempt.colorCode}]}>
                                <Text style={styles.largeText}>{dctAttempt.score}</Text>
                            </View>
                            <View style={styles.textBox}>
                                <Text
                                    style={[styles.duskText, {paddingLeft: 16}]}
                                    numberOfLines={2}>
                                    {moment(dctAttempt.dctCompletionDate).format(
                                        'MMMM D, Y',
                                    )}
                                </Text>
                            </View>
                            <Button
                                {...addTestID('dct-attempt-clicked-btn')}
                                transparent style={styles.nextButton}
                                onPress={() => {
                                    this.props.dctAttemptClicked(this.props.data.userId, this.props.data.dctId, dctAttempt.refId, dctAttempt.score, this.state.dctTitle, dctAttempt.dctCompletionDate)
                                }}>
                                <Icon name="angle-right" size={32} color="#3fb2fe"/>
                            </Button>
                        </View>
                    </View>
                </TouchableOpacity>
            );
        });
    };

    getRiskTags = () => {
        return this.state.riskTag.map((riskTagObject, i) => {
            return (
                <View key={i} style={styles.wholeList}>
                    <View style={styles.singleEntry}>
                        <View style={styles.riskBorderBox}>
                            <Text style={styles.riskText} numberOfLines={2}>
                                {riskTagObject.title}
                            </Text>
                        </View>
                        {/*  <Button transparent style={styles.nextButton}>*/}
                        {/*    <Icon name="angle-right" size={32} color="#3fb2fe"/>*/}
                        {/*</Button>*/}
                    </View>
                </View>
            );
        });
    };

    recentActivityDetailModal = (activity) => {
        this.setState({infoModalOpen: true, selectedActivity: activity});
    };

    renderActivityLog = () => {
        const {selectedActivity} = this.state;
        return (

            <View>
                {valueExists(selectedActivity?.activityActionType) &&

                <Text style={styles.activitymodalTitle}>
                    {ACTIVITY_ACTION_TYPES[selectedActivity?.activityActionType]}
                </Text>

                }
                <Text
                    style={styles.activitymodalSubTitle}>
                    {moment(selectedActivity?.activityTime)
                        .format("MMMM DD, yyyy hh:mm")}
                </Text>

                <View style={styles.infoList}>
                    {valueExists(selectedActivity?.activityDetail.serviceName)
                    && valueExists(selectedActivity?.activityDetail.serviceDuration) &&
                    <View style={styles.singleInfo}>

                        <Text style={styles.infoDarkText}>
                            {selectedActivity?.activityDetail.serviceName}
                        </Text>

                        {selectedActivity?.activityDetail.serviceDuration !== 0 &&
                        <Text style={styles.infoGreyText}>
                            {getDurationText(selectedActivity?.activityDetail.serviceDuration)} session
                        </Text>
                        }

                    </View>
                    }
                    {valueExists(selectedActivity?.activityDetail.startText)
                    && valueExists(selectedActivity?.activityDetail.endText) &&
                    <View style={styles.singleInfo}>

                        <Text style={styles.infoDarkText}>
                            {moment(selectedActivity?.activityDetail.startText).format("MMMM DD, yyyy")}
                        </Text>

                        <Text style={styles.infoGreyText}>
                            {moment(selectedActivity?.activityDetail.startText).format('h:mm a')} -
                            {moment(selectedActivity?.activityDetail.endText).format('h:mm a')}
                        </Text>

                    </View>
                    }

                    <View style={{...styles.singleInfo, flexDirection: 'row'}}>
                        {selectedActivity?.activityDetail.profilePicture ? (
                            <Image
                                style={styles.proImage}
                                resizeMode="cover"
                                source={{uri: this.props.S3_BUCKET_LINK + selectedActivity?.activityDetail.profilePicture}}
                            />
                        ) : valueExists(selectedActivity?.activityDetail.name)
                            ? <View style={{...styles.proBgMain, backgroundColor: Colors.colors.blue3}}>

                                <Text style={styles.proLetterMain}>
                                    {valueExists(selectedActivity?.activityDetail.name)
                                    && selectedActivity?.activityDetail.name.charAt(0).toUpperCase()}
                                </Text>

                            </View>
                            : null
                        }
                        {ACTIVITY_ACTION_TYPES[selectedActivity.activityType] !== ACTIVITY_ACTION_TYPES.LOGIN &&
                        <View>

                            <Text style={styles.infoDarkText}>
                                {selectedActivity?.activityDetail.name || selectedActivity?.referenceText}
                            </Text>

                            <Text style={styles.infoGreyText}>
                                {selectedActivity?.activityDetail.designation}
                            </Text>

                        </View>
                        }
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const {infoModalOpen, selectedActivity} = this.state;
        if (this.state.isLoading) {
            return <Loader/>;
        }

        return (
            <Container style={{backgroundColor: Colors.colors.screenBG}}>
                <Header transparent style={styles.reportHeader}>
                    <StatusBar
                        backgroundColor="transparent"
                        barStyle="light-content"
                        translucent
                    />
                    <Left>
                        <BackButton
                            onPress={this.props.backClicked}
                        />
                    </Left>
                    <Body/>
                    {/*<Right>*/}
                    {/*    <Button transparent*/}
                    {/*            onPress={() => {*/}
                    {/*                this.refs.modalFilterView.open()*/}
                    {/*            }}*/}
                    {/*    >*/}
                    {/*        <Image*/}
                    {/*            style={styles.filterIcon}*/}
                    {/*            resizeMode={'contain'}*/}
                    {/*            source={require('../../assets/images/Filter-icon.png')}/>*/}
                    {/*    </Button>*/}
                    {/*</Right>*/}
                </Header>
                <View style={styles.titleWrap}>
                    <Text style={{...CommonStyles.styles.commonAptHeader, marginBottom: 0}}>
                        {this.props.title}
                    </Text>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.mainScrollView}
                    onScroll={({nativeEvent}) => {
                        if (
                            isCloseToBottom(nativeEvent) &&
                            this.state.hasMore &&
                            this.state.isLoadingMore !== true
                        ) {
                            this.loadProgressReport(true);
                        }
                    }}>

                    {this.props.section === 'OUTCOMES'
                        ? this.getOutcomes()
                        : this.props.section === 'RISK_TAGS'
                            ? this.getRiskTags()
                            : this.props.section === 'ASSIGNED_CONTENT'
                                ? this.getAssignedContent()
                                : this.props.section === 'DCT_ATTEMPTS'
                                    ? this.getDCTAttempts() : this.getRecentActivity()}

                    {this.state.isLoadingMore !== null ? (
                        <View style={styles.loadMoreView}>
                            <ActivityIndicator
                                style={styles.loadIcon}
                                animating={this.state.isLoadingMore}
                                size="small"
                                color={'#969FA8'}
                            />
                        </View>
                    ) : null}
                </ScrollView>
                {this.props.isLoading ? (
                    <View style={styles.loadersty}>
                        <LottieView
                            style={styles.emptyImage}
                            resizeMode="cover"
                            source={teamAnim}
                            autoPlay={true}
                            loop
                        />
                    </View>
                ) : null}

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.infoDrawerClose}
                    style={{...CommonStyles.styles.commonModalWrapper, maxHeight: 470}}
                    entry={"bottom"}
                    isOpen={infoModalOpen}
                    position={"bottom"} ref={"modalInfoView"} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <Content
                        showsVerticalScrollIndicator={false}
                    >
                        {selectedActivity && this.renderActivityLog()}
                    </Content>
                    {/*<View style={styles.btnWrap}>*/}
                    {/*    <PrimaryButton*/}
                    {/*        text={'View appointment'}*/}
                    {/*    />*/}
                    {/*</View>*/}
                </Modal>

                <Modal
                    backdropPressToClose={true}
                    backdropColor={Colors.colors.overlayBg}
                    backdropOpacity={1}
                    onClosed={this.filterDrawerClose}
                    style={{...CommonStyles.styles.commonModalWrapper, maxHeight: '80%'}}
                    entry={"bottom"}
                    position={"bottom"} ref={"modalFilterView"} swipeArea={100}>
                    <View style={{...CommonStyles.styles.commonSwipeBar}}
                          {...addTestID('swipeBar')}
                    />
                    <Content
                        showsVerticalScrollIndicator={false}>
                        <View style={styles.filterTitleWrap}>
                            <Text style={styles.filtermodalTitle}>Filter activity</Text>
                            <Text style={styles.filtermodalCount}>312 total</Text>
                        </View>

                        <View style={{marginBottom: 16}}>
                            <CommonSegmentHeader
                                segments={[
                                    {title: 'Categories', segmentId: 'categories'},
                                    {title: 'Calendar', segmentId: 'calender'}]}
                                // segmentChanged={(segmentId) => {
                                //
                                // }}
                            />
                        </View>
                        <View style={styles.filterList}>
                            <SingleCheckListItem
                                listTestId={'list - activity'}
                                checkTestId={'checkbox - activity'}
                                // keyId={index}
                                // listPress={() => this.updateList(item.title)}
                                itemSelected={true}
                                itemTitle={'All activity'}
                                checkID={'checkbox - activity'}
                            />
                            <SingleCheckListItem
                                listTestId={'list - activity'}
                                checkTestId={'checkbox - activity'}
                                // keyId={index}
                                // listPress={() => this.updateList(item.title)}
                                itemSelected={false}
                                itemTitle={'Appointment scheduled'}
                                checkID={'checkbox - activity'}
                            />
                            <SingleCheckListItem
                                listTestId={'list - activity'}
                                checkTestId={'checkbox - activity'}
                                // keyId={index}
                                // listPress={() => this.updateList(item.title)}
                                itemSelected={false}
                                itemTitle={'Appointment completed'}
                                checkID={'checkbox - activity'}
                            />
                        </View>

                        <View style={styles.DateFilter}>
                            <DatePicker
                                style={{backgroundColor: 'white', height: 215, width: isIos ? 300 : undefined}}
                                // android not support width
                                // onDateChange={date => {
                                // }}
                            />
                        </View>

                    </Content>
                    <View style={styles.btnWrap}>
                        <PrimaryButton
                            text={'Show results'}
                        />
                    </View>
                </Modal>

            </Container>
        );
    }
}

const styles = StyleSheet.create({
    reportHeader: {
        height: HEADER_SIZE,
        paddingLeft: 24,
        paddingRight: 24
    },
    filterIcon: {
        width: 24,
        height: 24
    },
    titleWrap: {
        marginBottom: 12,
        alignItems: 'center'
    },
    mainScrollView: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: isIphoneX() ? 40 : 20
    },
    textBox: {
        flex: 1,
        paddingHorizontal: 12
    },
    memberName: {
        fontFamily: 'Roboto-Bold',
        fontSize: 21,
        letterSpacing: 0.58,
        color: '#25345c',
    },
    greyText: {
        color: '#969fa8',
        fontFamily: 'Roboto-Regular',
        fontSize: 13,
        letterSpacing: 0.3,
    },
    allSections: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingBottom: 30,
    },
    activityBox: {},
    outcomeBox: {},
    riskBox: {},
    sectionHead: {
        marginTop: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: 8,
        paddingRight: 8,
    },
    headText: {
        color: '#515d7d',
        fontFamily: 'Roboto-Regular',
        fontWeight: '600',
        fontSize: 13,
        letterSpacing: 0.75,
        textTransform: 'uppercase',
    },
    seeAllBtn: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    seeAllText: {
        paddingLeft: 0,
        paddingRight: 0,
        color: '#3fb2fe',
        fontSize: 14,
        letterSpacing: 0.28,
        fontFamily: 'Roboto-Regular',
    },
    wholeList: {
        // marginBottom: 16,
    },
    singleEntry: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        marginBottom: 16,
    },
    iconSide: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 24
    },
    activityText: {
        color: '#646c73',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
        paddingLeft: 16,
    },
    duskText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeBold
    },
    slateText: {
        color: '#646c73',
        fontSize: 13,
        fontFamily: 'Roboto-Regular',
        lineHeight: 20,
    },
    duskBold: {
        fontFamily: 'Roboto-Bold',
        color: '#515d7d',
        fontSize: 13,
        lineHeight: 20,
        fontWeight: '600'
    },
    timeText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeMedium
    },
    colorSide: {
        backgroundColor: '#77c70b',
        width: 72,
        height: '100%',
        overflow: 'hidden',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    largeText: {
        fontFamily: 'Roboto-Bold',
        fontSize: 20,
        color: '#fff',
    },
    smallText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 12,
        color: '#fff',
        position: 'absolute',
        top: 6,
        right: 6,
    },
    nextButton: {
        paddingRight: 16,
        paddingLeft: 16,
    },
    infoButton: {
        paddingTop: 0,
        paddingBottom: 0,
        height: 48,
        marginTop: -5
    },
    riskBorderBox: {
        borderLeftWidth: 4,
        borderLeftColor: '#77c70b',
        height: '100%',
        borderTopLeftRadius: 4,
        borderBottomLeftRadius: 4,
        justifyContent: 'center',
        flex: 1,
    },
    riskText: {
        fontFamily: 'Roboto-Regular',
        fontSize: 15,
        letterSpacing: 0.3,
        color: '#515d7d',
        paddingLeft: 24,
    },
    loadMoreView: {
        marginBottom: 15,
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loadIcon: {
        marginLeft: 5,
    },
    activitymodalTitle: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH3,
        ...TextStyles.mediaTexts.serifProBold,
        marginBottom: 4
    },
    activitymodalSubTitle: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeMedium
    },
    infoList: {
        paddingVertical: 32
    },
    singleInfo: {
        borderBottomWidth: 1,
        borderBottomColor: Colors.colors.highContrastBG,
        paddingVertical: 16
    },
    infoDarkText: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.bodyTextS,
        ...TextStyles.mediaTexts.manropeBold,
        paddingLeft: 10
    },
    infoGreyText: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeMedium,
        paddingLeft: 10
    },
    filterTitleWrap: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32
    },
    filtermodalTitle: {
        color: Colors.colors.highContrast,
        ...TextStyles.mediaTexts.TextH3,
        ...TextStyles.mediaTexts.serifProBold
    },
    filtermodalCount: {
        color: Colors.colors.lowContrast,
        ...TextStyles.mediaTexts.captionText,
        ...TextStyles.mediaTexts.manropeMedium
    },
    btnWrap: {
        paddingBottom: isIphoneX() ? 34 : 24
    },
    proImage: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
    },
    proBgMain: {
        width: 65,
        height: 65,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proLetterMain: {
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.whiteColor,
    },
    emptyView: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 20,
        paddingBottom: 20
    },
    emptyAnim: {
        width: '90%',
        // alignSelf: 'center',
        marginBottom: 30,
    },
    emptyTextMain: {
        ...TextStyles.mediaTexts.serifProBold,
        ...TextStyles.mediaTexts.TextH3,
        color: Colors.colors.highContrast,
        alignSelf: 'center',
        marginBottom: 8
    },
    emptyTextDes: {
        alignSelf: 'center',
        ...TextStyles.mediaTexts.manropeRegular,
        ...TextStyles.mediaTexts.bodyTextM,
        color: Colors.colors.mediumContrast,
        paddingLeft: 16,
        paddingRight: 16,
        textAlign: 'center',
        marginBottom: 32
    },
});

